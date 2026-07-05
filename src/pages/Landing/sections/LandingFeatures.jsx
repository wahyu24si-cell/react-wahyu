const FEATURES = [
    {
        icon: "🥬",
        title: "Bahan Segar Setiap Hari",
        desc: "Kami memilih bahan-bahan segar langsung dari supplier terpercaya setiap pagi, tanpa kompromi kualitas.",
        color: "#10b981",
    },
    {
        icon: "👨‍🍳",
        title: "Chef Berpengalaman",
        desc: "Tim chef profesional kami memiliki pengalaman rata-rata 8 tahun di industri kuliner Indonesia.",
        color: "#3b82f6",
    },
    {
        icon: "🚚",
        title: "Pengiriman Tepat Waktu",
        desc: "Pesanan tiba sesuai jadwal yang dijanjikan. Terlambat? Kami kembalikan 20% biayamu.",
        color: "#f59e0b",
    },
    {
        icon: "💰",
        title: "Harga Terjangkau",
        desc: "Mulai dari Rp 25.000 per porsi dengan kualitas restoran. Cocok untuk semua skala acara.",
        color: "#8b5cf6",
    },
];

export default function LandingFeatures() {
    return (
        <section id="features" style={{
            padding: "96px 24px",
            backgroundColor: "#0a0a18",
        }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <span style={{
                        fontSize: "12px", fontWeight: 700, color: "#ff6b35",
                        textTransform: "uppercase", letterSpacing: "2px",
                    }}>
                        Mengapa Pilih Kami
                    </span>
                    <h2 style={{
                        fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
                        color: "#fff", margin: "12px 0 0", lineHeight: 1.2,
                    }}>
                        Kualitas yang Tidak Perlu<br />Dipertanyakan
                    </h2>
                </div>

                {/* Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "20px",
                }}>
                    {FEATURES.map((f) => (
                        <div key={f.title}
                            style={{
                                backgroundColor: "#13131f",
                                borderRadius: "16px",
                                padding: "28px 24px",
                                border: "1px solid rgba(255,255,255,0.05)",
                                transition: "transform 0.25s, border-color 0.25s",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.borderColor = `${f.color}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                            }}
                        >
                            {/* Icon circle */}
                            <div style={{
                                width: "52px", height: "52px", borderRadius: "14px",
                                backgroundColor: `${f.color}18`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "24px", marginBottom: "18px",
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ margin: "0 0 10px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                                {f.title}
                            </h3>
                            <p style={{ margin: 0, fontSize: "13px", color: "#777", lineHeight: 1.7 }}>
                                {f.desc}
                            </p>
                            {/* Bottom accent line */}
                            <div style={{
                                marginTop: "20px", height: "3px", width: "40px",
                                backgroundColor: f.color, borderRadius: "2px",
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
