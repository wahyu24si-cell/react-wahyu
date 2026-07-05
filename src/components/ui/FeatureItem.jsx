/**
 * FeatureItem Component - Item fitur/keunggulan layanan catering
 *
 * Props:
 * @param {string} icon - Emoji ikon
 * @param {string} title - Judul fitur
 * @param {string} description - Deskripsi fitur
 * @param {string} variant - "card" | "inline" | "icon-top"
 * @param {string} iconBg - Warna background ikon
 */
export default function FeatureItem({
    icon = "🍳",
    title = "Fresh Ingredients",
    description = "Kami menggunakan bahan-bahan segar pilihan setiap hari untuk memastikan kualitas terbaik.",
    variant = "card",
    iconBg = "rgba(255,107,53,0.15)",
}) {
    if (variant === "inline") {
        return (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    backgroundColor: iconBg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "22px", flexShrink: 0,
                }}>
                    {icon}
                </div>
                <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{title}</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.6 }}>{description}</p>
                </div>
            </div>
        );
    }

    if (variant === "icon-top") {
        return (
            <div style={{ textAlign: "center", padding: "8px" }}>
                <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    backgroundColor: iconBg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "28px", margin: "0 auto 16px",
                }}>
                    {icon}
                </div>
                <h4 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{title}</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.6 }}>{description}</p>
            </div>
        );
    }

    // Default: card
    return (
        <div style={{
            backgroundColor: "#1e1e2e",
            borderRadius: "16px",
            padding: "28px 24px",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "transform 0.2s, border-color 0.2s",
            cursor: "default",
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            }}
        >
            <div style={{
                width: "56px", height: "56px", borderRadius: "14px",
                backgroundColor: iconBg, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "26px", marginBottom: "20px",
            }}>
                {icon}
            </div>
            <h4 style={{ margin: "0 0 10px", fontSize: "17px", fontWeight: 700, color: "#fff" }}>{title}</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#888", lineHeight: 1.7 }}>{description}</p>
        </div>
    );
}
