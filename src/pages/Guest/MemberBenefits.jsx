/**
 * MemberBenefits — Section keuntungan menjadi member / login
 * Tampil di halaman guest sebagai CTA untuk register
 */
export default function MemberBenefits({ onJoin, onLogin }) {
    const benefits = [
        { icon: "🏷️", title: "Diskon Eksklusif", description: "Dapatkan diskon hingga 25% untuk setiap order sebagai member.", memberOnly: true },
        { icon: "🎁", title: "Reward Points", description: "Setiap pembelian menghasilkan poin yang bisa ditukar hadiah menarik.", memberOnly: true },
        { icon: "🚀", title: "Priority Order", description: "Pesanan member diprioritaskan dan diproses lebih cepat.", memberOnly: true },
        { icon: "📱", title: "Order Tracking", description: "Lacak status pesanan kamu secara real-time lewat dashboard.", memberOnly: true },
        { icon: "📜", title: "Riwayat Pesanan", description: "Akses seluruh riwayat order dan invoice kapan saja.", memberOnly: true },
        { icon: "🎂", title: "Birthday Surprise", description: "Surprise spesial di hari ulang tahunmu — gratis dessert pilihan!", memberOnly: true },
    ];

    const guestFeatures = [
        { icon: "👀", title: "Lihat Menu", description: "Browse semua menu tanpa perlu login." },
        { icon: "🔍", title: "Cek Harga", description: "Lihat harga dan detail setiap menu." },
        { icon: "🍳", title: "Info Chef", description: "Kenali chef kami dan spesialisasinya." },
        { icon: "⭐", title: "Baca Review", description: "Lihat ulasan pelanggan yang sudah order." },
    ];

    return (
        <section id="member" style={{
            padding: "80px 32px",
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
            position: "relative", overflow: "hidden",
        }}>
            {/* Decorative */}
            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <span style={{ display: "inline-block", backgroundColor: "rgba(255,107,53,0.15)", color: "#ff6b35", padding: "6px 16px", borderRadius: "50px", fontSize: "13px", fontWeight: 700, marginBottom: "12px", border: "1px solid rgba(255,107,53,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>
                        🌟 Keuntungan Member
                    </span>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
                        Gabung Jadi Member &<br />Nikmati Lebih Banyak
                    </h2>
                    <p style={{ fontSize: "15px", color: "#888", maxWidth: "480px", margin: "0 auto" }}>
                        Member mendapatkan akses eksklusif ke fitur premium, diskon spesial, dan layanan prioritas.
                    </p>
                </div>

                {/* Comparison: Guest vs Member */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>

                    {/* Guest card */}
                    <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#2d2d3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                                👤
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#fff" }}>Guest</h3>
                                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Tanpa login</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {guestFeatures.map(f => (
                                <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                    <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>{f.icon}</span>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#ddd" }}>{f.title}</div>
                                        <div style={{ fontSize: "12px", color: "#666" }}>{f.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={onLogin}
                            style={{ width: "100%", marginTop: "28px", padding: "12px", backgroundColor: "transparent", color: "#aaa", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b35"; e.currentTarget.style.color = "#ff6b35"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#aaa"; }}>
                            Masuk sebagai Guest
                        </button>
                    </div>

                    {/* Member card */}
                    <div style={{
                        backgroundColor: "rgba(255,107,53,0.06)", borderRadius: "20px", padding: "32px",
                        border: "2px solid rgba(255,107,53,0.4)", position: "relative", overflow: "hidden",
                    }}>
                        <div style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#ff6b35", color: "white", padding: "4px 10px", borderRadius: "50px", fontSize: "11px", fontWeight: 700 }}>
                            ✨ RECOMMENDED
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(255,107,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                                👑
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#ff6b35" }}>Member</h3>
                                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Akun terdaftar — Gratis!</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {benefits.map(b => (
                                <div key={b.title} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                    <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>{b.icon}</span>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{b.title}</div>
                                        <div style={{ fontSize: "12px", color: "#888" }}>{b.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={onJoin}
                            style={{ width: "100%", marginTop: "28px", padding: "13px", backgroundColor: "#ff6b35", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "background 0.2s", boxShadow: "0 8px 24px rgba(255,107,53,0.3)" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e55a25"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff6b35"}>
                            Daftar Member — Gratis! →
                        </button>
                    </div>
                </div>

                {/* Paket catering teaser */}
                <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "28px 32px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700, color: "#fff" }}>🍱 Paket Catering Populer</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                        {[
                            { name: "Paket Silver", price: "Rp 25.000", desc: "Per porsi, min. 20 pax", color: "#9ca3af" },
                            { name: "Paket Gold", price: "Rp 45.000", desc: "Per porsi, min. 50 pax", color: "#f59e0b" },
                            { name: "Paket Platinum", price: "Rp 75.000", desc: "Per porsi, min. 100 pax", color: "#8b5cf6" },
                            { name: "Paket Wedding", price: "Custom", desc: "Sesuai kebutuhan", color: "#ff6b35" },
                        ].map(p => (
                            <div key={p.name} style={{ backgroundColor: "#1e1e2e", borderRadius: "12px", padding: "20px", borderLeft: `4px solid ${p.color}`, cursor: "pointer", transition: "transform 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                                onClick={onJoin}>
                                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{p.name}</div>
                                <div style={{ fontSize: "18px", fontWeight: 800, color: p.color, marginBottom: "4px" }}>{p.price}</div>
                                <div style={{ fontSize: "12px", color: "#666" }}>{p.desc}</div>
                                <div style={{ fontSize: "11px", color: p.color, marginTop: "8px", fontWeight: 600 }}>🔒 Login untuk pesan</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
