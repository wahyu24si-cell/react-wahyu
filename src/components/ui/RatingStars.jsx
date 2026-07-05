/**
 * RatingStars Component - Tampilan bintang rating
 *
 * Props:
 * @param {number} value - Nilai rating (0-5)
 * @param {number} max - Jumlah bintang maksimal (default 5)
 * @param {number} reviewCount - Jumlah ulasan
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} interactive - Bisa diklik untuk memberi rating
 * @param {function} onChange - Callback saat rating berubah (interactive mode)
 */
export default function RatingStars({
    value = 4.5,
    max = 5,
    reviewCount,
    size = "md",
    interactive = false,
    onChange,
}) {
    const sizes = { sm: "14px", md: "18px", lg: "24px" };
    const fontSize = sizes[size] || sizes.md;

    const stars = Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= Math.floor(value);
        const half = !filled && i < value && value - i >= 0.5;
        return { filled, half };
    });

    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            {/* Stars */}
            <div style={{ display: "flex", gap: "2px" }}>
                {stars.map((star, i) => (
                    <span
                        key={i}
                        onClick={() => interactive && onChange?.(i + 1)}
                        style={{
                            fontSize,
                            color: star.filled ? "#f59e0b" : star.half ? "#f59e0b" : "#374151",
                            cursor: interactive ? "pointer" : "default",
                            transition: "transform 0.1s",
                            display: "inline-block",
                            opacity: star.half ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => { if (interactive) e.target.style.transform = "scale(1.2)"; }}
                        onMouseLeave={(e) => { if (interactive) e.target.style.transform = "scale(1)"; }}
                        aria-label={`${i + 1} star`}
                    >
                        ★
                    </span>
                ))}
            </div>

            {/* Value */}
            <span style={{ fontSize: `calc(${fontSize} - 2px)`, fontWeight: 700, color: "#f59e0b" }}>
                {value.toFixed(1)}
            </span>

            {/* Review count */}
            {reviewCount !== undefined && (
                <span style={{ fontSize: `calc(${fontSize} - 4px)`, color: "#888" }}>
                    ({reviewCount.toLocaleString("id-ID")} ulasan)
                </span>
            )}
        </div>
    );
}
