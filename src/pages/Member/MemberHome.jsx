import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const formatRp = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

const TIER_COLOR = {
    Bronze:  "#b45309",
    Silver:  "#9ca3af",
    Gold:    "#f59e0b",
    Platinum:"#8b5cf6",
};

export default function MemberHome() {
    const { user } = useAuth();

    const displayName =
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "Member";

    const stats = [
        { label: "Total Pesanan",  value: "14",              icon: "🛒", color: "#3b82f6" },
        { label: "Order Selesai",  value: "11",              icon: "✅", color: "#10b981" },
        { label: "Total Belanja",  value: formatRp(1260000), icon: "💰", color: "#f59e0b" },
        { label: "Poin Reward",    value: "840 pts",         icon: "⭐", color: "#8b5cf6" },
    ];

    const recentOrders = [
        { id: "ORD-003", menu: "Paket Catering 20 Orang", total: 500000, status: "On Delivery", color: "#3b82f6" },
        { id: "ORD-002", menu: "Nasi Goreng × 3",         total: 105000, status: "Delivered",   color: "#10b981" },
        { id: "ORD-001", menu: "Ayam Bakar × 2",          total: 90000,  status: "Delivered",   color: "#10b981" },
    ];

    const activePromos = [
        { code: "MEMBER15", desc: "Diskon 15% semua menu", expiry: "30 Jun 2026" },
        { code: "FREESHIP",  desc: "Gratis ongkir hari ini", expiry: "Hari ini" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Welcome banner */}
            <div style={{
                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                borderRadius: "16px", padding: "28px",
                border: "1px solid rgba(255,107,53,0.2)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "16px",
            }}>
                <div>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#ff6b35", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                        👑 Member Gold
                    </p>
                    <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 800, color: "#fff" }}>
                        Selamat datang, {displayName}!
                    </h1>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                        {user?.email} · Bergabung sejak Januari 2026
                    </p>
                </div>
                {/* Tier badge */}
                <div style={{
                    backgroundColor: "rgba(245,158,11,0.12)",
                    border: "2px solid rgba(245,158,11,0.3)",
                    borderRadius: "12px", padding: "16px 24px", textAlign: "center",
                }}>
                    <div style={{ fontSize: "28px" }}>🥇</div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: TIER_COLOR.Gold, marginTop: "4px" }}>Gold</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>840 / 1000 poin</div>
                    <div style={{ marginTop: "8px", backgroundColor: "#2d2d3d", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                        <div style={{ width: "84%", height: "100%", backgroundColor: TIER_COLOR.Gold, borderRadius: "4px" }} />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                {stats.map((s) => (
                    <div key={s.label} style={{
                        backgroundColor: "#13131f", borderRadius: "12px",
                        padding: "18px", borderLeft: `4px solid ${s.color}`,
                    }}>
                        <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* Pesanan terbaru */}
                <div style={{ backgroundColor: "#13131f", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>🛒 Pesanan Terbaru</h3>
                        <Link to="/member/pesanan" style={{ fontSize: "12px", color: "#ff6b35", textDecoration: "none", fontWeight: 600 }}>
                            Lihat semua →
                        </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {recentOrders.map((o) => (
                            <div key={o.id} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                padding: "10px 12px", backgroundColor: "#1e1e2e", borderRadius: "8px",
                            }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#ff6b35" }}>{o.id}</div>
                                    <div style={{ fontSize: "12px", color: "#bbb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.menu}</div>
                                </div>
                                <span style={{
                                    backgroundColor: o.color + "22", color: o.color,
                                    border: `1px solid ${o.color}44`,
                                    padding: "3px 8px", borderRadius: "50px",
                                    fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap",
                                }}>
                                    {o.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promo aktif */}
                <div style={{ backgroundColor: "#13131f", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>🏷️ Promo Aktifmu</h3>
                        <Link to="/member/promo" style={{ fontSize: "12px", color: "#ff6b35", textDecoration: "none", fontWeight: 600 }}>
                            Lihat semua →
                        </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {activePromos.map((p) => (
                            <div key={p.code} style={{
                                padding: "12px", backgroundColor: "#1e1e2e", borderRadius: "8px",
                                border: "1px dashed rgba(255,107,53,0.3)",
                            }}>
                                <div style={{ fontSize: "14px", fontWeight: 800, color: "#f59e0b", letterSpacing: "1px", fontFamily: "monospace" }}>
                                    {p.code}
                                </div>
                                <div style={{ fontSize: "12px", color: "#bbb", margin: "4px 0 2px" }}>{p.desc}</div>
                                <div style={{ fontSize: "11px", color: "#666" }}>Berlaku: {p.expiry}</div>
                            </div>
                        ))}
                        <div style={{ padding: "12px", backgroundColor: "rgba(255,107,53,0.05)", borderRadius: "8px", border: "1px dashed rgba(255,107,53,0.15)", textAlign: "center" }}>
                            <div style={{ fontSize: "12px", color: "#666" }}>🎁 Punya kode promo?</div>
                            <Link to="/member/promo" style={{ fontSize: "12px", color: "#ff6b35", fontWeight: 600, textDecoration: "none" }}>
                                Masukkan di sini →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
