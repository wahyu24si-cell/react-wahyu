import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal({ mode: initialMode, onClose }) {
    const navigate = useNavigate();
    const { signIn, signUp, user, role, loading } = useAuth();

    const [mode, setMode]               = useState(initialMode);
    const [submitting, setSubmitting]   = useState(false);
    const [waitingRedirect, setWaiting] = useState(false);
    const [error, setError]             = useState("");
    const [success, setSuccess]         = useState("");
    const [showPw, setShowPw]           = useState(false);
    const [showCfm, setShowCfm]         = useState(false);

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [regForm,   setRegForm]   = useState({ fullName: "", email: "", password: "", confirm: "", agree: false });

    // Setelah login, tunggu profile ter-load lalu redirect
    useEffect(() => {
        if (waitingRedirect && !loading && user) {
            onClose();
            navigate(role === "admin" ? "/admin" : "/member");
        }
    }, [waitingRedirect, loading, user, role]);

    function clear() { setError(""); setSuccess(""); }

    function xlate(msg) {
        if (!msg) return "Terjadi kesalahan";
        if (msg.includes("rate limit"))          return "Terlalu banyak percobaan, tunggu beberapa menit";
        if (msg.includes("Invalid login") || msg.includes("invalid_credentials")) return "Email atau password salah";
        if (msg.includes("not confirmed"))       return "Verifikasi email kamu dulu (atau matikan Confirm Email di Supabase)";
        if (msg.includes("already registered"))  return "Email sudah terdaftar, silakan login";
        if (msg.includes("Password should be"))  return "Password minimal 6 karakter";
        return msg;
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!loginForm.email.trim()) { setError("Email wajib diisi"); return; }
        if (!loginForm.password)     { setError("Password wajib diisi"); return; }
        setSubmitting(true); clear();
        const { error: err } = await signIn({ email: loginForm.email.trim(), password: loginForm.password });
        setSubmitting(false);
        if (err) { setError(xlate(err.message)); return; }
        setWaiting(true);
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (!regForm.fullName.trim())                              { setError("Nama wajib diisi"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email))    { setError("Email tidak valid"); return; }
        if (regForm.password.length < 6)                           { setError("Password minimal 6 karakter"); return; }
        if (regForm.password !== regForm.confirm)                  { setError("Password tidak cocok"); return; }
        if (!regForm.agree)                                        { setError("Centang persetujuan dulu"); return; }
        setSubmitting(true); clear();
        const { error: err } = await signUp({ email: regForm.email.trim(), password: regForm.password, fullName: regForm.fullName.trim() });
        setSubmitting(false);
        if (err) { setError(xlate(err.message)); return; }
        setSuccess("Akun berhasil dibuat! Silakan login.");
        setTimeout(() => { clear(); setMode("login"); }, 2000);
    }

    // Tampilan loading saat menunggu redirect
    if (waitingRedirect) {
        return (
            <>
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />
                <div style={{ position: "fixed", inset: 0, zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,107,53,0.2)", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
                        <p style={{ color: "#888", fontSize: "13px" }}>Memuat profil...</p>
                    </div>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />

            {/* Modal */}
            <div style={{ position: "fixed", inset: 0, zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ backgroundColor: "#13131f", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "400px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>

                    {/* Close */}
                    <button type="button" onClick={onClose} style={{ position: "absolute", top: "14px", right: "16px", background: "none", border: "none", color: "#555", fontSize: "20px", cursor: "pointer" }}>✕</button>

                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <span style={{ fontSize: "26px", fontWeight: 900, color: "#fff" }}>Gacor<span style={{ color: "#ff6b35" }}>.</span></span>
                    </div>

                    {/* Tab switch */}
                    <div style={{ display: "flex", backgroundColor: "#1e1e2e", borderRadius: "10px", padding: "4px", marginBottom: "20px" }}>
                        {[{ id: "login", label: "Masuk" }, { id: "register", label: "Daftar" }].map(t => (
                            <button key={t.id} type="button" onClick={() => { setMode(t.id); clear(); }}
                                style={{ flex: 1, padding: "9px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, backgroundColor: mode === t.id ? "#ff6b35" : "transparent", color: mode === t.id ? "#fff" : "#666", transition: "all 0.2s" }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Alerts */}
                    {error && <Alert type="error">{error}</Alert>}
                    {success && <Alert type="success">{success}</Alert>}

                    {/* ── LOGIN ── */}
                    {mode === "login" && (
                        <form onSubmit={handleLogin} noValidate>
                            <p style={{ fontSize: "13px", color: "#777", marginBottom: "16px", textAlign: "center" }}>Masuk ke akun Gacor kamu</p>

                            <Field label="Email">
                                <input type="email" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="kamu@email.com" style={inp} autoComplete="email" />
                            </Field>

                            <Field label="Password">
                                <div style={{ position: "relative" }}>
                                    <input type={showPw ? "text" : "password"} value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                                        placeholder="Password kamu" style={{ ...inp, paddingRight: "42px" }} autoComplete="current-password" />
                                    <Eye show={showPw} toggle={() => setShowPw(v => !v)} />
                                </div>
                            </Field>

                            <div style={{ textAlign: "right", marginBottom: "16px" }}>
                                <button type="button" onClick={() => { onClose(); navigate("/forgot"); }}
                                    style={{ background: "none", border: "none", color: "#ff6b35", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
                                    Lupa password?
                                </button>
                            </div>

                            <Btn loading={submitting} label="Masuk →" />

                            <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "rgba(59,130,246,0.06)", borderRadius: "8px", fontSize: "11px", color: "#777", textAlign: "center" }}>
                                Demo admin: <strong style={{ color: "#3b82f6" }}>admin@gacor.id</strong> / Admin123!
                            </div>
                        </form>
                    )}

                    {/* ── REGISTER ── */}
                    {mode === "register" && (
                        <form onSubmit={handleRegister} noValidate>
                            <p style={{ fontSize: "13px", color: "#777", marginBottom: "16px", textAlign: "center" }}>
                                Daftar gratis · Dapat <strong style={{ color: "#ff6b35" }}>500 poin</strong> bonus
                            </p>

                            <Field label="Nama Lengkap">
                                <input type="text" value={regForm.fullName} onChange={e => setRegForm(p => ({ ...p, fullName: e.target.value }))}
                                    placeholder="Nama kamu" style={inp} autoComplete="name" />
                            </Field>

                            <Field label="Email">
                                <input type="email" value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="kamu@email.com" style={inp} autoComplete="email" />
                            </Field>

                            <Field label="Password">
                                <div style={{ position: "relative" }}>
                                    <input type={showPw ? "text" : "password"} value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                                        placeholder="Minimal 6 karakter" style={{ ...inp, paddingRight: "42px" }} autoComplete="new-password" />
                                    <Eye show={showPw} toggle={() => setShowPw(v => !v)} />
                                </div>
                                <p style={{ fontSize: "11px", color: "#666", margin: "3px 0 0" }}>
                                    Contoh: <span style={{ color: "#aaa" }}>wahyu123</span> atau <span style={{ color: "#aaa" }}>gacor2026</span>
                                </p>
                            </Field>

                            <Field label="Konfirmasi Password">
                                <div style={{ position: "relative" }}>
                                    <input type={showCfm ? "text" : "password"} value={regForm.confirm} onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))}
                                        placeholder="Ketik ulang password"
                                        style={{ ...inp, paddingRight: "42px", borderColor: regForm.confirm && regForm.password !== regForm.confirm ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }}
                                        autoComplete="new-password" />
                                    <Eye show={showCfm} toggle={() => setShowCfm(v => !v)} />
                                </div>
                                {regForm.confirm && regForm.password !== regForm.confirm && (
                                    <p style={{ fontSize: "11px", color: "#ef4444", margin: "3px 0 0" }}>Password tidak cocok</p>
                                )}
                            </Field>

                            <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", cursor: "pointer" }}>
                                <input type="checkbox" checked={regForm.agree} onChange={e => setRegForm(p => ({ ...p, agree: e.target.checked }))}
                                    style={{ accentColor: "#ff6b35", width: "15px", height: "15px", flexShrink: 0 }} />
                                <span style={{ fontSize: "12px", color: "#888" }}>
                                    Saya menyetujui <span style={{ color: "#ff6b35", fontWeight: 600 }}>Syarat & Ketentuan</span>
                                </span>
                            </label>

                            <Btn loading={submitting} label="Buat Akun →" />
                        </form>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

// ── Helpers ────────────────────────────────────────────────

function Alert({ type, children }) {
    const isErr = type === "error";
    return (
        <div style={{ backgroundColor: isErr ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${isErr ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: isErr ? "#ef4444" : "#10b981", lineHeight: 1.5 }}>
            {isErr ? "⚠️" : "✅"} {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div style={{ marginBottom: "13px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
            {children}
        </div>
    );
}

function Eye({ show, toggle }) {
    return (
        <button type="button" onClick={toggle} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#666", padding: 0 }}>
            {show ? "🙈" : "👁️"}
        </button>
    );
}

function Btn({ loading, label }) {
    return (
        <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "13px", backgroundColor: loading ? "#374151" : "#ff6b35", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#e55a25"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#ff6b35"; }}>
            {loading ? (
                <><span style={{ width: "14px", height: "14px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Memproses...</>
            ) : label}
        </button>
    );
}

const inp = {
    width: "100%", padding: "10px 12px", backgroundColor: "#1e1e2e", color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
};
