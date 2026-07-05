import RatingStars from "./RatingStars";

/**
 * ChefCard Component - Kartu profil chef/koki
 *
 * Props:
 * @param {string} name - Nama chef
 * @param {string} specialty - Spesialisasi masakan
 * @param {string} photo - URL foto chef
 * @param {number} rating - Rating chef
 * @param {number} experience - Tahun pengalaman
 * @param {number} menuCount - Jumlah menu yang dikuasai
 * @param {Array} socials - Array of { icon, href } untuk sosial media
 */
export default function ChefCard({
    name = "Chef Wahyu",
    specialty = "Indonesian Cuisine",
    photo,
    rating = 4.9,
    experience = 8,
    menuCount = 45,
    socials = [],
}) {
    const initials = name.replace("Chef ", "").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div style={{
            backgroundColor: "#1e1e2e",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "transform 0.2s, box-shadow 0.2s",
            textAlign: "center",
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Photo area */}
            <div style={{
                height: "200px",
                background: "linear-gradient(135deg, #2d2d3d, #1a1a2e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
            }}>
                {/* Decorative circle */}
                <div style={{
                    position: "absolute", bottom: "-30px",
                    width: "160px", height: "160px", borderRadius: "50%",
                    backgroundColor: "rgba(255,107,53,0.1)",
                }} />
                {photo ? (
                    <img src={photo} alt={name} style={{
                        width: "120px", height: "120px", borderRadius: "50%",
                        objectFit: "cover", border: "4px solid #ff6b35",
                        position: "relative", zIndex: 1,
                    }} />
                ) : (
                    <div style={{
                        width: "120px", height: "120px", borderRadius: "50%",
                        backgroundColor: "#ff6b35", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "40px", fontWeight: 800,
                        border: "4px solid rgba(255,107,53,0.3)",
                        position: "relative", zIndex: 1,
                    }}>
                        {initials}
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: "20px 24px 24px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800, color: "#fff" }}>{name}</h3>
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#ff6b35", fontWeight: 600 }}>{specialty}</p>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <RatingStars value={rating} size="sm" />
                </div>

                {/* Stats */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "12px", marginBottom: "16px",
                }}>
                    <div style={{
                        backgroundColor: "#2d2d3d", borderRadius: "10px", padding: "12px",
                    }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#ff6b35" }}>{experience}+</div>
                        <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Tahun Exp.</div>
                    </div>
                    <div style={{
                        backgroundColor: "#2d2d3d", borderRadius: "10px", padding: "12px",
                    }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#ff6b35" }}>{menuCount}</div>
                        <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Menu</div>
                    </div>
                </div>

                {/* Social links */}
                {socials.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        {socials.map((s, i) => (
                            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                                style={{
                                    width: "34px", height: "34px", borderRadius: "50%",
                                    backgroundColor: "#2d2d3d", color: "#aaa",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "14px", textDecoration: "none",
                                    transition: "background 0.2s, color 0.2s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff6b35"; e.currentTarget.style.color = "white"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2d2d3d"; e.currentTarget.style.color = "#aaa"; }}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
