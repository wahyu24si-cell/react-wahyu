import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal({ mode: initialMode, onClose }) {
    const navigate = useNavigate();
    const { signIn, signUp, user, role, loading } = useAuth();

    const [mode, setMode]               = useState(initialMode);
    const [submitting, setSubmitting]   = useState(false);
    const [waitingRedirect, setWaitingRedirect] = useState(false);
    const [error, setError]             = useState("");
    const [success, setSuccess]         = useState("");
    const [showPw, setShowPw]           = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [regForm, setRegForm]     = useState({
        fullName: "", email: "", password: "", confirm: "", agree: false,
    });

    // Setelah login, tunggu role selesai load lalu redirect
    useEffect(() => {
        if (waitingRedirect && !loading && user) {
            onClose();
            navigate(role === "admin" ? "/admin" : "/member");
            setWaitingRedirect(false);
        }
    }, [waitingRedirect, loading, user, role]);

    function clearErrors() { setError(""); setSuccess(""); }

    // Terjemahkan pesan error Supabase ke Bahasa Indonesia
    function translateError(msg) {
        if (!msg) return "Terjadi kesalahan, coba lagi";
        if (msg.includes("rate limit") || msg.includes("email rate"))
            return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi, atau matikan konfirmasi email di Supabase Dashboard → Authentication → Email.";
        if (msg.includes("Invalid login") || msg.includes("invalid_credentials"))
            return "Email atau password salah";
        if (msg.includes("not confirmed"))
            return "Cek email kamu untuk verifikasi, atau matikan 'Confirm email' di Supabase Dashboard";
        if (msg.includes("already registered") || msg.includes("User already registered"))
            return "Email sudah terdaftar, silakan login";
        if (msg.includes("Password should be"))
            return "Password minimal 6 karakter";
        if (msg.includes("Unable to validate"))
            return "Format email tidak valid";
        return msg;
    }

    // ── LOGIN ──────────────────────────────────────────────
    async function handleLogin(e) {
        e.preventDefault();
        if (!loginForm.email.trim()) { setError("Email wajib diisi"); return; }
        if (!loginForm.password)     { setError("Password wajib diisi"); return; }

        setSubmitting(true); clearErrors();

        const { error: err } = await signIn({
            email:    loginForm.email.trim(),
            password: loginForm.password,
        });

        setSubmitting(false);

        if (err) { setError(translateError(err.message)); return; }

        // Login berhasil — tunggu AuthContext load profile via useEffect lalu redirect
        setWaitingRedirect(true);
    }

    // ── REGISTER ───────────────────────────────────────────
    async function handleRegister(e) {
        e.preventDefault();

        if (!regForm.fullName.trim())                                  { setError("Nama wajib diisi"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email))        { setError("Email tidak valid"); return; }
        // Password cukup min 6 karakter — bebas kombinasi apa saja
        if (regForm.password.length < 6)                               { setError("Password minimal 6 karakter"); return; }
        if (regForm.password !== regForm.confirm)                      { setError("Password dan konfirmasi tidak cocok"); return; }
        if (!regForm.agree)                                            { setError("Centang persetujuan syarat & ketentuan"); return; }

        setSubmitting(true); clearErrors();

        const { error: err } = await signUp({
            email:    regForm.email.trim(),
            password: regForm.password,
            fullName: regForm.fullName.trim(),
        });

        setSubmitting(false);

        if (err) { setError(translateError(err.message)); return; }

        setSuccess("Akun berhasil dibuat! Silakan login sekarang.");
        setTimeout(() => { clearErrors(); setMode("login"); }, 2500);
    }

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose} style={{
                position: "fixed", inset: 0, zIndex: 1000,
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
            }} />

            {/* Modal */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 1001,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "16px",
            }}>
                {/* Loading redirect */}
                {waitingRedirect ? (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,107,53,0.2)", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
                        <p style={{ color: "#888", fontSize: "13px" }}>Memuat profil...</p>
                    </div>
                ) : (
                <div style={{
                    backgroundColor: "#13131f",
                    borderRadius: "20px", padding: "32px",
                    width: "100%", maxWidth: "400px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                    maxHeight: "90vh", overflowY: "auto",
                    position: "relative",
                }}>
                    backgroundColor: "#13131f",
                    borderRadius: "20px", padding: "32px",
                    width: "100%", maxWidth: "400px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                    maxHeight: "90vh", overflowY: "auto",
                    position: "relative",
                }}>

                    {/* Tombol tutup */}
                    <button type="button" onClick={onClose} style={{
                        position: "absolute", top: "14px", right: "16px",
                        background: "none", border: "none", color: "#555",
                        fontSize: "20px", cursor: "pointer", lineHeight: 1,
                    }}>✕</button>

                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <span style={{ fontSize: "26px", fontWeight: 900, color: "#fff" }}>
                            Gacor<span style={{ color: "#ff6b35" }}>.</span>
                        </span>
                    </div>

                    {/* Tab */}
                    <div style={{
                        display: "flex", backgroundColor: "#1e1e2e",
                        borderRadius: "10px", padding: "4px", marginBottom: "20px",
                    }}>
                        {[
                            { id: "login", label: "Masuk" },
                            { id: "register", label: "Daftar" },
                        ].map((t) => (
                            <button key={t.id} type="button"
                                onClick={() => { setMode(t.id); clearErrors(); }}
                                style={{
                                    flex: 1, padding: "9px", borderRadius: "7px", border: "none",
                                    cursor: "pointer", fontSize: "13px", fontWeight: 700,
                                    backgroundColor: mode === t.id ? "#ff6b35" : "transparent",
                                    color: mode === t.id ? "#fff" : "#666",
                                    transition: "all 0.2s",
                                }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Alert error */}
                    {error && (
                        <div style={{
                            backgroundColor: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: "8px", padding: "12px 14px",
                            marginBottom: "16px", fontSize: "13px",
                            color: "#ef4444", lineHeight: 1.5,
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Alert sukses */}
                    {success && (
                        <div style={{
                            backgroundColor: "rgba(16,185,129,0.1)",
                            border: "1px solid rgba(16,185,129,0.3)",
                            borderRadius: "8px", padding: "12px 14px",
                            marginBottom: "16px", fontSize: "13px", color: "#10b981",
                        }}>
                            ✅ {success}
                        </div>
                    )}

                    {/* ── FORM LOGIN ── */}
                    {mode === "login" && (
                        <form onSubmit={handleLogin} noValidate>
                            <p style={{ fontSize: "13px", color: "#777", marginBottom: "18px", textAlign: "center" }}>
                                Masuk ke akun Gacor kamu
                            </p>

                            <FormField label="Email">
                                <input type="email" value={loginForm.email}
                                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="kamu@email.com"
                                    style={inputSt} autoComplete="email" />
                            </FormField>

                            <FormField label="Password">
                                <div style={{ position: "relative" }}>
                                    <input type={showPw ? "text" : "password"} value={loginForm.password}
                                        onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                                        placeholder="Password kamu"
                                        style={{ ...inputSt, paddingRight: "42px" }}
                                        autoComplete="current-password" />
                                    <EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />
                                </div>
                            </FormField>

                            <div style={{ textAlign: "right", marginBottom: "18px" }}>
                                <button type="button"
                                    onClick={() => { onClose(); navigate("/forgot"); }}
                                    style={{ background: "none", border: "none", color: "#ff6b35", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
                                    Lupa password?
                                </button>
                            </div>

                            <SubmitBtn loading={submitting} label="Masuk →" />

                            <div style={{ marginTop: "14px", padding: "10px", backgroundColor: "rgba(59,130,246,0.06)", borderRadius: "8px", fontSize: "11px", color: "#777", textAlign: "center" }}>
                                Demo admin: <strong style={{ color: "#3b82f6" }}>admin@gacor.id</strong> / Admin123!
                            </div>
                        </form>
                    )}

                    {/* ── FORM REGISTER ── */}
                    {mode === "register" && (
                        <form onSubmit={handleRegister} noValidate>
                            <p style={{ fontSize: "13px", color: "#777", marginBottom: "18px", textAlign: "center" }}>
                                Daftar gratis · Dapat <strong style={{ color: "#ff6b35" }}>500 poin</strong> bonus
                            </p>

                            <FormField label="Nama Lengkap">
                                <input type="text" value={regForm.fullName}
                                    onChange={e => setRegForm(p => ({ ...p, fullName: e.target.value }))}
                                    placeholder="Nama kamu"
                                    style={inputSt} autoComplete="name" />
                            </FormField>

                            <FormField label="Email">
                                <input type="email" value={regForm.email}
                                    onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="kamu@email.com"
                                    style={inputSt} autoComplete="email" />
                            </FormField>

                            {/* Password — DIPERMUDAH: min 6 karakter bebas */}
                            <FormField label="Password">
                                <div style={{ position: "relative" }}>
                                    <input type={showPw ? "text" : "password"} value={regForm.password}
                                        onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                                        placeholder="Minimal 6 karakter (bebas)"
                                        style={{ ...inputSt, paddingRight: "42px" }}
                                        autoComplete="new-password" />
                                    <EyeBtn show={showPw} toggle={() => setShowPw(v => !v)} />
                                </div>
                                {/* Hint simpel */}
                                <p style={{ fontSize: "11px", color: "#666", margin: "4px 0 0" }}>
                                    Contoh: <span style={{ color: "#aaa" }}>wahyu123</span> atau <span style={{ color: "#aaa" }}>gacor2026</span>
                                </p>
                            </FormField>

                            <FormField label="Konfirmasi Password">
                                <div style={{ position: "relative" }}>
                                    <input type={showConfirm ? "text" : "password"} value={regForm.confirm}
                                        onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))}
                                        placeholder="Ketik ulang password"
                                        style={{
                                            ...inputSt, paddingRight: "42px",
                                            borderColor: regForm.confirm && regForm.password !== regForm.confirm
                                                ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
                                        }}
                                        autoComplete="new-password" />
                                    <EyeBtn show={showConfirm} toggle={() => setShowConfirm(v => !v)} />
                                </div>
                                {regForm.confirm && regForm.password !== regForm.confirm && (
                                    <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0" }}>Password tidak cocok</p>
                                )}
                            </FormField>

                            <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", cursor: "pointer" }}>
                                <input type="checkbox" checked={regForm.agree}
                                    onChange={e => setRegForm(p => ({ ...p, agree: e.target.checked }))}
                                    style={{ accentColor: "#ff6b35", width: "15px", height: "15px", flexShrink: 0 }} />
                                <span style={{ fontSize: "12px", color: "#888" }}>
                                    Saya menyetujui{" "}
                                    <span style={{ color: "#ff6b35", fontWeight: 600 }}>Syarat & Ketentuan</span>
                                </span>
                            </label>

                            <SubmitBtn loading={submitting} label="Buat Akun →" />
                        </form>
                    )}
                </div>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

// ── Helper components ──────────────────────────────────────

function FormField({ label, children }) {
    return (
        <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function EyeBtn({ show, toggle }) {
    return (
        <button type="button" onClick={toggle}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#666", padding: 0 }}>
            {show ? "🙈" : "👁️"}
        </button>
    );
}

function SubmitBtn({ loading, label }) {
    return (
        <button type="submit" disabled={loading}
            style={{
                width: "100%", padding: "13px",
                backgroundColor: loading ? "#374151" : "#ff6b35",
                color: "white", border: "none", borderRadius: "10px",
                fontWeight: 700, fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#e55a25"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = loading ? "#374151" : "#ff6b35"; }}>
            {loading ? (
                <>
                    <span style={{ width: "14px", height: "14px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    Memproses...
                </>
            ) : label}
        </button>
    );
}

const inputSt = {
    width: "100%", padding: "10px 12px",
    backgroundColor: "#1e1e2e", color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
};
