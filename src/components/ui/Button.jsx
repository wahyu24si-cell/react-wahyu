/**
 * Button Component - Tombol reusable dengan berbagai varian
 *
 * Props:
 * @param {string} children - Konten tombol
 * @param {string} variant - "primary" | "secondary" | "outline" | "ghost" | "danger"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} fullWidth - Lebar penuh
 * @param {boolean} rounded - Rounded pill shape
 * @param {boolean} loading - Status loading
 * @param {boolean} disabled - Status disabled
 * @param {string} leftIcon - Emoji/teks ikon kiri
 * @param {string} rightIcon - Emoji/teks ikon kanan
 * @param {function} onClick - Callback klik
 * @param {string} type - "button" | "submit" | "reset"
 */
export default function Button({
    children = "Button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    rounded = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    onClick,
    type = "button",
}) {
    const sizes = {
        sm: { padding: "7px 16px", fontSize: "12px" },
        md: { padding: "11px 24px", fontSize: "14px" },
        lg: { padding: "15px 36px", fontSize: "16px" },
    };

    const variants = {
        primary: {
            backgroundColor: "#ff6b35", color: "white", border: "2px solid #ff6b35",
            hover: { backgroundColor: "#e55a25", borderColor: "#e55a25" },
        },
        secondary: {
            backgroundColor: "#1e1e2e", color: "#fff", border: "2px solid rgba(255,255,255,0.15)",
            hover: { backgroundColor: "#2d2d3d", borderColor: "rgba(255,255,255,0.3)" },
        },
        outline: {
            backgroundColor: "transparent", color: "#ff6b35", border: "2px solid #ff6b35",
            hover: { backgroundColor: "rgba(255,107,53,0.1)" },
        },
        ghost: {
            backgroundColor: "transparent", color: "#aaa", border: "2px solid transparent",
            hover: { backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" },
        },
        danger: {
            backgroundColor: "#ef4444", color: "white", border: "2px solid #ef4444",
            hover: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
        },
    };

    const v = variants[variant] || variants.primary;
    const s = sizes[size] || sizes.md;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            style={{
                ...s,
                ...v,
                borderRadius: rounded ? "50px" : "8px",
                fontWeight: 700,
                cursor: disabled || loading ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                width: fullWidth ? "100%" : "auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
                if (!disabled && !loading) {
                    Object.assign(e.currentTarget.style, v.hover);
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !loading) {
                    e.currentTarget.style.backgroundColor = v.backgroundColor;
                    e.currentTarget.style.borderColor = v.border.split(" ")[2] || "transparent";
                    e.currentTarget.style.color = v.color;
                }
            }}
        >
            {loading ? (
                <span style={{
                    width: "14px", height: "14px", border: "2px solid currentColor",
                    borderTopColor: "transparent", borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                }} />
            ) : leftIcon ? <span>{leftIcon}</span> : null}

            {children}

            {!loading && rightIcon ? <span>{rightIcon}</span> : null}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </button>
    );
}
