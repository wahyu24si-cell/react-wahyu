import RatingStars from "./RatingStars";

/**
 * TestimonialCard Component - Kartu ulasan/testimoni pelanggan
 *
 * Props:
 * @param {string} name - Nama pelanggan
 * @param {string} role - Jabatan/keterangan (misal: "Wedding Client")
 * @param {string} avatar - URL foto profil
 * @param {string} comment - Isi ulasan
 * @param {number} rating - Rating 0-5
 * @param {string} date - Tanggal ulasan
 * @param {string} variant - "card" | "quote"
 */
export default function TestimonialCard({
    name = "Wahyu Putra",
    role = "Wedding Client",
    avatar,
    comment = "Makanannya luar biasa enak! Semua tamu puas dan pelayanannya sangat profesional. Pasti akan pesan lagi untuk acara berikutnya.",
    rating = 5,
    date = "Mei 2026",
    variant = "card",
}) {
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    if (variant === "quote") {
        return (
            <div style={{
                backgroundColor: "#1e1e2e",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
            }}>
                {/* Quote mark */}
                <div style={{
                    fontSize: "80px", lineHeight: 1, color: "rgba(255,107,53,0.15)",
                    position: "absolute", top: "16px", left: "24px",
                    fontFamily: "Georgia, serif", fontWeight: 900,
                }}>
                    "
                </div>

                <div style={{ position: "relative", zIndex: 1 }}>
                    <RatingStars value={rating} size="sm" />
                    <p style={{
                        fontSize: "15px", color: "#ccc", lineHeight: 1.7,
                        margin: "16px 0 24px", fontStyle: "italic",
                    }}>
                        "{comment}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Avatar initials={initials} avatar={avatar} size={40} />
                        <div>
                            <div style={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>{name}</div>
                            <div style={{ fontSize: "12px", color: "#888" }}>{role} · {date}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: "#1e1e2e",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "box-shadow 0.2s",
        }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Avatar initials={initials} avatar={avatar} size={48} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: "15px" }}>{name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{role}</div>
                </div>
                <span style={{ fontSize: "12px", color: "#666" }}>{date}</span>
            </div>

            <RatingStars value={rating} size="sm" />

            <p style={{
                fontSize: "14px", color: "#bbb", lineHeight: 1.7,
                margin: "12px 0 0",
            }}>
                "{comment}"
            </p>
        </div>
    );
}

function Avatar({ initials, avatar, size }) {
    return avatar ? (
        <img src={avatar} alt={initials} style={{
            width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
        }} />
    ) : (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            backgroundColor: "#ff6b35", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
        }}>
            {initials}
        </div>
    );
}
