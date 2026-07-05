import { useState } from "react";
import { Link } from "react-router-dom";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Masukkan email yang valid");
            return;
        }
        setError("");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    if (sent) {
        return (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>📧</div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#10b981", margin: "0 0 10px" }}>
                    Email Terkirim!
                </h3>
                <p style={{ fontSize: "14px", color: "#888", margin: "0 0 8px" }}>
                    Link reset password telah dikirim ke
                </p>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#ff6b35", margin: "0 0 28px" }}>
                    {email}
                </p>
                <p style={{ fontSize: "12px", color: "#555", margin: "0 0 24px" }}>
                    Tidak menerima email?{" "}
                    <button type="button" onClick={() => setSent(false)}
                        style={{ background: "none", border: "none", color: "#ff6b35", cursor: "pointer", fontSize: "12px", fontWeight: 600, padding: 0 }}>
                        Kirim ulang
                    </button>
                </p>
                <Link to="/login" style={{
                    display: "inline-block",
                    backgroundColor: "transparent", color: "#ff6b35",
                    border: "2px solid #ff6b35",
                    padding: "10px 28px", borderRadius: "10px",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                }}>
                    ← Kembali ke Login
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Heading */}
            <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                    Lupa Password? 🔑
                </h2>
                <p style={{ fontSize: "14px", color: "#666", margin: 0, lineHeight: 1.6 }}>
                    Masukkan email kamu dan kami akan mengirimkan link untuk reset password.
                </p>
            </div>

            {error && (
                <div style={{
                    backgroundColor: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "10px", padding: "12px 16px",
                    marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px",
                }}>
                    <span>⚠️</span>
                    <span style={{ fontSize: "13px", color: "#ef4444" }}>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <div style={{ position: "relative" }}>
                        <span style={iconStyle}>✉️</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                            placeholder="kamu@email.com"
                            style={inputStyle}
                            autoComplete="email"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%", padding: "14px",
                        backgroundColor: loading ? "#444" : "#ff6b35",
                        color: "white", border: "none",
                        borderRadius: "12px", fontWeight: 700,
                        fontSize: "15px", cursor: loading ? "not-allowed" : "pointer",
                        transition: "background 0.2s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        marginBottom: "16px",
                    }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#e55a25"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#ff6b35"; }}
                >
                    {loading ? (
                        <>
                            <span style={{
                                width: "16px", height: "16px", border: "2px solid white",
                                borderTopColor: "transparent", borderRadius: "50%",
                                display: "inline-block", animation: "spin 0.7s linear infinite",
                            }} />
                            Mengirim...
                        </>
                    ) : "Kirim Reset Link →"}
                </button>

                <Link to="/login" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "6px", fontSize: "13px", color: "#666", textDecoration: "none",
                    fontWeight: 600, transition: "color 0.2s",
                }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b35"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
                >
                    ← Kembali ke Login
                </Link>
            </form>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: 600,
    color: "#aaa", marginBottom: "8px",
};

const inputStyle = {
    width: "100%", padding: "12px 16px 12px 44px",
    backgroundColor: "#1e1e2e", color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
};

const iconStyle = {
    position: "absolute", left: "14px", top: "50%",
    transform: "translateY(-50%)", fontSize: "16px",
    pointerEvents: "none",
};
