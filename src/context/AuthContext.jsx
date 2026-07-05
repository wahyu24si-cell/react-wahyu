import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * AuthContext — menyimpan state user yang sedang login secara global.
 * Wrap App dengan <AuthProvider> agar semua komponen bisa akses user.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cek session aktif saat pertama load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen perubahan auth (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * signUp — Daftar akun baru dengan email & password
     * Supabase otomatis kirim email verifikasi (bisa dikonfigurasi di dashboard)
     */
    async function signUp({ email, password, fullName }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        });
        return { data, error };
    }

    /**
     * signIn — Login dengan email & password
     */
    async function signIn({ email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }

    /**
     * signOut — Logout dan hapus session
     */
    async function signOut() {
        await supabase.auth.signOut();
    }

    /**
     * resetPassword — Kirim link reset password ke email
     */
    async function resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { data, error };
    }

    const value = { user, loading, signUp, signIn, signOut, resetPassword };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth — hook untuk mengakses auth context
 * Contoh: const { user, signIn, signOut } = useAuth();
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
    return ctx;
}
