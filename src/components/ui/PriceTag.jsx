/**
 * PriceTag Component - Tampilan harga dengan berbagai varian
 *
 * Props:
 * @param {number} price - Harga utama
 * @param {number} originalPrice - Harga asli sebelum diskon
 * @param {string} currency - Kode mata uang (default "IDR")
 * @param {string} size - "sm" | "md" | "lg" | "xl"
 * @param {string} variant - "default" | "badge" | "card"
 * @param {string} label - Label tambahan (misal: "/ porsi")
 */
export default function PriceTag({
    price = 45000,
    originalPrice,
    currency = "IDR",
    size = "md",
    variant = "default",
    label,
}) {
    const formatPrice = (val) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
        }).format(val);

    const discountPercent = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null;

    const fontSizes = { sm: "14px", md: "18px", lg: "24px", xl: "32px" };
    const fontSize = fontSizes[size] || fontSizes.md;

    if (variant === "badge") {
        return (
            <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                backgroundColor: "rgba(255,107,53,0.15)",
                border: "1px solid rgba(255,107,53,0.3)",
                color: "#ff6b35", padding: "6px 14px", borderRadius: "50px",
                fontSize, fontWeight: 800,
            }}>
                {formatPrice(price)}
                {label && <span style={{ fontSize: "12px", fontWeight: 500, color: "#aaa" }}>{label}</span>}
            </span>
        );
    }

    if (variant === "card") {
        return (
            <div style={{
                backgroundColor: "#1e1e2e", borderRadius: "12px", padding: "16px 20px",
                border: "1px solid rgba(255,255,255,0.06)", display: "inline-block",
            }}>
                {discountPercent && (
                    <div style={{
                        fontSize: "11px", fontWeight: 700, color: "#10b981",
                        backgroundColor: "rgba(16,185,129,0.1)", padding: "2px 8px",
                        borderRadius: "4px", display: "inline-block", marginBottom: "8px",
                    }}>
                        HEMAT {discountPercent}%
                    </div>
                )}
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize, fontWeight: 800, color: "#ff6b35" }}>{formatPrice(price)}</span>
                    {originalPrice && (
                        <span style={{ fontSize: "13px", color: "#666", textDecoration: "line-through" }}>
                            {formatPrice(originalPrice)}
                        </span>
                    )}
                </div>
                {label && <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{label}</div>}
            </div>
        );
    }

    // Default
    return (
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize, fontWeight: 800, color: "#ff6b35" }}>{formatPrice(price)}</span>
            {originalPrice && (
                <span style={{ fontSize: "13px", color: "#666", textDecoration: "line-through" }}>
                    {formatPrice(originalPrice)}
                </span>
            )}
            {discountPercent && (
                <span style={{
                    fontSize: "11px", fontWeight: 700, color: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: "4px",
                }}>
                    -{discountPercent}%
                </span>
            )}
            {label && <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>}
        </div>
    );
}
