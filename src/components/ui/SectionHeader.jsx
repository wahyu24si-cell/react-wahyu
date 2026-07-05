/**
 * SectionHeader Component - Judul section dengan tagline dan deskripsi
 *
 * Props:
 * @param {string} tagline - Teks kecil di atas judul
 * @param {string} title - Judul utama section
 * @param {string} description - Deskripsi singkat
 * @param {string} align - "left" | "center" | "right"
 * @param {boolean} showDivider - Tampilkan garis dekoratif
 */
export default function SectionHeader({
    tagline,
    title = "Section Title",
    description,
    align = "center",
    showDivider = true,
}) {
    const textAlign = align;
    const alignItems = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems,
            textAlign,
            marginBottom: "48px",
            maxWidth: align === "center" ? "600px" : "100%",
            margin: align === "center" ? "0 auto 48px" : "0 0 48px",
        }}>
            {/* Tagline */}
            {tagline && (
                <span style={{
                    display: "inline-block",
                    color: "#ff6b35",
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "12px",
                }}>
                    {tagline}
                </span>
            )}

            {/* Title */}
            <h2 style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px",
                lineHeight: 1.2,
            }}>
                {title}
            </h2>

            {/* Divider */}
            {showDivider && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "12px 0",
                }}>
                    <div style={{ width: "40px", height: "3px", backgroundColor: "#ff6b35", borderRadius: "2px" }} />
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#ff6b35", borderRadius: "50%" }} />
                    <div style={{ width: "20px", height: "3px", backgroundColor: "rgba(255,107,53,0.4)", borderRadius: "2px" }} />
                </div>
            )}

            {/* Description */}
            {description && (
                <p style={{
                    fontSize: "15px",
                    color: "#888",
                    lineHeight: 1.7,
                    margin: "8px 0 0",
                    maxWidth: "520px",
                }}>
                    {description}
                </p>
            )}
        </div>
    );
}
