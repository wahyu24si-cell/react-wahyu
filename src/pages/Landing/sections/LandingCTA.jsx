export default function LandingCTA({ onRegister, onLogin }) {
    return (
        <section style={{
            padding: "96px 24px",
            backgroundColor: "#0d0d1a",
        }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <div style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
                    borderRadius: "24px",
                    padding: "60px 48px",
                    textAlign: "center",
                    border: "1px solid rgba(255,107,53,0.2)",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Glow top right */}
                    <div style={{
                        position: "absolute", top: "-60px", right: "-60px",
                        width: "240px", height: "240px", borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />

                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>

                    <h2 style={{
                        fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900,
                        color: "#fff", margin: "0 0 14px", lineHeight: 1.2,
                    }}>
                        Mulai Pesan Sekarang,<br />
                        <span style={{ color: "#ff6b35" }}>Gratis Daftar!</span>
                    </h2>

                    <p style={{ fontSize: "15px", color: "#888", margin: "0 0 36px", lineHeight: 1.6 }}>
                        Bergabung dengan ribuan pelanggan puas. Daftar gratis dan
                        dapatkan <strong style={{ color: "#ff6b35" }}>500 poin reward</strong> untuk order pertamamu.
                    </p>

                    {/* Benefit pills */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px" }}>
                        {["✅ Gratis daftar", "🎁 500 poin bonus", "🏷️ Diskon member", "🚚 Free ongkir"].map((b) => (
                            <span key={b} style={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#ccc", padding: "6px 14px",
                                borderRadius: "50px", fontSize: "13px", fontWeight: 500,
                            }}>
                                {b}
                            </span>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                        <button type="button" onClick={onRegister}
                            style={{
                                backgroundColor: "#ff6b35", color: "#fff",
                                border: "none", padding: "14px 36px",
                                borderRadius: "10px", fontWeight: 800,
                                fontSize: "15px", cursor: "pointer",
                                boxShadow: "0 8px 28px rgba(255,107,53,0.35)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(255,107,53,0.45)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,107,53,0.35)"; }}
                        >
                            Daftar Gratis →
                        </button>
                        <button type="button" onClick={onLogin}
                            style={{
                                backgroundColor: "transparent", color: "#aaa",
                                border: "1px solid rgba(255,255,255,0.15)",
                                padding: "14px 28px", borderRadius: "10px",
                                fontWeight: 600, fontSize: "15px", cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                        >
                            Sudah punya akun? Masuk
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
