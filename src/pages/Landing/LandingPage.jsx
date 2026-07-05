import { useState } from "react";
import LandingNavbar from "./sections/LandingNavbar";
import LandingHero from "./sections/LandingHero";
import LandingFeatures from "./sections/LandingFeatures";
import LandingMenu from "./sections/LandingMenu";
import LandingTestimonials from "./sections/LandingTestimonials";
import LandingCTA from "./sections/LandingCTA";
import LandingFooter from "./sections/LandingFooter";
import AuthModal from "./AuthModal";

/**
 * LandingPage — Halaman utama publik.
 * Route: / (root)
 * Login & Register dilakukan via modal tanpa pindah halaman.
 */
export default function LandingPage() {
    // null | "login" | "register"
    const [modal, setModal] = useState(null);

    const openLogin    = () => setModal("login");
    const openRegister = () => setModal("register");
    const closeModal   = () => setModal(null);

    return (
        <div style={{
            backgroundColor: "#0d0d1a",
            color: "#fff",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            overflowX: "hidden",
        }}>
            <LandingNavbar
                onLogin={openLogin}
                onRegister={openRegister}
            />
            <LandingHero
                onOrder={openRegister}
                onMenu={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            />
            <LandingFeatures />
            <LandingMenu onOrder={openRegister} />
            <LandingTestimonials />
            <LandingCTA
                onRegister={openRegister}
                onLogin={openLogin}
            />
            <LandingFooter />

            {/* Modal Login / Register */}
            {modal && (
                <AuthModal mode={modal} onClose={closeModal} />
            )}
        </div>
    );
}
