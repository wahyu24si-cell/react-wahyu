import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [dataForm, setDataForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDataForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dataForm.fullName.trim()) { setError("Nama lengkap wajib diisi"); return; }
        if (!dataForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataForm.email)) {
            setError("Masukkan email yang valid"); return;
        }
        if (dataForm.password.length < 6) { setError("Password minimal 6 karakter"); return; }
        if (dataForm.password !== dataForm.confirmPassword) { setError("Password dan konfirmasi tidak cocok"); return; }
        if (!dataForm.agree) { setError("Kamu harus menyetujui syarat & ketentuan"); return; }

        setLoading(true);
        setError("");

        const { error: signUpError } = await signUp({
            email: dataForm.email.trim(),
            password: dataForm.password,
            fullName: dataForm.fullName.trim(),
        });

        setLoading(false);

        if (signUpError) {
            // Tampilkan pesan error yang ramah
            const msg = signUpError.message.includes("already registered")
                ? "Email ini sudah terdaftar. Silakan login."
                : signUpError.message.includes("Password")
                    ? "Password terlalu lemah. Gunakan kombinasi huruf & angka."
                    : signUpError.message;
            setError(msg);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#10b981", margin: "0 0 10px" }}>
                    Registrasi Berhasil!
                </h3>
                <p style={{ fontSize: "14px", color: "#888", margin: "0 0 6px" }}>
                    Akun kamu telah dibuat. Cek email untuk verifikasi:
                </p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#ff6b35", margin: "0 0 28px" }}>
                    {dataForm.email}
                </p>
                <p style={{ fontSize: "12px", color: "#555", margin: "0 0 24px" }}>
                    Jika email Supabase belum dikonfigurasi, kamu bisa langsung login.
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                        backgroundColor: "#ff6b35", color: "white", border: "none",
                        padding: "12px 32px", borderRadius: "12px", fontWeight: 700,
                        fontSize: "15px", cursor: "pointer",
                    }}
                >
                    Masuk Sekarang →
                </button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                    Buat Akun Baru ✨
                </h2>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Daftar dan mulai kelola restoran kamu
                </p>
            </div>

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

            <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Nama Lengkap</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>👤</span>
                        <input type="text" name="fullName" value={dataForm.fullName}
                            onChange={handleChange} placeholder="Masukkan nama lengkap"
                            style={inputStyle} autoComplete="name" />
                    </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>✉️</span>
                        <input type="email" name="email" value={dataForm.email}
                            onChange={handleChange} placeholder="kamu@email.com"
                            style={inputStyle} autoComplete="email" />
                    </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>🔒</span>
                        <input type={showPassword ? "text" : "password"} name="password"
                            value={dataForm.password} onChange={handleChange}
                            placeholder="Minimal 6 karakter"
                            style={{ ...inputStyle, paddingRight: "48px" }}
                            autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPassword(v => !v)}
                            style={eyeBtn} aria-label="Toggle password">
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {dataForm.password && <PasswordStrength password={dataForm.password} />}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={labelStyle}>Konfirmasi Password</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>🔑</span>
                        <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                            value={dataForm.confirmPassword} onChange={handleChange}
                            placeholder="Ulangi password"
                            style={{
                                ...inputStyle, paddingRight: "48px",
                                borderColor: dataForm.confirmPassword && dataForm.password !== dataForm.confirmPassword
                                    ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
                            }}
                            autoComplete="new-password" />
                        <button type="button" onClick={() => setShowConfirm(v => !v)}
                            style={eyeBtn} aria-label="Toggle confirm">
                            {showConfirm ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {dataForm.confirmPassword && dataForm.password !== dataForm.confirmPassword && (
                        <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>Password tidak cocok</p>
                    )}
                </div>

                {/* Terms */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "24px", cursor: "pointer" }}>
                    <input type="checkbox" name="agree" checked={dataForm.agree} onChange={handleChange}
                        style={{ marginTop: "2px", accentColor: "#ff6b35", width: "16px", height: "16px", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#888", lineHeight: 1.5 }}>
                        Saya menyetujui{" "}
                        <a href="#" style={{ color: "#ff6b35", textDecoration: "none", fontWeight: 600 }}>Syarat & Ketentuan</a>
                        {" "}dan{" "}
                        <a href="#" style={{ color: "#ff6b35", textDecoration: "none", fontWeight: 600 }}>Kebijakan Privasi</a>
                    </span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading} style={submitBtn(loading)}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#e55a25"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#ff6b35"; }}>
                    {loading ? <><Spinner /> Mendaftar...</> : "Buat Akun →"}
                </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "24px" }}>
                Sudah punya akun?{" "}
                <Link to="/login" style={{ color: "#ff6b35", fontWeight: 700, textDecoration: "none" }}>
                    Masuk di sini
                </Link>
            </p>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function PasswordStrength({ password }) {
    const score = [/[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password), password.length >= 8].filter(Boolean).length;
    const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
    const labels = ["", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
    return (
        <div style={{ marginTop: "8px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: i <= score ? colors[score] : "#2d2d3d", transition: "background 0.2s" }} />
                ))}
            </div>
            {score > 0 && <p style={{ fontSize: "11px", color: colors[score], margin: 0 }}>{labels[score]}</p>}
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
