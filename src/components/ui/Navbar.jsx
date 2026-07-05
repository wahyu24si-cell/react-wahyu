import { useState } from "react";

/**
 * Navbar Component - Navigation bar untuk landing page food catering
 *
 * Props:
 * @param {string} logo - Nama/teks logo brand
 * @param {Array} links - Array of { label, href }
 * @param {function} onOrderClick - Callback tombol Order Now
 */
export default function Navbar({ logo = "Gacor.", links = [], onOrderClick }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const defaultLinks = links.length > 0 ? links : [
        { label: "Home", href: "#home" },
        { label: "Menu", href: "#menu" },
        { label: "About", href: "#about" },
        { label: "Testimonial", href: "#testimonial" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <nav style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "#1a1a2e",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "68px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
        }}>
            {/* Logo */}
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#ff6b35", letterSpacing: "-0.5px" }}>
                {logo}
            </span>

            {/* Desktop Links */}
            <ul style={{
                display: "flex", gap: "32px", listStyle: "none",
                margin: 0, padding: 0,
            }}
                className="navbar-links"
            >
                {defaultLinks.map((link) => (
                    <li key={link.label}>
                        <a href={link.href} style={{
                            color: "#ccc", textDecoration: "none", fontSize: "14px",
                            fontWeight: 500, transition: "color 0.2s",
                        }}
                            onMouseEnter={(e) => e.target.style.color = "#ff6b35"}
                            onMouseLeave={(e) => e.target.style.color = "#ccc"}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                type="button"
                onClick={onOrderClick}
                style={{
                    backgroundColor: "#ff6b35", color: "white", border: "none",
                    padding: "10px 24px", borderRadius: "50px", fontWeight: 700,
                    fontSize: "14px", cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#e55a25"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#ff6b35"}
            >
                Order Now
            </button>
        </nav>
    );
}
