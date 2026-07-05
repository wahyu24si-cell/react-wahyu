import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
    { label: "Beranda", href: "#hero" },
    { label: "Layanan", href: "#features" },
    { label: "Menu",    href: "#menu" },
    { label: "Review",  href: "#testimonials" },
];

export default function LandingNavbar({ onLogin, onRegister }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
            backgroundColor: "rgba(13,13,26,0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
            <div style={{
                maxWidth: "1100px", margin: "0 auto",
                padding: "0 24px", height: "64px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                {/* Logo */}
                <Link to="/landing" style={{ textDecoration: "none" }}>
                    <span style={{ fontSize: "22px", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
                        Gacor<span style={{ color: "#ff6b35" }}>.</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav style={{ display: "flex", gap: "32px" }}>
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href} style={{
                            color: "#aaa", textDecoration: "none", fontSize: "14px",
                            fontWeight: 500, transition: "color 0.2s",
                        }}
                            onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                            onMouseLeave={(e) => e.target.style.color = "#aaa"}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                {/* Auth buttons */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button type="button" onClick={onLogin}
                        style={{
                            backgroundColor: "transparent", color: "#aaa",
                            border: "1px solid rgba(255,255,255,0.15)",
                            padding: "8px 18px", borderRadius: "8px",
                            fontWeight: 600, fontSize: "13px", cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                    >
                        Masuk
                    </button>
                    <button type="button" onClick={onRegister}
                        style={{
                            backgroundColor: "#ff6b35", color: "#fff",
                            border: "none", padding: "8px 18px",
                            borderRadius: "8px", fontWeight: 700,
                            fontSize: "13px", cursor: "pointer", transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e55a25"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff6b35"}
                    >
                        Daftar Gratis
                    </button>
                </div>
            </div>
        </header>
    );
}
