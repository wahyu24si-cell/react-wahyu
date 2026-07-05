import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client — dikonfigurasi via environment variables.
 *
 * Cara setup:
 * 1. Buka https://supabase.com → buat project baru
 * 2. Project Settings → API → salin "Project URL" dan "anon public key"
 * 3. Isi file .env di root project:
 *    VITE_SUPABASE_URL=https://xxxx.supabase.co
 *    VITE_SUPABASE_ANON_KEY=eyJhbGci...
 * 4. Restart dev server
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "[Supabase] Environment variables belum diatur.\n" +
        "Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env"
    );
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key"
);
