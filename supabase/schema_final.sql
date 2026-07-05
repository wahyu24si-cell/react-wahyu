-- ============================================================
-- GACOR RESTAURANT - SCHEMA FINAL (v1 + v2 digabung)
-- 
-- CARA PAKAI:
-- 1. Buka Supabase Dashboard → SQL Editor → New Query
-- 2. Copy-paste SEMUA isi file ini
-- 3. Klik RUN
-- 4. Selesai! Lanjut setup akun admin di bawah.
-- ============================================================


-- ============================================================
-- RESET: Hapus semua yang lama (aman dijalankan berulang)
-- ============================================================
DROP VIEW  IF EXISTS public.member_summary CASCADE;
DROP VIEW  IF EXISTS public.my_profile CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.reward_history CASCADE;
DROP TABLE IF EXISTS public.member_orders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.update_member_tier CASCADE;
DROP FUNCTION IF EXISTS public.get_my_role CASCADE;


-- ============================================================
-- 1. TABEL PROFILES
--    Menyimpan data tambahan user + ROLE (admin / member)
-- ============================================================
CREATE TABLE public.profiles (
    id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    phone       TEXT,
    city        TEXT,
    birth_date  DATE,
    avatar_url  TEXT,
    role        TEXT        NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    tier        TEXT        NOT NULL DEFAULT 'Bronze'  CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    points      INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat & edit profil sendiri
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admin bisa lihat semua profil
CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id
        OR EXISTS (
            SELECT 1 FROM public.profiles p2
            WHERE p2.id = auth.uid() AND p2.role = 'admin'
        )
    );

-- Insert hanya via trigger
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);


-- ============================================================
-- 2. TABEL MEMBER_ORDERS (riwayat pesanan member)
-- ============================================================
CREATE TABLE public.member_orders (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_code  TEXT        NOT NULL UNIQUE,
    items       TEXT        NOT NULL,
    total       INTEGER     NOT NULL,
    status      TEXT        NOT NULL DEFAULT 'Preparing'
                            CHECK (status IN ('Preparing', 'On Delivery', 'Delivered', 'Canceled')),
    rating      SMALLINT    CHECK (rating BETWEEN 1 AND 5),
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.member_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
    ON public.member_orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON public.member_orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
    ON public.member_orders FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin bisa lihat semua orders
CREATE POLICY "Admin can view all orders"
    ON public.member_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- 3. TABEL REWARD_HISTORY (riwayat poin)
-- ============================================================
CREATE TABLE public.reward_history (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT        NOT NULL CHECK (type IN ('earn', 'redeem')),
    points      INTEGER     NOT NULL,
    description TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reward_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reward history"
    ON public.reward_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reward history"
    ON public.reward_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 4. TABEL BOOKINGS (pemesanan paket catering)
-- ============================================================
CREATE TABLE public.bookings (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    package_name TEXT        NOT NULL,
    contact_name TEXT        NOT NULL,
    phone        TEXT        NOT NULL,
    event_date   DATE        NOT NULL,
    pax          INTEGER     NOT NULL,
    notes        TEXT,
    status       TEXT        NOT NULL DEFAULT 'Pending'
                             CHECK (status IN ('Pending', 'Confirmed', 'Canceled', 'Done')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin bisa lihat semua bookings
CREATE POLICY "Admin can view all bookings"
    ON public.bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- 5. TRIGGER: Auto-create profile saat user daftar
-- ============================================================
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

    -- Catat bonus poin pendaftaran
    INSERT INTO public.reward_history (user_id, type, points, description)
    VALUES (NEW.id, 'earn', 500, 'Bonus poin pendaftaran member baru')
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 6. TRIGGER: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON public.member_orders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 7. TRIGGER: Auto-update tier berdasarkan poin
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_member_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF    NEW.points >= 2000 THEN NEW.tier = 'Platinum';
    ELSIF NEW.points >= 1000 THEN NEW.tier = 'Gold';
    ELSIF NEW.points >= 500  THEN NEW.tier = 'Silver';
    ELSE                          NEW.tier = 'Bronze';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER auto_update_tier
    BEFORE UPDATE OF points ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_member_tier();


-- ============================================================
-- 8. FUNCTION: Cek role user yang sedang login
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;


-- ============================================================
-- 9. VIEW: Ringkasan data member
-- ============================================================
CREATE OR REPLACE VIEW public.member_summary AS
SELECT
    p.id,
    p.full_name,
    p.role,
    p.tier,
    p.points,
    p.phone,
    p.city,
    p.avatar_url,
    p.created_at                    AS member_since,
    COUNT(DISTINCT o.id)            AS total_orders,
    COALESCE(SUM(
        CASE WHEN o.status = 'Delivered' THEN o.total ELSE 0 END
    ), 0)                           AS total_spent,
    COUNT(DISTINCT b.id)            AS total_bookings
FROM public.profiles p
LEFT JOIN public.member_orders o ON o.user_id = p.id
LEFT JOIN public.bookings      b ON b.user_id = p.id
GROUP BY p.id, p.full_name, p.role, p.tier, p.points,
         p.phone, p.city, p.avatar_url, p.created_at;

CREATE OR REPLACE VIEW public.my_profile AS
    SELECT * FROM public.profiles WHERE id = auth.uid();


-- ============================================================
-- 10. INDEXES
-- ============================================================
CREATE INDEX idx_profiles_role            ON public.profiles(role);
CREATE INDEX idx_member_orders_user_id    ON public.member_orders(user_id);
CREATE INDEX idx_member_orders_status     ON public.member_orders(status);
CREATE INDEX idx_reward_history_user_id   ON public.reward_history(user_id);
CREATE INDEX idx_bookings_user_id         ON public.bookings(user_id);
CREATE INDEX idx_bookings_event_date      ON public.bookings(event_date);


-- ============================================================
-- SELESAI! Schema sudah siap.
--
-- LANGKAH SELANJUTNYA:
--
-- ── BUAT AKUN ADMIN ──────────────────────────────────────────
-- 1. Supabase Dashboard → Authentication → Users → "Add user"
--    Email    : admin@gacor.id
--    Password : Admin123!
--    (centang "Auto Confirm User")
--
-- 2. Setelah user dibuat, jalankan SQL ini:
--    UPDATE public.profiles
--    SET role = 'admin', full_name = 'Super Admin'
--    WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@gacor.id');
--
-- ── BUAT AKUN MEMBER ─────────────────────────────────────────
-- Daftar lewat halaman /register di app.
-- Role otomatis = 'member', poin awal = 500.
--
-- ── HUBUNGKAN KE APP ─────────────────────────────────────────
-- Isi file .env di root project:
--   VITE_SUPABASE_URL=https://xxxx.supabase.co
--   VITE_SUPABASE_ANON_KEY=eyJhbGci...
-- Lalu restart: npm run dev
-- ============================================================
