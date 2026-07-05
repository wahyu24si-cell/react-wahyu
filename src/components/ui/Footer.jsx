/**
 * Footer Component - Footer landing page catering
 *
 * Props:
 * @param {string} brand - Nama brand
 * @param {string} tagline - Tagline brand
 * @param {Array} links - Array of { title, items: [{ label, href }] }
 * @param {Array} socials - Array of { icon, href, label }
 * @param {string} copyright - Teks copyright
 */
export default function Footer({
    brand = "Gacor.",
    tagline = "Delivering happiness through every bite. Premium catering for all your special moments.",
    links = [
        {
            title: "Menu",
            items: [
                { label: "Makanan Utama", href: "#" },
                { label: "Minuman", href: "#" },
                { label: "Dessert", href: "#" },
                { label: "Paket Catering", href: "#" },
            ],
        },
        {
            title: "Layanan",
            items: [
                { label: "Wedding Catering", href: "#" },
                { label: "Corporate Event", href: "#" },
                { label: "Birthday Party", href: "#" },
                { label: "Daily Catering", href: "#" },
            ],
        },
        {
            title: "Kontak",
            items: [
                { label: "📍 Bandung, Jawa Barat", href: "#" },
                { label: "📞 +62 812-3456-7890", href: "tel:+6281234567890" },
                { label: "✉️ hello@gacor.id", href: "mailto:hello@gacor.id" },
                { label: "🕐 Buka 07.00 - 22.00", href: "#" },
            ],
        },
    ],
    socials = [
        { icon: "📘", href: "#", label: "Facebook" },
        { icon: "📸", href: "#", label: "Instagram" },
        { icon: "🐦", href: "#", label: "Twitter" },
        { icon: "▶️", href: "#", label: "YouTube" },
    ],
    copyright = `© ${new Date().getFullYear()} Gacor Restaurant. All rights reserved.`,
}) {
    return (
        <footer style={{
            backgroundColor: "#0f0f1a",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "60px 32px 24px",
        }}>
            <div style={{
                maxWidth: "1200px", margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "2fr repeat(3, 1fr)",
                gap: "40px",
                marginBottom: "48px",
            }}>
                {/* Brand column */}
                <div>
                    <span style={{ fontSize: "26px", fontWeight: 800, color: "#ff6b35" }}>{brand}</span>
                    <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: "12px 0 24px", maxWidth: "260px" }}>
                        {tagline}
                    </p>
                    {/* Socials */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        {socials.map((s, i) => (
                            <a key={i} href={s.href} aria-label={s.label}
                                style={{
                                    width: "38px", height: "38px", borderRadius: "10px",
                                    backgroundColor: "#1e1e2e", color: "#aaa",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "16px", textDecoration: "none",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    transition: "background 0.2s, border-color 0.2s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff6b35"; e.currentTarget.style.borderColor = "#ff6b35"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1e1e2e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {links.map((col) => (
                    <div key={col.title}>
                        <h4 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1px" }}>
                            {col.title}
                        </h4>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            {col.items.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} style={{ color: "#666", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                                        onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                                        onMouseLeave={(e) => e.target.style.color = "#666"}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}>
                <span style={{ fontSize: "13px", color: "#555" }}>{copyright}</span>
                <div style={{ display: "flex", gap: "20px" }}>
                    {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                        <a key={item} href="#" style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
                            onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                            onMouseLeave={(e) => e.target.style.color = "#555"}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
