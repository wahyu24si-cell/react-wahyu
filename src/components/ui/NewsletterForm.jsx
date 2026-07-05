import { useState } from "react";

/**
 * NewsletterForm Component - Form subscribe newsletter / promo
 *
 * Props:
 * @param {string} title - Judul section newsletter
 * @param {string} subtitle - Deskripsi singkat
 * @param {string} placeholder - Placeholder input email
 * @param {string} buttonLabel - Label tombol subscribe
 * @param {function} onSubmit - Callback saat submit (email) => void
 * @param {string} variant - "inline" | "stacked" | "card"
 */
export default function NewsletterForm({
    title = "Dapatkan Promo Spesial",
    subtitle = "Subscribe dan dapatkan diskon 10% untuk order pertama kamu!",
    placeholder = "Masukkan email kamu...",
    buttonLabel = "Subscribe",
    onSubmit,
    variant = "card",
}) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Masukkan email yang valid");
            return;
        }
        setError("");
        onSubmit?.(email);
        setSubmitted(true);
        setEmail("");
    }

    if (submitted) {
        return (
            <div style={{
                textAlign: "center", padding: "32px",
                backgroundColor: variant === "card" ? "#1e1e2e" : "transparent",
                borderRadius: variant === "card" ? "16px" : 0,
            }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
                <h3 style={{ color: "#10b981", margin: "0 0 8px", fontSize: "18px", fontWeight: 700 }}>Berhasil Subscribe!</h3>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Cek email kamu untuk kode promo spesial.</p>
                <button type="button" onClick={() => setSubmitted(false)}
                    style={{ marginTop: "16px", background: "none", border: "none", color: "#ff6b35", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                    Subscribe email lain
                </button>
            </div>
        );
    }

    const formContent = (
        <form onSubmit={handleSubmit} noValidate>
            {variant === "stacked" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholder}
                        style={inputStyle}
                        aria-label="Email address"
                    />
                    {error && <span style={{ color: "#ef4444", fontSize: "12px" }}>{error}</span>}
                    <button type="submit" style={btnStyle}>{buttonLabel}</button>
                </div>
            ) : (
                <div>
                    <div style={{ display: "flex", gap: "0", borderRadius: "50px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder={placeholder}
                            style={{ ...inputStyle, border: "none", borderRadius: 0, flex: 1 }}
                            aria-label="Email address"
                        />
                        <button type="submit" style={{ ...btnStyle, borderRadius: 0, padding: "12px 24px" }}>{buttonLabel}</button>
                    </div>
                    {error && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px", display: "block" }}>{error}</span>}
                </div>
            )}
        </form>
    );

    if (variant === "card") {
        return (
            <div style={{
                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                border: "1px solid rgba(255,107,53,0.2)",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: "-40px", right: "-40px",
                    width: "200px", height: "200px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📧</div>
                <h3 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800, color: "#fff" }}>{title}</h3>
                <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#888" }}>{subtitle}</p>
                <div style={{ maxWidth: "440px", margin: "0 auto" }}>{formContent}</div>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700, color: "#fff" }}>{title}</h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#888" }}>{subtitle}</p>
            {formContent}
        </div>
    );
}

const inputStyle = {
    width: "100%", padding: "12px 20px",
    backgroundColor: "#2d2d3d", color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "50px", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
};

const btnStyle = {
    backgroundColor: "#ff6b35", color: "white", border: "none",
    padding: "12px 28px", borderRadius: "50px",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
    whiteSpace: "nowrap",
};
