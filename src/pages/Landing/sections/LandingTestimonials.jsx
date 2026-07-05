const TESTIMONIALS = [
    {
        name: "Wahyu Putra",
        role: "Wedding Client",
        initials: "WP",
        rating: 5,
        comment: "Makanannya luar biasa enak! Semua 200 tamu kami sangat puas. Pelayanannya profesional dan tepat waktu. Sangat rekomendasikan untuk wedding!",
        color: "#ff6b35",
    },
    {
        name: "Dika Pratama",
        role: "Corporate Event Manager",
        initials: "DP",
        rating: 5,
        comment: "Sudah 3 kali menggunakan Gacor Catering untuk acara kantor. Konsistensi rasa dan kualitasnya tidak pernah mengecewakan.",
        color: "#3b82f6",
    },
    {
        name: "Sari Indah",
        role: "Birthday Party",
        initials: "SI",
        rating: 5,
        comment: "Porsinya besar, variasi menunya banyak, dan harganya sangat terjangkau untuk kualitas segini. Pasti akan pesan lagi!",
        color: "#10b981",
    },
];

export default function LandingTestimonials() {
    return (
        <section id="testimonials" style={{ padding: "96px 24px", backgroundColor: "#0a0a18" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#ff6b35", textTransform: "uppercase", letterSpacing: "2px" }}>
                        Testimoni
                    </span>
                    <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#fff", margin: "12px 0 8px" }}>
                        Apa Kata Mereka?
                    </h2>
                    <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                        Lebih dari 10.000 pelanggan telah mempercayai Gacor Catering
                    </p>
                </div>

                {/* Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                }}>
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} style={{
                            backgroundColor: "#13131f",
                            borderRadius: "16px", padding: "28px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            display: "flex", flexDirection: "column", gap: "16px",
                            transition: "border-color 0.2s",
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = `${t.color}40`}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                        >
                            {/* Stars */}
                            <div style={{ color: "#f59e0b", fontSize: "14px", letterSpacing: "2px" }}>
                                {"★".repeat(t.rating)}
                            </div>

                            {/* Quote */}
                            <p style={{
                                margin: 0, fontSize: "14px", color: "#bbb",
                                lineHeight: 1.7, fontStyle: "italic", flex: 1,
                            }}>
                                "{t.comment}"
                            </p>

                            {/* Author */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <div style={{
                                    width: "42px", height: "42px", borderRadius: "50%",
                                    backgroundColor: t.color,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "14px", fontWeight: 800, color: "#fff", flexShrink: 0,
                                }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{t.name}</div>
                                    <div style={{ fontSize: "12px", color: "#666", marginTop: "1px" }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
