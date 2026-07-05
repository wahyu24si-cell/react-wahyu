import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MemberProfile from "./member/MemberProfile";
import MemberOrders from "./member/MemberOrders";
import MemberRewards from "./member/MemberRewards";
import MemberPackages from "./member/MemberPackages";
import MemberSettings from "./member/MemberSettings";

const TABS = [
    { id: "profile",   label: "Profil",         icon: "👤" },
    { id: "orders",    label: "Riwayat Order",   icon: "🛒" },
    { id: "rewards",   label: "Reward & Poin",   icon: "🏆" },
    { id: "packages",  label: "Paket Langganan", icon: "📦" },
    { id: "settings",  label: "Pengaturan",      icon: "⚙️" },
];

/**
 * Member Page — Dashboard pribadi untuk member yang sudah login.
 * Menampilkan profil, riwayat order, poin reward, paket, dan pengaturan akun.
 */
export default function Member() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    async function handleLogout() {
        await signOut();
        navigate("/login");
    }

    // Nama tampilan dari metadata Supabase atau fallback ke email
    const displayName = user?.user_metadata?.full_name
        || user?.email?.split("@")[0]
        || "Member";

    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div id="dashboard-container">
            {/* ── Header Banner ── */}
            <div style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
                borderRadius: "16px",
                padding: "28px 32px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                border: "1px solid rgba(255,107,53,0.2)",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Decorative circle */}
                <div style={{ position: "absolute", right: "-60px", top: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Avatar */}
                    <div style={{
                        width: "64px", height: "64px", borderRadius: "50%",
                        backgroundColor: "#ff6b35", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", fontWeight: 800,
                        border: "3px solid rgba(255,107,53,0.4)",
                        flexShrink: 0,
                    }}>
                        {initials}
                    </div>
                    <div>
                        <div style={{ fontSize: "11px", color: "#ff6b35", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                            👑 Member Aktif
                        </div>
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#fff" }}>
                            Halo, {displayName}!
                        </h2>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#888" }}>
                            {user?.email}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "transparent", color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.3)",
                        padding: "8px 20px", borderRadius: "8px",
                        fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                    🚪 Logout
                </button>
            </div>

            {/* ── Tab Navigation ── */}
            <div style={{
                display: "flex", gap: "4px", flexWrap: "wrap",
                backgroundColor: "#1e1e2e", borderRadius: "12px",
                padding: "6px", marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
            }}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1, minWidth: "100px",
                            padding: "10px 14px", borderRadius: "8px", border: "none",
                            cursor: "pointer", fontSize: "13px", fontWeight: 600,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            transition: "all 0.2s",
                            backgroundColor: activeTab === tab.id ? "#ff6b35" : "transparent",
                            color: activeTab === tab.id ? "white" : "#666",
                        }}
                        onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.color = "#666"; }}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Tab Content ── */}
            {activeTab === "profile"  && <MemberProfile user={user} displayName={displayName} />}
            {activeTab === "orders"   && <MemberOrders />}
            {activeTab === "rewards"  && <MemberRewards />}
            {activeTab === "packages" && <MemberPackages />}
            {activeTab === "settings" && <MemberSettings user={user} onLogout={handleLogout} />}
        </div>
    );
}
