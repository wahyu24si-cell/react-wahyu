import CategoryBadge from "../../components/ui/CategoryBadge";
import FoodCard from "../../components/ui/FoodCard";
import SectionHeader from "../../components/ui/SectionHeader";

export default function MenuSection({ categories, menuItems, activeCategory, setActiveCategory, onOrderClick }) {
    return (
        <section id="menu" style={{ padding: "80px 32px", backgroundColor: "#0f0f1a" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <SectionHeader
                    tagline="Menu Kami"
                    title="Pilihan Menu Terlezat"
                    description="Semua menu dibuat dari bahan segar pilihan. Tersedia untuk dine-in maupun catering."
                    align="center"
                />

                {/* Category filter */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px" }}>
                    {categories.map(cat => (
                        <CategoryBadge
                            key={cat.label}
                            label={cat.label}
                            emoji={cat.emoji}
                            active={activeCategory === cat.label}
                            onClick={() => setActiveCategory(cat.label)}
                            variant="pill"
                        />
                    ))}
                </div>

                {/* Grid menu */}
                {menuItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "#555" }}>
                        Tidak ada menu untuk kategori ini
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                        {menuItems.map(item => (
                            <FoodCard
                                key={item.id}
                                name={item.name}
                                category={item.category}
                                price={item.price}
                                rating={item.rating}
                                sold={item.sold}
                                isPopular={item.isPopular}
                                onAdd={onOrderClick}
                            />
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <button
                        type="button"
                        onClick={onOrderClick}
                        style={{
                            backgroundColor: "transparent", color: "#ff6b35",
                            border: "2px solid #ff6b35", padding: "12px 32px",
                            borderRadius: "50px", fontWeight: 700, fontSize: "14px",
                            cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff6b35"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ff6b35"; }}
                    >
                        Lihat Semua Menu →
                    </button>
                </div>
            </div>
        </section>
    );
}
