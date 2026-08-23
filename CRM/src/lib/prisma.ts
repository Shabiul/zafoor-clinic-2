/**
 * Supabase Data Access Client (Replaces Prisma engine)
 * All operations execute natively over @supabase/supabase-js with full PostgREST support.
 */
import { db } from "./supabase-db"

export const prisma = db
export { db }
