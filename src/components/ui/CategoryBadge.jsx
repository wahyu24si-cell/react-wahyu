/**
 * CategoryBadge Component - Badge/pill untuk kategori menu
 *
 * Props:
 * @param {string} label - Teks kategori
 * @param {string} emoji - Emoji ikon kategori
 * @param {boolean} active - Status aktif/terpilih
 * @param {function} onClick - Callback saat diklik
 * @param {string} variant - "pill" | "chip" | "outline"
 */
export default function CategoryBadge({
    label = "Semua",
    emoji = "🍽️",
    active = false,
    onClick,
    variant = "pill",
}) {
    const styles = {
        pill: {
            base: {
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 18px", borderRadius: "50px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                border: "2px solid",
                transition: "all 0.2s",
            },
            active: { backgroundColor: "#ff6b35", borderColor: "#ff6b35", color: "white" },
            inactive: { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#aaa" },
        },
        chip: {
            base: {
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "8px",
                fontSize: "12px", fontWeight: 600, cursor: "pointer",
                border: "none", transition: "all 0.2s",
            },
            active: { backgroundColor: "rgba(255,107,53,0.2)", color: "#ff6b35" },
            inactive: { backgroundColor: "#2d2d3d", color: "#888" },
        },
        outline: {
            base: {
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "6px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                border: "1px solid", transition: "all 0.2s",
            },
            active: { backgroundColor: "#ff6b35", borderColor: "#ff6b35", color: "white" },
            inactive: { backgroundColor: "transparent", borderColor: "#444", color: "#aaa" },
        },
    };

    const s = styles[variant] || styles.pill;
    const stateStyle = active ? s.active : s.inactive;

    return (
        <button
            type="button"
            onClick={onClick}
            style={{ ...s.base, ...stateStyle }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.borderColor = "#ff6b35";
                    e.currentTarget.style.color = "#ff6b35";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.borderColor = stateStyle.borderColor || "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = stateStyle.color;
                }
            }}
        >
            <span>{emoji}</span>
            <span>{label}</span>
        </button>
    );
}
