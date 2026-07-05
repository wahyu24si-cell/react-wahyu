/**
 * FoodCard Component - Kartu menu makanan
 *
 * Props:
 * @param {string} image - URL gambar makanan
 * @param {string} name - Nama menu
 * @param {string} category - Kategori (Makanan / Minuman)
 * @param {number} price - Harga dalam angka
 * @param {number} rating - Rating 0-5
 * @param {number} sold - Jumlah terjual
 * @param {boolean} isPopular - Tampilkan badge Popular
 * @param {function} onAdd - Callback tombol Add to Cart
 * @param {function} onClick - Callback klik kartu
 */
export default function FoodCard({
    image,
    name = "Ayam Bakar Spesial",
    category = "Makanan",
    price = 45000,
    rating = 4.8,
    sold = 120,
    isPopular = false,
    onAdd,
    onClick,
}) {
    const formatRupiah = (val) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

    return (
        <article
            onClick={onClick}
            style={{
                backgroundColor: "#1e1e2e",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Popular Badge */}
            {isPopular && (
                <span style={{
                    position: "absolute", top: "12px", left: "12px", zIndex: 2,
                    backgroundColor: "#ff6b35", color: "white",
                    padding: "4px 10px", borderRadius: "50px",
                    fontSize: "11px", fontWeight: 700,
                }}>
                    🔥 Popular
                </span>
            )}

            {/* Image */}
            <div style={{
                width: "100%", height: "180px",
                backgroundColor: "#2d2d3d",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                {image ? (
                    <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <span style={{ fontSize: "48px" }}>🍽️</span>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: "16px" }}>
                {/* Category */}
                <span style={{
                    fontSize: "11px", fontWeight: 600, color: "#ff6b35",
                    textTransform: "uppercase", letterSpacing: "1px",
                }}>
                    {category}
                </span>

                {/* Name */}
                <h3 style={{
                    margin: "6px 0 8px", fontSize: "16px", fontWeight: 700,
                    color: "#fff", lineHeight: 1.3,
                }}>
                    {name}
                </h3>

                {/* Rating & Sold */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <span style={{ color: "#f59e0b", fontSize: "13px" }}>★ {rating}</span>
                    <span style={{ color: "#666", fontSize: "12px" }}>•</span>
                    <span style={{ color: "#888", fontSize: "12px" }}>{sold} terjual</span>
                </div>

                {/* Price + Add Button */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#ff6b35" }}>
                        {formatRupiah(price)}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
                        style={{
                            backgroundColor: "#ff6b35", color: "white", border: "none",
                            width: "36px", height: "36px", borderRadius: "50%",
                            fontSize: "20px", cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e55a25"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff6b35"}
                        aria-label={`Add ${name} to cart`}
                    >
                        +
                    </button>
                </div>
            </div>
        </article>
    );
}
