const LINKS = {
    Menu: ["Makanan Utama", "Minuman", "Dessert", "Paket Catering"],
    Layanan: ["Wedding Catering", "Corporate Event", "Birthday Party", "Daily Catering"],
    Perusahaan: ["Tentang Kami", "Blog", "Karir", "Hubungi Kami"],
};

export default function LandingFooter() {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: "#07070f",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "60px 24px 24px",
        }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                {/* Top row */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    gap: "40px",
                    marginBottom: "48px",
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ fontSize: "24px", fontWeight: 900, color: "#fff", marginBottom: "12px" }}>
                            Gacor<span style={{ color: "#ff6b35" }}>.</span>
                        </div>
                        <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, maxWidth: "240px", margin: "0 0 20px" }}>
                            Menghadirkan cita rasa terbaik ke setiap momen spesialmu sejak 2018.
                        </p>
                        {/* Social */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            {["📘", "📸", "▶️"].map((icon) => (
                                <a key={icon} href="#"
                                    style={{
                                        width: "36px", height: "36px", borderRadius: "8px",
                                        backgroundColor: "#13131f",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "15px", textDecoration: "none", transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ff6b35"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#13131f"}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(LINKS).map(([title, items]) => (
                        <div key={title}>
                            <h4 style={{ margin: "0 0 16px", fontSize: "13px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px" }}>
                                {title}
                            </h4>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                {items.map((item) => (
                                    <li key={item}>
                                        <a href="#" style={{ fontSize: "13px", color: "#555", textDecoration: "none", transition: "color 0.2s" }}
                                            onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                                            onMouseLeave={(e) => e.target.style.color = "#555"}
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                }}>
                    <span style={{ fontSize: "12px", color: "#444" }}>
                        © {year} Gacor Restaurant. All rights reserved.
                    </span>
                    <div style={{ display: "flex", gap: "20px" }}>
                        {["Privacy Policy", "Terms of Service"].map((item) => (
                            <a key={item} href="#"
                                style={{ fontSize: "12px", color: "#444", textDecoration: "none", transition: "color 0.2s" }}
                                onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                                onMouseLeave={(e) => e.target.style.color = "#444"}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Responsive grid fix */}
            <style>{`
                @media (max-width: 768px) {
                    footer > div > div:first-child {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (max-width: 480px) {
                    footer > div > div:first-child {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </footer>
    );
}
