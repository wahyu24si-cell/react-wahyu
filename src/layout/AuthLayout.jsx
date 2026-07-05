import { Outlet, Link, useLocation } from "react-router-dom";

export default function AuthLayout() {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const isRegister = location.pathname === "/register";

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
            fontFamily: "'Poppins', system-ui, sans-serif",
        }}>
            {/* ── Kolom Kiri: Ilustrasi / Branding ── */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px 48px",
                background: "linear-gradient(160deg, #1a1a2e 0%, #0f3460 100%)",
                position: "relative",
                overflow: "hidden",
            }}
                className="auth-left-panel"
            >
                {/* Decorative blobs */}
                <div style={{
                    position: "absolute", top: "-80px", right: "-80px",
                    width: "320px", height: "320px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", bottom: "-60px", left: "-60px",
                    width: "260px", height: "260px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* Logo */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>🍽️</div>
                    <h1 style={{
                        fontSize: "42px", fontWeight: 900, margin: "0 0 8px",
                        color: "#fff", letterSpacing: "-1px",
                    }}>
                        Gacor<span style={{ color: "#ff6b35" }}>.</span>
                    </h1>
                    <p style={{ fontSize: "14px", color: "#888", margin: "0 0 48px", letterSpacing: "1px", textTransform: "uppercase" }}>
                        Restaurant Dashboard
                    </p>

                    {/* Feature list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left", maxWidth: "320px" }}>
                        {[
                            { icon: "📊", title: "Analytics Real-time", desc: "Pantau performa restoran setiap saat" },
                            { icon: "🛒", title: "Manajemen Pesanan", desc: "Kelola semua order dalam satu tempat" },
                            { icon: "🏷️", title: "Promo & Diskon", desc: "Buat dan kelola promosi dengan mudah" },
                            { icon: "👥", title: "Data Pelanggan", desc: "Lacak dan analisa data pelanggan setia" },
                        ].map((f) => (
                            <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                                <div style={{
                                    width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                                    backgroundColor: "rgba(255,107,53,0.12)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "20px",
                                }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{f.title}</div>
                                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom stat strip */}
                <div style={{
                    position: "absolute", bottom: "32px",
                    display: "flex", gap: "32px",
                }}>
                    {[["500+", "Menu"], ["10K+", "Pelanggan"], ["4.9★", "Rating"]].map(([val, lbl]) => (
                        <div key={lbl} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "20px", fontWeight: 800, color: "#ff6b35" }}>{val}</div>
                            <div style={{ fontSize: "11px", color: "#555" }}>{lbl}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Kolom Kanan: Form ── */}
            <div style={{
                width: "480px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 48px",
                backgroundColor: "#12121f",
                overflowY: "auto",
            }}
                className="auth-right-panel"
            >
                {/* Tab switcher Login / Register */}
                <div style={{
                    display: "flex", gap: "0", marginBottom: "36px",
                    backgroundColor: "#1e1e2e", borderRadius: "12px", padding: "4px",
                    width: "100%",
                }}>
                    <Link to="/login" style={{
                        flex: 1, textAlign: "center", padding: "10px",
                        borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                        textDecoration: "none", transition: "all 0.2s",
                        backgroundColor: isLogin ? "#ff6b35" : "transparent",
                        color: isLogin ? "#fff" : "#666",
                    }}>
                        Login
                    </Link>
                    <Link to="/register" style={{
                        flex: 1, textAlign: "center", padding: "10px",
                        borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                        textDecoration: "none", transition: "all 0.2s",
                        backgroundColor: isRegister ? "#ff6b35" : "transparent",
                        color: isRegister ? "#fff" : "#666",
                    }}>
                        Register
                    </Link>
                </div>

                {/* Form content */}
                <div style={{ width: "100%" }}>
                    <Outlet />
                </div>

                {/* Footer */}
                <p style={{ fontSize: "12px", color: "#444", marginTop: "36px", textAlign: "center" }}>
                    © {new Date().getFullYear()} Gacor Restaurant Admin Dashboard
                </p>
            </div>

            {/* Responsive styles */}
            <style>{`
                @media (max-width: 768px) {
                    .auth-left-panel { display: none !important; }
                    .auth-right-panel { width: 100% !important; padding: 32px 24px !important; }
                }
            `}</style>
        </div>
    );
}
