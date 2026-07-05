-- ============================================================
-- GACOR RESTAURANT - SUPABASE DATABASE SCHEMA
-- Jalankan file ini di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- 1. TABEL PROFILES
--    Menyimpan data tambahan user selain yang ada di auth.users
--    Otomatis terisi saat user mendaftar lewat trigger di bawah
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    phone       TEXT,
    city        TEXT,
    birth_date  DATE,
    avatar_url  TEXT,
    tier        TEXT NOT NULL DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    points      INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Aktifkan Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa lihat & edit profil sendiri
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policy: insert hanya via trigger (system)
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);


-- ============================================================
-- 2. TABEL ORDERS (riwayat pesanan member)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.member_orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_code  TEXT NOT NULL UNIQUE,
    items       TEXT NOT NULL,
    total       INTEGER NOT NULL,
    status      TEXT NOT NULL DEFAULT 'Preparing'
                    CHECK (status IN ('Preparing', 'On Delivery', 'Delivered', 'Canceled')),
    rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
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


-- ============================================================
-- 3. TABEL REWARD HISTORY (riwayat poin)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reward_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
    points      INTEGER NOT NULL,
    description TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.bookings (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    package_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone        TEXT NOT NULL,
    event_date   DATE NOT NULL,
    pax          INTEGER NOT NULL,
    notes        TEXT,
    status       TEXT NOT NULL DEFAULT 'Pending'
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


-- ============================================================
-- 5. FUNCTION + TRIGGER: Auto-create profile saat user daftar
--    Dipanggil otomatis setiap kali ada user baru di auth.users
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, points, tier)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        500,        -- bonus poin pendaftaran
        'Bronze'
    );

    -- Catat bonus poin pendaftaran di reward history
    INSERT INTO public.reward_history (user_id, type, points, description)
    VALUES (
        NEW.id,
        'earn',
        500,
        'Bonus poin pendaftaran member baru'
    );

    RETURN NEW;
END;
$$;

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 6. FUNCTION: Auto-update updated_at timestamp
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
-- 7. FUNCTION: Update tier otomatis berdasarkan total poin
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_member_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.points >= 2000 THEN
        NEW.tier = 'Platinum';
    ELSIF NEW.points >= 1000 THEN
        NEW.tier = 'Gold';
    ELSIF NEW.points >= 500 THEN
        NEW.tier = 'Silver';
    ELSE
        NEW.tier = 'Bronze';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER auto_update_tier
    BEFORE UPDATE OF points ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_member_tier();


-- ============================================================
-- 8. VIEW: Profile lengkap (join profiles + auth data)
--    Digunakan untuk tampilan member dashboard
-- ============================================================

CREATE OR REPLACE VIEW public.member_summary AS
SELECT
    p.id,
    p.full_name,
    p.tier,
    p.points,
    p.phone,
    p.city,
    p.avatar_url,
    p.created_at AS member_since,
    COUNT(DISTINCT o.id)  AS total_orders,
    COALESCE(SUM(CASE WHEN o.status = 'Delivered' THEN o.total ELSE 0 END), 0) AS total_spent,
    COUNT(DISTINCT b.id)  AS total_bookings
FROM public.profiles p
LEFT JOIN public.member_orders o   ON o.user_id = p.id
LEFT JOIN public.bookings      b   ON b.user_id = p.id
GROUP BY p.id, p.full_name, p.tier, p.points, p.phone, p.city, p.avatar_url, p.created_at;


-- ============================================================
-- 9. INDEXES untuk performa query
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_member_orders_user_id  ON public.member_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_member_orders_status   ON public.member_orders(status);
CREATE INDEX IF NOT EXISTS idx_reward_history_user_id ON public.reward_history(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id       ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date    ON public.bookings(event_date);


-- ============================================================
-- SELESAI! 
-- Setelah menjalankan script ini:
-- 1. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env
-- 2. Restart dev server: npm run dev
-- 3. Buka /register untuk daftar akun pertama
-- ============================================================
