import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ""

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export function getSupabase() {
  if (!supabase) {
    throw new Error("Supabase client is not configured. Please check SUPABASE_URL and SUPABASE_SECRET_KEY.")
  }
  return supabase
}

export const STORAGE_BUCKET = "zafoor-documents"
