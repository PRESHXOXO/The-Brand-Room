import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseBrowserClient: SupabaseClient | null = null;
let supabasePublicClient: SupabaseClient | null = null;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function getSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return supabaseBrowserClient;
}

export function getSupabasePublicClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!supabasePublicClient) {
    supabasePublicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabasePublicClient;
}
