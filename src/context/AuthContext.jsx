import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Load profile dari tabel profiles ──
    async function loadProfile(userId) {
        if (!userId) { setProfile(null); return; }
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        setProfile(data ?? null);
    }

    useEffect(() => {
        // Cek session aktif saat pertama load
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null;
            setUser(u);
            loadProfile(u?.id);
            setLoading(false);
        });

        // Listen perubahan auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const u = session?.user ?? null;
                setUser(u);
                loadProfile(u?.id);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // ── Sign Up ──
    async function signUp({ email, password, fullName }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        return { data, error };
    }

    // ── Sign In ──
    async function signIn({ email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }

    // ── Sign Out ──
    async function signOut() {
        await supabase.auth.signOut();
        setProfile(null);
    }

    // ── Reset Password (kirim email) ──
    async function resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { data, error };
    }

    // ── Update Profile ──
    async function updateProfile(updates) {
        if (!user) return { error: { message: "Tidak ada user aktif" } };
        const { data, error } = await supabase
            .from("profiles")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", user.id)
            .select()
            .single();
        if (!error) setProfile(data);
        return { data, error };
    }

    // ── Get Member Summary (dari view) ──
    async function getMemberSummary() {
        if (!user) return null;
        const { data } = await supabase
            .from("member_summary")
            .select("*")
            .eq("id", user.id)
            .single();
        return data;
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        getMemberSummary,
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
