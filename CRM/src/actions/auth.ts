"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { verifyPassword, createSession, destroySession } from "@/lib/auth"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export async function login(input: LoginInput) {
  try {
    const data = loginSchema.parse(input)

    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    // Constant-shape failure: don't reveal whether the email exists.
    if (!user || !user.active || !verifyPassword(data.password, user.passwordHash)) {
      return { success: false, error: "Invalid email or password" }
    }

    await createSession(user.id)
    return { success: true, user: { id: user.id, name: user.name, role: user.role } }
  } catch (err: any) {
    console.error("[login] Error:", err)
    if (err?.code === "P1001" || err?.message?.includes("Can't reach database")) {
      return {
        success: false,
        error: "Database connection failed. Please ensure DATABASE_URL in Vercel is set to the Supabase Connection Pooler URL.",
      }
    }
    return { success: false, error: err?.message || "Invalid email or password" }
  }
}

export async function logout() {
  await destroySession()
  redirect("/login")
}
