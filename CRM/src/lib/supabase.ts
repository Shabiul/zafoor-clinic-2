import { createClient, type SupabaseClient } from "@supabase/supabase-js"

function getCredentials() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ""

  return { url, key }
}

let _supabaseClient: SupabaseClient<any, "public", any> | null = null

export function getSupabase(): SupabaseClient<any, "public", any> {
  if (_supabaseClient) return _supabaseClient

  const { url, key } = getCredentials()
  if (!url || !key) {
    // If called at runtime without configuration, provide a clear error message
    throw new Error(
      "Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set in your environment."
    )
  }

  _supabaseClient = createClient<any>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return _supabaseClient
}

// Proxy wrapper so importing `supabase` does not evaluate eagerly at module load time
export const supabase: SupabaseClient<any, "public", any> = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabase()
    const val = (client as any)[prop]
    return typeof val === "function" ? val.bind(client) : val
  },
})

export const STORAGE_BUCKET = "zafoor-documents"
