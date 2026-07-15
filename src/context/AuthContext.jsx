import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null);
    const [profile, setProfile] = useState(null);
    const [role,    setRole]    = useState(null);
    const [loading, setLoading] = useState(true); // true sampai profile selesai dimuat

    // ── Load profile + role dari tabel profiles ──────────────
    async function loadProfile(userId) {
        if (!userId) {
            setProfile(null);
            setRole(null);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                console.warn("[AuthContext] loadProfile error:", error.message);
                // Jika tabel tidak ada atau error RLS, default ke member
                setProfile(null);
                setRole("member");
            } else {
                setProfile(data);
                setRole(data?.role ?? "member");
            }
        } catch (err) {
            console.error("[AuthContext] unexpected error:", err);
            setRole("member");
        }
    }

    useEffect(() => {
        let mounted = true;

        // Cek session yang sudah ada
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!mounted) return;

            const u = session?.user ?? null;
            setUser(u);

            if (u?.id) {
                // Tunggu profile selesai dimuat SEBELUM set loading=false
                await loadProfile(u.id);
            }

            if (mounted) setLoading(false);
        });

        // Listen perubahan auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!mounted) return;

                const u = session?.user ?? null;
                setUser(u);

                if (u?.id) {
                    setLoading(true);
                    await loadProfile(u.id);
                    if (mounted) setLoading(false);
                } else {
                    setProfile(null);
                    setRole(null);
                    setLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    async function signUp({ email, password, fullName }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, role: "member" } },
        });
        return { data, error };
    }

    async function signIn({ email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
    }

    async function resetPassword(email) {
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
    }

    async function updateProfile(updates) {
        if (!user) return { error: { message: "Tidak ada user aktif" } };
        const { data, error } = await supabase
            .from("profiles")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", user.id)
            .select()
            .single();
        if (!error) {
            setProfile(data);
            setRole(data?.role ?? role);
        }
        return { data, error };
    }

    const isAdmin  = role === "admin";
    const isMember = !!user;
    const isGuest  = !user && !loading;


    const value = {
        user,
        profile,
        role,
        loading,
        isAdmin,
        isMember,
        isGuest,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile: () => loadProfile(user?.id),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
    return ctx;
}
