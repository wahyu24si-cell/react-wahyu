/**
 * HeroSection Component - Hero banner utama landing page catering
 *
 * Props:
 * @param {string} tagline - Teks kecil di atas judul
 * @param {string} title - Judul utama (bisa pakai \n untuk baris baru)
 * @param {string} subtitle - Deskripsi singkat
 * @param {string} primaryLabel - Label tombol utama
 * @param {string} secondaryLabel - Label tombol sekunder
 * @param {function} onPrimary - Callback tombol utama
 * @param {function} onSecondary - Callback tombol sekunder
 * @param {Array} stats - Array of { value, label }
 */
export default function HeroSection({
    tagline = "🍽️ Premium Food Catering",
    title = "Delicious Food\nDelivered Fresh",
    subtitle = "We bring restaurant-quality catering to your events. Fresh ingredients, expert chefs, unforgettable taste.",
    primaryLabel = "Order Now",
    secondaryLabel = "View Menu",
    onPrimary,
    onSecondary,
    stats = [
        { value: "500+", label: "Menu Items" },
        { value: "10K+", label: "Happy Clients" },
        { value: "4.9★", label: "Rating" },
    ],
}) {
    return (
        <section id="home" style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            padding: "60px 32px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background decorative circle */}
            <div style={{
                position: "absolute", right: "-100px", top: "50%",
                transform: "translateY(-50%)",
                width: "500px", height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{ maxWidth: "640px", position: "relative", zIndex: 1 }}>
                {/* Tagline pill */}
                <span style={{
                    display: "inline-block",
                    backgroundColor: "rgba(255,107,53,0.15)",
                    color: "#ff6b35",
                    padding: "6px 16px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "20px",
                    border: "1px solid rgba(255,107,53,0.3)",
                }}>
                    {tagline}
                </span>

                {/* Title */}
                <h1 style={{
                    fontSize: "clamp(36px, 5vw, 64px)",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.15,
                    margin: "0 0 20px 0",
                    whiteSpace: "pre-line",
                }}>
                    {title.split("\\n").join("\n")}
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: "16px", color: "#aaa", lineHeight: 1.7,
                    margin: "0 0 36px 0", maxWidth: "480px",
                }}>
                    {subtitle}
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
                    <button
                        type="button"
                        onClick={onPrimary}
                        style={{
                            backgroundColor: "#ff6b35", color: "white", border: "none",
                            padding: "14px 32px", borderRadius: "50px", fontWeight: 700,
                            fontSize: "15px", cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 32px rgba(255,107,53,0.45)"; }}
                        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 24px rgba(255,107,53,0.35)"; }}
                    >
                        {primaryLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onSecondary}
                        style={{
                            backgroundColor: "transparent", color: "#fff",
                            border: "2px solid rgba(255,255,255,0.3)",
                            padding: "14px 32px", borderRadius: "50px", fontWeight: 600,
                            fontSize: "15px", cursor: "pointer", transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => e.target.style.borderColor = "#ff6b35"}
                        onMouseLeave={(e) => e.target.style.borderColor = "rgba(255,255,255,0.3)"}
                    >
                        {secondaryLabel}
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <div style={{ fontSize: "28px", fontWeight: 800, color: "#ff6b35" }}>{stat.value}</div>
                            <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
