import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
    { path: "/member",          label: "Beranda",  icon: "🏠" },
    { path: "/member/pesanan",  label: "Pesanan",  icon: "🛒" },
    { path: "/member/promo",    label: "Promo",    icon: "🏷️" },
    { path: "/member/profil",   label: "Profil",   icon: "👤" },
];

/**
 * MemberLayout — Layout khusus halaman member.
 * Berbeda dari admin: tidak ada sidebar admin, lebih simpel dan personal.
 */
export default function MemberLayout({ children }) {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0d0d1a",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            color: "#fff",
        }}>

            {/* ── Top Navbar ── */}
            <header style={{
                backgroundColor: "#13131f",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "0 24px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}>
                {/* Logo */}
                <Link to="/member" style={{ textDecoration: "none" }}>
                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#fff" }}>
                        Gacor<span style={{ color: "#ff6b35" }}>.</span>
                    </span>
                    <span style={{
                        marginLeft: "8px", fontSize: "11px", fontWeight: 600,
                        color: "#ff6b35", backgroundColor: "rgba(255,107,53,0.12)",
                        padding: "2px 8px", borderRadius: "50px", border: "1px solid rgba(255,107,53,0.2)",
                    }}>
                        Member
                    </span>
                </Link>

                {/* Nav links — desktop */}
                <nav style={{ display: "flex", gap: "4px" }}>
                    {NAV.map((n) => {
                        const active = location.pathname === n.path;
                        return (
                            <Link key={n.path} to={n.path} style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "6px 14px", borderRadius: "8px",
                                textDecoration: "none", fontSize: "13px", fontWeight: 600,
                                backgroundColor: active ? "rgba(255,107,53,0.15)" : "transparent",
                                color: active ? "#ff6b35" : "#888",
                                transition: "all 0.2s",
                            }}
                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#888"; }}
                            >
                                <span>{n.icon}</span>
                                <span>{n.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User + logout */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            backgroundColor: "#ff6b35", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px", fontWeight: 800, flexShrink: 0,
                        }}>
                            {initials}
                        </div>
                        <span style={{ fontSize: "13px", color: "#aaa" }}>{displayName}</span>
                    </div>

                    <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(255,255,255,0.1)" }} />

                    {/* Link ke Admin */}
                    <Link to="/admin" style={{
                        fontSize: "12px", color: "#666", textDecoration: "none",
                        padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s",
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                        Admin ↗
                    </Link>

                    <button type="button" onClick={handleLogout} style={{
                        backgroundColor: "transparent", color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.25)",
                        padding: "5px 12px", borderRadius: "6px",
                        fontSize: "12px", fontWeight: 600, cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ── Content ── */}
            <main style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
                {children}
            </main>
        </div>
    );
}
