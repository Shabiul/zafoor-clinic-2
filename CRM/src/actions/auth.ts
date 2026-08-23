"use server"

import { redirect } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { verifyPassword, createSession, destroySession } from "@/lib/auth"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export async function login(input: LoginInput) {
  try {
    const data = loginSchema.parse(input)
    const supabase = getSupabase()

    const { data: user, error: dbError } = await supabase
      .from("User")
      .select("*")
      .eq("email", data.email.toLowerCase().trim())
      .maybeSingle()

    if (dbError) {
      console.error("[login] Supabase query error:", dbError)
      return { success: false, error: "Database connection failed. Please check Supabase credentials." }
    }

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    if (!user.active) {
      return { success: false, error: "This staff account is currently inactive. Please contact the administrator." }
    }

    // Check exact password or trimmed password to prevent copy-paste whitespace errors
    const passwordValid =
      verifyPassword(data.password, user.passwordHash) ||
      verifyPassword(data.password.trim(), user.passwordHash)

    if (!passwordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    await createSession(user.id)
    return { success: true, user: { id: user.id, name: user.name, role: user.role } }
  } catch (err: any) {
    console.error("[login] Error:", err)
    return { success: false, error: err?.message || "Invalid email or password" }
  }
}

export async function logout() {
  await destroySession()
  redirect("/login")
}
