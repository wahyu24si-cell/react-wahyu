import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataForm.email.trim()) { setError("Email wajib diisi"); return; }
        if (!dataForm.password) { setError("Password wajib diisi"); return; }

        setLoading(true);
        setError("");

        const { error: signInError } = await signIn({
            email: dataForm.email.trim(),
            password: dataForm.password,
        });

        setLoading(false);

        if (signInError) {
            const msg = signInError.message.includes("Invalid login")
                ? "Email atau password salah"
                : signInError.message.includes("Email not confirmed")
                    ? "Silakan verifikasi email kamu terlebih dahulu"
                    : signInError.message;
            setError(msg);
            return;
        }

        navigate("/");
    };

    return (
        <div>
            {/* Heading */}
            <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                    Selamat Datang Kembali 👋
                </h2>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Masuk ke dashboard admin Gacor Restaurant
                </p>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
                    display: "flex", alignItems: "center", gap: "10px",
                }}>
                    <span>⚠️</span>
                    <span style={{ fontSize: "13px", color: "#ef4444" }}>{error}</span>
                </div>
            )}

            {/* Supabase info */}
            <div style={{
                backgroundColor: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "10px", padding: "10px 14px", marginBottom: "24px",
                fontSize: "12px", color: "#aaa",
            }}>
                🔐 Login menggunakan akun Supabase kamu. Belum punya akun?{" "}
                <Link to="/register" style={{ color: "#ff6b35", fontWeight: 600, textDecoration: "none" }}>Daftar sekarang</Link>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>✉️</span>
                        <input type="email" name="email" value={dataForm.email}
                            onChange={handleChange} placeholder="kamu@email.com"
                            style={inputStyle} autoComplete="email" />
                    </div>
                </div>

                {/* Password */}
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

                {/* Forgot */}
                <div style={{ textAlign: "right", marginBottom: "24px" }}>
                    <Link to="/forgot" style={{ fontSize: "13px", color: "#ff6b35", textDecoration: "none", fontWeight: 600 }}>
                        Lupa password?
                    </Link>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                    style={submitBtn(loading)}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#e55a25"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#ff6b35"; }}>
                    {loading ? <><Spinner /> Memproses...</> : "Masuk ke Dashboard →"}
                </button>
            </form>

            {/* Guest link */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Link to="/guest" style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
                    onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                    onMouseLeave={(e) => e.target.style.color = "#555"}>
                    Lihat halaman tanpa login →
                </Link>
            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "16px" }}>
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
const inputStyle = { width: "100%", padding: "12px 16px 12px 44px", backgroundColor: "#1e1e2e", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
const iconStyle = { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" };
const eyeBtn = { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#666", padding: 0 };
const submitBtn = (loading) => ({ width: "100%", padding: "14px", backgroundColor: loading ? "#444" : "#ff6b35", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" });
