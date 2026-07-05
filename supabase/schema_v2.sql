-- ============================================================
-- GACOR RESTAURANT - SCHEMA UPDATE v2
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Tambah kolom ROLE ke tabel profiles ──────────────────
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('admin', 'member'));

-- ── 2. Update trigger agar set role saat register ───────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, points, tier)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'member'),
        500,
        'Bronze'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.reward_history (user_id, type, points, description)
    VALUES (NEW.id, 'earn', 500, 'Bonus poin pendaftaran member baru')
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$;

-- ── 3. Policy admin bisa lihat semua profiles ───────────────
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ── 4. Buat akun ADMIN (jalankan sekali) ────────────────────
-- Catatan: Supabase tidak bisa buat user via SQL biasa.
-- Gunakan cara berikut di SQL Editor Supabase:

-- Langkah A: Buat user lewat Supabase Auth → Users → Add User:
--   Email    : admin@gacor.id
--   Password : Admin123!
--
-- Langkah B: Setelah user dibuat, update role-nya:

-- UPDATE public.profiles
-- SET role = 'admin', full_name = 'Super Admin'
-- WHERE id = (
--     SELECT id FROM auth.users WHERE email = 'admin@gacor.id'
-- );

-- ── 5. Function cek role ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ── 6. Atau bisa pakai view ini untuk cek role ───────────────
CREATE OR REPLACE VIEW public.my_profile AS
    SELECT * FROM public.profiles WHERE id = auth.uid();

-- ============================================================
-- CARA SETUP AKUN:
--
-- ADMIN:
--   1. Buka Supabase → Authentication → Users → Add User
--   2. Email: admin@gacor.id | Password: Admin123!
--   3. Jalankan SQL:
--      UPDATE profiles SET role='admin', full_name='Super Admin'
--      WHERE id=(SELECT id FROM auth.users WHERE email='admin@gacor.id');
--
-- MEMBER (register normal lewat /register di app):
--   Email: member@gacor.id | Password: Member123!
--   Role otomatis = 'member'
-- ============================================================
