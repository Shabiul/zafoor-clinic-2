import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { nanoid } from "nanoid"
import { getSupabase } from "@/lib/supabase"
import { serializeDecimal } from "@/lib/serialize"
import type { StaffRole, User } from "@/types/database"

const SESSION_COOKIE = "zafoor_session"
const SESSION_TTL_DAYS = 30

// ── Password hashing (scrypt, salted, constant-time compare) ─────────────

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const hashBuffer = Buffer.from(hash, "hex")
  const candidate = scryptSync(password, salt, 64)
  return hashBuffer.length === candidate.length && timingSafeEqual(candidate, hashBuffer)
}

// ── Sessions ───────────────────────────────────────────────────────────

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  const sessionId = "sess_" + nanoid(24)
  const supabase = getSupabase()

  const { error } = await supabase.from("Session").insert({
    id: sessionId,
    userId,
    expiresAt: expiresAt.toISOString(),
  })

  if (error) {
    console.error("[createSession] error:", error)
    throw new Error("Failed to create session: " + error.message)
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (sessionId) {
    const supabase = getSupabase()
    await supabase.from("Session").delete().eq("id", sessionId)
  }
  cookieStore.delete(SESSION_COOKIE)
}

/** Reads the session cookie and returns the signed-in user, or null. Cached per-request. */
export const getCurrentUserOrNull = cache(async () => {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value
    if (!sessionId) return null

    const supabase = getSupabase()
    const { data: session, error } = await supabase
      .from("Session")
      .select("*, user:User(*)")
      .eq("id", sessionId)
      .maybeSingle()

    if (error || !session || new Date(session.expiresAt) < new Date() || !session.user?.active) {
      return null
    }

    return session.user as User
  } catch {
    return null
  }
})

/** Same as `getCurrentUserOrNull` but redirects to /login if unauthenticated — use inside server actions/pages that require auth. */
export async function getCurrentUser() {
  const user = await getCurrentUserOrNull()
  if (!user) {
    redirect("/login")
  }
  return user
}

/** Server-side authorization gate. Never trust a client-side role check alone. */
export async function requireRole(...roles: StaffRole[]) {
  const user = await getCurrentUser()
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden: your role does not have access to this action")
  }
  return user
}

// ── Staff directory ────────────────────────────────────────────────────

export async function getAllStaff(): Promise<User[]> {
  const supabase = getSupabase()
  const { data: staff, error } = await supabase
    .from("User")
    .select("*")
    .order("name", { ascending: true })

  if (error || !staff) return []
  return staff.map((s) => serializeDecimal(s as User, ["consultationFee"])) as User[]
}

export async function getDoctors(): Promise<User[]> {
  const supabase = getSupabase()
  const { data: doctors, error } = await supabase
    .from("User")
    .select("*")
    .eq("role", "DOCTOR")
    .eq("active", true)
    .order("name", { ascending: true })

  if (error || !doctors) return []
  return doctors.map((d) => serializeDecimal(d as User, ["consultationFee"])) as User[]
}
