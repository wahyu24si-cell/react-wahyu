export default function LandingHero({ onOrder, onMenu }) {
    return (
        <section id="hero" style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "100px 24px 60px",
            background: "linear-gradient(135deg, #0d0d1a 0%, #12122a 60%, #0f1f3d 100%)",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Decorative glow */}
            <div style={{
                position: "absolute", top: "20%", right: "10%",
                width: "480px", height: "480px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 65%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: "10%", left: "5%",
                width: "300px", height: "300px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)",
                pointerEvents: "none",
            }} />

            <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: "640px" }}>

                    {/* Pill badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        backgroundColor: "rgba(255,107,53,0.12)",
                        border: "1px solid rgba(255,107,53,0.25)",
                        padding: "6px 16px", borderRadius: "50px",
                        fontSize: "13px", color: "#ff6b35", fontWeight: 600,
                        marginBottom: "28px",
                    }}>
                        <span>🍽️</span>
                        <span>Premium Food Catering</span>
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: "clamp(36px, 6vw, 68px)",
                        fontWeight: 900, lineHeight: 1.1,
                        margin: "0 0 20px", color: "#fff",
                        letterSpacing: "-1px",
                    }}>
                        Makanan Lezat,{" "}
                        <span style={{
                            color: "#ff6b35",
                            position: "relative",
                        }}>
                            Diantar
                        </span>{" "}
                        ke Pintumu
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: "16px", color: "#888", lineHeight: 1.7,
                        margin: "0 0 40px", maxWidth: "480px",
                    }}>
                        Kami menghadirkan cita rasa restoran ke setiap acara spesialmu.
                        Bahan segar, chef berpengalaman, dan pengiriman tepat waktu.
                    </p>

                    {/* CTA buttons */}
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "56px" }}>
                        <button type="button" onClick={onOrder}
                            style={{
                                backgroundColor: "#ff6b35", color: "#fff",
                                border: "none", padding: "14px 32px",
                                borderRadius: "10px", fontWeight: 700,
                                fontSize: "15px", cursor: "pointer",
                                boxShadow: "0 8px 28px rgba(255,107,53,0.3)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(255,107,53,0.4)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,107,53,0.3)"; }}
                        >
                            Pesan Sekarang 🚀
                        </button>
                        <button type="button" onClick={onMenu}
                            style={{
                                backgroundColor: "transparent", color: "#fff",
                                border: "2px solid rgba(255,255,255,0.2)",
                                padding: "14px 32px", borderRadius: "10px",
                                fontWeight: 600, fontSize: "15px", cursor: "pointer",
                                transition: "border-color 0.2s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ff6b35"}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
                        >
                            Lihat Menu →
                        </button>
                    </div>

                    {/* Stats strip */}
                    <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}>
                        {[
                            { value: "500+",  label: "Menu Pilihan" },
                            { value: "10K+",  label: "Pelanggan Puas" },
                            { value: "4.9 ★", label: "Rating" },
                        ].map((s) => (
                            <div key={s.label}>
                                <div style={{ fontSize: "26px", fontWeight: 800, color: "#ff6b35" }}>{s.value}</div>
                                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
