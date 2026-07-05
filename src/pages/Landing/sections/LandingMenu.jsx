import { useState } from "react";

const CATEGORIES = ["Semua", "Makanan", "Minuman", "Dessert", "Paket"];

const MENU_ITEMS = [
    { id: 1, name: "Ayam Bakar Spesial",     category: "Makanan",  price: 45000,  rating: 4.8, emoji: "🍗", badge: "🔥 Terlaris" },
    { id: 2, name: "Nasi Goreng Kampung",     category: "Makanan",  price: 35000,  rating: 4.7, emoji: "🍳", badge: null },
    { id: 3, name: "Es Teh Manis Gacor",      category: "Minuman",  price: 8000,   rating: 4.5, emoji: "🧋", badge: null },
    { id: 4, name: "Kopi Susu Signature",     category: "Minuman",  price: 18000,  rating: 4.9, emoji: "☕", badge: "⭐ Favorit" },
    { id: 5, name: "Burger Spesial",          category: "Makanan",  price: 55000,  rating: 4.6, emoji: "🍔", badge: null },
    { id: 6, name: "Lava Cake Coklat",        category: "Dessert",  price: 28000,  rating: 4.9, emoji: "🍰", badge: "🆕 Baru" },
    { id: 7, name: "Mie Goreng Jumbo",        category: "Makanan",  price: 38000,  rating: 4.6, emoji: "🍜", badge: null },
    { id: 8, name: "Paket Catering 20 Orang", category: "Paket",    price: 500000, rating: 4.8, emoji: "🍱", badge: "💎 Premium" },
];

const formatRp = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

export default function LandingMenu({ onOrder }) {
    const [active, setActive] = useState("Semua");

    const filtered = active === "Semua"
        ? MENU_ITEMS
        : MENU_ITEMS.filter((m) => m.category === active);

    return (
        <section id="menu" style={{ padding: "96px 24px", backgroundColor: "#0d0d1a" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#ff6b35", textTransform: "uppercase", letterSpacing: "2px" }}>
                        Menu Kami
                    </span>
                    <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#fff", margin: "12px 0 0" }}>
                        Pilihan Menu Terlezat
                    </h2>
                </div>

                {/* Category tabs */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "40px" }}>
                    {CATEGORIES.map((cat) => (
                        <button key={cat} type="button" onClick={() => setActive(cat)}
                            style={{
                                padding: "8px 20px", borderRadius: "50px",
                                border: active === cat ? "none" : "1px solid rgba(255,255,255,0.12)",
                                backgroundColor: active === cat ? "#ff6b35" : "transparent",
                                color: active === cat ? "#fff" : "#888",
                                fontWeight: 600, fontSize: "13px", cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "18px",
                    marginBottom: "40px",
                }}>
                    {filtered.map((item) => (
                        <div key={item.id}
                            style={{
                                backgroundColor: "#13131f",
                                borderRadius: "16px", overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.05)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                position: "relative",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.5)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                            {/* Badge */}
                            {item.badge && (
                                <div style={{
                                    position: "absolute", top: "10px", left: "10px", zIndex: 2,
                                    backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
                                    color: "#fff", padding: "3px 10px", borderRadius: "50px",
                                    fontSize: "10px", fontWeight: 700,
                                }}>
                                    {item.badge}
                                </div>
                            )}

                            {/* Image placeholder */}
                            <div style={{
                                height: "140px", backgroundColor: "#1c1c2e",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "52px",
                            }}>
                                {item.emoji}
                            </div>

                            {/* Content */}
                            <div style={{ padding: "16px" }}>
                                <div style={{ fontSize: "10px", fontWeight: 700, color: "#ff6b35", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                                    {item.category}
                                </div>
                                <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                                    {item.name}
                                </h3>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                                    <span style={{ color: "#f59e0b", fontSize: "12px" }}>★ {item.rating}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#ff6b35" }}>
                                        {formatRp(item.price)}
                                    </span>
                                    <button type="button" onClick={onOrder}
                                        style={{
                                            width: "32px", height: "32px", borderRadius: "50%",
                                            backgroundColor: "#ff6b35", color: "#fff",
                                            border: "none", fontSize: "18px", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            transition: "background 0.2s, transform 0.1s",
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e55a25"; e.currentTarget.style.transform = "scale(1.1)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ff6b35"; e.currentTarget.style.transform = "scale(1)"; }}
                                        aria-label={`Pesan ${item.name}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See all CTA */}
                <div style={{ textAlign: "center" }}>
                    <button type="button" onClick={onOrder}
                        style={{
                            backgroundColor: "transparent", color: "#ff6b35",
                            border: "2px solid #ff6b35", padding: "12px 32px",
                            borderRadius: "10px", fontWeight: 700, fontSize: "14px",
                            cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff6b35"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ff6b35"; }}
                    >
                        Lihat Semua Menu →
                    </button>
                </div>
            </div>
        </section>
    );
}
