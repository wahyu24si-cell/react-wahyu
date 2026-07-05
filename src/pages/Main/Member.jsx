import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── Data dummy ──────────────────────────────────────────────
const ORDERS = [
    { id: "ORD-001", menu: "Ayam Bakar × 2",         total: 90000,  status: "Delivered",   date: "20 Jun 2026" },
    { id: "ORD-002", menu: "Nasi Goreng × 3",         total: 105000, status: "Delivered",   date: "18 Jun 2026" },
    { id: "ORD-003", menu: "Paket Catering 20 Orang", total: 500000, status: "On Delivery", date: "Hari ini" },
    { id: "ORD-004", menu: "Es Teh × 4, Kopi × 2",   total: 68000,  status: "Preparing",   date: "Hari ini" },
    { id: "ORD-005", menu: "Burger Spesial × 2",      total: 110000, status: "Canceled",    date: "15 Jun 2026" },
];

const STATUS = {
    "Delivered":   { color: "#10b981", label: "Selesai" },
    "On Delivery": { color: "#3b82f6", label: "Dikirim" },
    "Preparing":   { color: "#f59e0b", label: "Diproses" },
    "Canceled":    { color: "#ef4444", label: "Dibatal" },
};

const formatRp = (v) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", minimumFractionDigits: 0,
    }).format(v);

// ── Komponen utama ───────────────────────────────────────────
export default function Member() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profil");

    const displayName =
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "Member";

    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    async function handleLogout() {
        await signOut();
        navigate("/login");
    }

    const totalOrders   = ORDERS.length;
    const totalSelesai  = ORDERS.filter((o) => o.status === "Delivered").length;
    const totalBelanja  = ORDERS.filter((o) => o.status !== "Canceled")
                                .reduce((s, o) => s + o.total, 0);

    const TABS = [
        { id: "profil",  label: "Profil",  icon: "👤" },
        { id: "orders",  label: "Pesanan", icon: "🛒" },
        { id: "setting", label: "Setting", icon: "⚙️" },
    ];

    return (
        <div id="dashboard-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── HEADER KARTU MEMBER ── */}
            <div style={{
                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                borderRadius: "16px", padding: "28px 32px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
                border: "1px solid rgba(255,107,53,0.2)",
            }}>
                {/* Kiri: avatar + nama */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                        width: "60px", height: "60px", borderRadius: "50%",
                        backgroundColor: "#ff6b35", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px", fontWeight: 800,
                        border: "3px solid rgba(255,107,53,0.35)",
                        flexShrink: 0,
                    }}>
                        {initials}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: "11px", color: "#ff6b35", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                            👑 Member Aktif
                        </p>
                        <h2 style={{ margin: "4px 0 2px", fontSize: "18px", fontWeight: 800, color: "#fff" }}>
                            Halo, {displayName}!
                        </h2>
                        <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>{user?.email}</p>
                    </div>
                </div>

                {/* Kanan: tombol logout */}
                <button type="button" onClick={handleLogout}
                    style={{
                        backgroundColor: "transparent", color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.3)",
                        padding: "8px 18px", borderRadius: "8px",
                        fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                    🚪 Logout
                </button>
            </div>

            {/* ── STATS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                {[
                    { label: "Total Pesanan",  value: totalOrders,         color: "#3b82f6", icon: "🛒" },
                    { label: "Order Selesai",  value: totalSelesai,        color: "#10b981", icon: "✅" },
                    { label: "Total Belanja",  value: formatRp(totalBelanja), color: "#f59e0b", icon: "💰" },
                ].map((s) => (
                    <div key={s.label} style={{
                        backgroundColor: "#1e1e2e", borderRadius: "12px",
                        padding: "18px 20px", borderLeft: `4px solid ${s.color}`,
                        display: "flex", alignItems: "center", gap: "14px",
                    }}>
                        <span style={{ fontSize: "24px" }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── TAB ── */}
            <div style={{
                display: "flex", gap: "4px",
                backgroundColor: "#1e1e2e", borderRadius: "10px",
                padding: "5px", border: "1px solid rgba(255,255,255,0.06)",
            }}>
                {TABS.map((t) => (
                    <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                        style={{
                            flex: 1, padding: "9px", borderRadius: "7px", border: "none",
                            cursor: "pointer", fontSize: "13px", fontWeight: 600,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            backgroundColor: activeTab === t.id ? "#ff6b35" : "transparent",
                            color: activeTab === t.id ? "#fff" : "#666",
                            transition: "all 0.2s",
                        }}
                    >
                        <span>{t.icon}</span><span>{t.label}</span>
                    </button>
                ))}
            </div>

            {/* ── KONTEN TAB ── */}

            {/* TAB: PROFIL */}
            {activeTab === "profil" && (
                <div className="panel-card">
                    <div className="panel-title">Informasi Profil</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        {[
                            { label: "Nama",      value: displayName },
                            { label: "Email",     value: user?.email || "-" },
                            { label: "Status",    value: "Member Aktif" },
                            { label: "Poin",      value: "840 pts" },
                            { label: "Tier",      value: "Gold 🥇" },
                            { label: "Bergabung", value: "Januari 2026" },
                        ].map((row) => (
                            <div key={row.label} style={{
                                backgroundColor: "#2d2d3d", borderRadius: "10px",
                                padding: "14px 16px",
                            }}>
                                <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    {row.label}
                                </div>
                                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                                    {row.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benefit */}
                    <div style={{ marginTop: "20px" }}>
                        <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "12px", fontWeight: 600 }}>
                            🎁 Benefit Aktif
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {["🏷️ Diskon 15%", "🚚 Gratis Ongkir", "⚡ Priority Order", "🎂 Birthday Surprise"].map((b) => (
                                <span key={b} style={{
                                    backgroundColor: "rgba(255,107,53,0.1)",
                                    border: "1px solid rgba(255,107,53,0.2)",
                                    color: "#ff6b35", padding: "6px 14px",
                                    borderRadius: "50px", fontSize: "12px", fontWeight: 600,
                                }}>
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PESANAN */}
            {activeTab === "orders" && (
                <div className="panel-card">
                    <div className="panel-title">Riwayat Pesanan</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {ORDERS.map((order) => {
                            const st = STATUS[order.status];
                            return (
                                <div key={order.id} style={{
                                    display: "flex", alignItems: "center", gap: "14px",
                                    backgroundColor: "#2d2d3d", borderRadius: "10px",
                                    padding: "14px 16px", flexWrap: "wrap",
                                }}>
                                    {/* ID */}
                                    <div style={{ minWidth: "90px" }}>
                                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#ff6b35" }}>{order.id}</div>
                                        <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{order.date}</div>
                                    </div>

                                    {/* Menu */}
                                    <div style={{ flex: 1, minWidth: "140px" }}>
                                        <div style={{ fontSize: "13px", color: "#ddd" }}>{order.menu}</div>
                                    </div>

                                    {/* Total */}
                                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", minWidth: "100px", textAlign: "right" }}>
                                        {formatRp(order.total)}
                                    </div>

                                    {/* Status badge */}
                                    <span style={{
                                        backgroundColor: st.color + "22",
                                        color: st.color,
                                        border: `1px solid ${st.color}44`,
                                        padding: "4px 12px", borderRadius: "50px",
                                        fontSize: "11px", fontWeight: 700,
                                        whiteSpace: "nowrap",
                                    }}>
                                        {st.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: SETTING */}
            {activeTab === "setting" && (
                <div className="panel-card">
                    <div className="panel-title">Pengaturan Akun</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "480px" }}>

                        {/* Nama */}
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>
                                Nama Lengkap
                            </label>
                            <input type="text" defaultValue={displayName}
                                style={inputStyle} />
                        </div>

                        {/* Email (readonly) */}
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>
                                Email (tidak bisa diubah)
                            </label>
                            <input type="email" value={user?.email || ""} disabled
                                style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
                        </div>

                        {/* No. HP */}
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>
                                Nomor HP
                            </label>
                            <input type="tel" placeholder="08xx-xxxx-xxxx"
                                style={inputStyle} />
                        </div>

                        {/* Kota */}
                        <div>
                            <label style={{ display: "block", fontSize: "12px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>
                                Kota
                            </label>
                            <input type="text" placeholder="Bandung"
                                style={inputStyle} />
                        </div>

                        <button type="button"
                            onClick={() => alert("Profil berhasil disimpan!")}
                            style={{
                                marginTop: "8px", padding: "11px 24px",
                                backgroundColor: "#ff6b35", color: "#fff",
                                border: "none", borderRadius: "10px",
                                fontWeight: 700, fontSize: "14px", cursor: "pointer",
                                transition: "background 0.2s", alignSelf: "flex-start",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e55a25"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff6b35"}
                        >
                            Simpan Perubahan
                        </button>

                        {/* Danger zone */}
                        <div style={{
                            marginTop: "16px", padding: "16px",
                            backgroundColor: "rgba(239,68,68,0.06)",
                            borderRadius: "10px", border: "1px solid rgba(239,68,68,0.15)",
                        }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "8px" }}>
                                ⚠️ Danger Zone
                            </div>
                            <button type="button" onClick={handleLogout}
                                style={{
                                    backgroundColor: "transparent", color: "#ef4444",
                                    border: "1px solid rgba(239,68,68,0.3)",
                                    padding: "8px 16px", borderRadius: "8px",
                                    fontWeight: 600, fontSize: "13px", cursor: "pointer",
                                }}>
                                🚪 Logout dari Akun
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const inputStyle = {
    width: "100%", padding: "10px 14px",
    backgroundColor: "#2d2d3d", color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
};
