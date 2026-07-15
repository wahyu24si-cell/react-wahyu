import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate  = useNavigate();    
    const location  = useLocation();
    const { signIn, user, role, loading } = useAuth();

    const [submitting, setSubmitting] = useState(false);
    const [waitingRedirect, setWaitingRedirect] = useState(false);
    const [error, setError]           = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [dataForm, setDataForm]     = useState({ email: "", password: "" });

    // Setelah login berhasil, tunggu role ter-load lalu redirect
    useEffect(() => {
        if (waitingRedirect && !loading && user) {
            const from = location.state?.from;
            if (from) {
                navigate(from, { replace: true });
            } else if (role === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/member", { replace: true });
            }
            setWaitingRedirect(false);
        }
    }, [waitingRedirect, loading, user, role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm((p) => ({ ...p, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataForm.email.trim()) { setError("Email wajib diisi"); return; }
        if (!dataForm.password)     { setError("Password wajib diisi"); return; }

        setSubmitting(true);
        setError("");

        const { error: err } = await signIn({
            email:    dataForm.email.trim(),
            password: dataForm.password,
        });

        setSubmitting(false);

        if (err) {
            const msg =
                err.message.includes("Invalid login") || err.message.includes("invalid_credentials")
                    ? "Email atau password salah"
                    : err.message.includes("not confirmed")
                        ? "Silakan verifikasi email kamu terlebih dahulu"
                        : err.message;
            setError(msg);
            return;
        }

        // Login berhasil — tunggu AuthContext load profile lalu redirect via useEffect
        setWaitingRedirect(true);
    };

    // Tampilkan loading saat menunggu redirect
    if (waitingRedirect || (submitting === false && waitingRedirect)) {
        return (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,107,53,0.2)", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
                <p style={{ color: "#888", fontSize: "13px" }}>Memuat profil...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                    Selamat Datang Kembali 👋
                </h2>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Masuk ke akun Gacor Restaurant kamu
                </p>
            </div>

            {error && (
                <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>⚠️</span>
                    <span style={{ fontSize: "13px", color: "#ef4444" }}>{error}</span>
                </div>
            )}

            <div style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "24px", fontSize: "12px", color: "#aaa" }}>
                <div>🔑 <strong style={{ color: "#3b82f6" }}>Admin:</strong> admin@gacor.id / Admin123!</div>
                <div style={{ marginTop: "4px" }}>👤 <strong style={{ color: "#10b981" }}>Member:</strong> daftar via <Link to="/register" style={{ color: "#10b981" }}>Register</Link></div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>✉️</span>
                        <input type="email" name="email" value={dataForm.email}
                            onChange={handleChange} placeholder="kamu@email.com"
                            style={inputStyle} autoComplete="email" />
                    </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>🔒</span>
                        <input type={showPassword ? "text" : "password"} name="password"
                            value={dataForm.password} onChange={handleChange}
                            placeholder="Masukkan password"
                            style={{ ...inputStyle, paddingRight: "48px" }}
                            autoComplete="current-password" />
                        <button type="button" onClick={() => setShowPassword(v => !v)}
                            style={eyeBtn} aria-label="Toggle password">
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: "right", marginBottom: "24px" }}>
                    <Link to="/forgot" style={{ fontSize: "13px", color: "#ff6b35", textDecoration: "none", fontWeight: 600 }}>
                        Lupa password?
                    </Link>
                </div>

                <button type="submit" disabled={submitting} style={submitBtn(submitting)}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#e55a25"; }}
                    onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#ff6b35"; }}>
                    {submitting ? <><Spinner /> Memproses...</> : "Masuk →"}
                </button>
            </form>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Link to="/" style={{ fontSize: "13px", color: "#666", textDecoration: "none" }}
                    onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                    onMouseLeave={(e) => e.target.style.color = "#666"}>
                    ← Kembali ke Beranda
                </Link>
            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "12px" }}>
                Belum punya akun?{" "}
                <Link to="/register" style={{ color: "#ff6b35", fontWeight: 700, textDecoration: "none" }}>
                    Daftar Sekarang
                </Link>
            </p>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function Spinner() {
    return <span style={{ width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />;
}

const labelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: "#aaa", marginBottom: "8px" };
const inputStyle = { width: "100%", padding: "12px 16px 12px 44px", backgroundColor: "#1e1e2e", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" };
const iconStyle  = { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" };
const eyeBtn     = { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#666", padding: 0 };
const submitBtn  = (l) => ({ width: "100%", padding: "14px", backgroundColor: l ? "#444" : "#ff6b35", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: l ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" });
