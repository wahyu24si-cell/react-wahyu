import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import HeroSection from "../../components/ui/HeroSection";
import SectionHeader from "../../components/ui/SectionHeader";
import FoodCard from "../../components/ui/FoodCard";
import CategoryBadge from "../../components/ui/CategoryBadge";
import FeatureItem from "../../components/ui/FeatureItem";
import TestimonialCard from "../../components/ui/TestimonialCard";
import StatsCounter from "../../components/ui/StatsCounter";
import ChefCard from "../../components/ui/ChefCard";
import NewsletterForm from "../../components/ui/NewsletterForm";
import Footer from "../../components/ui/Footer";
import MemberBenefits from "./MemberBenefits";
import MenuSection from "./MenuSection";

const categories = [
    { label: "Semua", emoji: "🍽️" },
    { label: "Makanan", emoji: "🍖" },
    { label: "Minuman", emoji: "🥤" },
    { label: "Dessert", emoji: "🍰" },
    { label: "Paket", emoji: "📦" },
];

const menuItems = [
    { id: 1, name: "Ayam Bakar Spesial", category: "Makanan", price: 45000, rating: 4.8, sold: 234, isPopular: true },
    { id: 2, name: "Nasi Goreng Kampung", category: "Makanan", price: 35000, rating: 4.7, sold: 187, isPopular: false },
    { id: 3, name: "Es Teh Manis", category: "Minuman", price: 8000, rating: 4.5, sold: 198, isPopular: false },
    { id: 4, name: "Kopi Susu Gacor", category: "Minuman", price: 18000, rating: 4.9, sold: 165, isPopular: true },
    { id: 5, name: "Burger Spesial", category: "Makanan", price: 55000, rating: 4.6, sold: 143, isPopular: false },
    { id: 6, name: "Lava Cake Coklat", category: "Dessert", price: 28000, rating: 4.9, sold: 112, isPopular: true },
    { id: 7, name: "Paket Catering 10 Orang", category: "Paket", price: 350000, rating: 4.8, sold: 89, isPopular: false },
    { id: 8, name: "Mie Goreng Jumbo", category: "Makanan", price: 38000, rating: 4.6, sold: 156, isPopular: false },
];

const testimonials = [
    { name: "Wahyu Putra", role: "Wedding Client", rating: 5, comment: "Makanannya luar biasa enak! Semua tamu puas dan pelayanannya sangat profesional. Pasti akan pesan lagi.", date: "Jun 2026" },
    { name: "Dika Pratama", role: "Corporate Event", rating: 5, comment: "Catering terbaik untuk acara kantor kami. Tepat waktu, rapi, dan rasanya konsisten enak.", date: "Mei 2026" },
    { name: "Sari Indah", role: "Birthday Party", rating: 5, comment: "Sangat memuaskan! Porsinya besar, variasinya banyak, dan harganya sangat terjangkau.", date: "Apr 2026" },
];

const chefs = [
    { name: "Chef Wahyu", specialty: "Indonesian Cuisine", rating: 4.9, experience: 10, menuCount: 52 },
    { name: "Chef Dika", specialty: "Western Fusion", rating: 4.7, experience: 7, menuCount: 38 },
    { name: "Chef Sari", specialty: "Pastry & Dessert", rating: 4.8, experience: 5, menuCount: 29 },
];

export default function GuestPage() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState("Semua");

    const filtered = activeCategory === "Semua"
        ? menuItems
        : menuItems.filter(m => m.category === activeCategory);

    return (
        <div style={{ backgroundColor: "#0f0f1a", color: "#fff", fontFamily: "'Poppins', system-ui, sans-serif" }}>

            {/* NAVBAR */}
            <Navbar
                logo="Gacor."
                links={[
                    { label: "Beranda", href: "#home" },
                    { label: "Menu", href: "#menu" },
                    { label: "Layanan", href: "#services" },
                    { label: "Chef", href: "#chefs" },
                    { label: "Member", href: "#member" },
                    { label: "Kontak", href: "#contact" },
                ]}
                onOrderClick={() => navigate("/login")}
            />

            {/* HERO */}
            <HeroSection
                tagline="🍽️ Premium Food Catering"
                title={"Lezat, Segar &\nTak Terlupakan"}
                subtitle="Kami menghadirkan pengalaman kuliner terbaik untuk setiap momen spesial kamu. Dari wedding hingga corporate event."
                primaryLabel="Pesan Sekarang"
                secondaryLabel="Lihat Menu"
                onPrimary={() => navigate("/login")}
                onSecondary={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
                stats={[
                    { value: "500+", label: "Menu Items" },
                    { value: "10K+", label: "Happy Clients" },
                    { value: "4.9★", label: "Rating" },
                ]}
            />

            {/* STATS */}
            <section style={{ padding: "60px 32px", backgroundColor: "#12121f" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <StatsCounter stats={[
                        { value: 500, suffix: "+", label: "Menu Items", icon: "🍽️" },
                        { value: 10000, suffix: "+", label: "Happy Clients", icon: "😊" },
                        { value: 8, suffix: " Tahun", label: "Pengalaman", icon: "🏆" },
                        { value: 4.9, suffix: "★", label: "Rating", icon: "⭐" },
                    ]} animate />
                </div>
            </section>

            {/* MENU */}
            <MenuSection
                categories={categories}
                menuItems={filtered}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onOrderClick={() => navigate("/login")}
            />

            {/* LAYANAN */}
            <section id="services" style={{ padding: "80px 32px", backgroundColor: "#12121f" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <SectionHeader
                        tagline="Layanan Kami"
                        title="Apa yang Kami Tawarkan"
                        description="Dari catering pernikahan hingga makan siang kantor, kami siap melayani semua kebutuhan kuliner kamu."
                        align="center"
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
                        {[
                            { icon: "💍", title: "Wedding Catering", description: "Layanan catering pernikahan mewah dengan menu pilihan dan dekorasi elegant untuk hari spesial kamu." },
                            { icon: "🏢", title: "Corporate Event", description: "Solusi katering profesional untuk rapat, seminar, dan acara perusahaan dengan standar kualitas tinggi." },
                            { icon: "🎂", title: "Birthday & Party", description: "Rayakan ulang tahun dan pesta dengan sajian lezat yang bikin semua tamu terkesan." },
                            { icon: "🍱", title: "Daily Catering", description: "Langganan catering harian untuk kantor atau asrama dengan menu bervariasi setiap hari." },
                            { icon: "🎓", title: "Event Kampus", description: "Katering untuk wisuda, ospek, dan acara kampus dengan harga ramah mahasiswa." },
                            { icon: "🚚", title: "Free Delivery", description: "Pengiriman gratis untuk area Bandung. Tepat waktu dan terjaga kualitasnya sampai ke tangan kamu." },
                        ].map(f => (
                            <FeatureItem key={f.title} icon={f.icon} title={f.title} description={f.description} variant="card" />
                        ))}
                    </div>
                </div>
            </section>

            {/* CHEF */}
            <section id="chefs" style={{ padding: "80px 32px", backgroundColor: "#0f0f1a" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <SectionHeader tagline="Tim Chef" title="Chef Berpengalaman Kami" align="center"
                        description="Dimasak oleh chef profesional dengan pengalaman lebih dari 5 tahun di industri kuliner." />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
                        {chefs.map(c => <ChefCard key={c.name} {...c} />)}
                    </div>
                </div>
            </section>

            {/* MEMBER BENEFITS */}
            <MemberBenefits onJoin={() => navigate("/register")} onLogin={() => navigate("/login")} />

            {/* TESTIMONIALS */}
            <section id="testimonial" style={{ padding: "80px 32px", backgroundColor: "#12121f" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <SectionHeader tagline="Testimoni" title="Apa Kata Pelanggan Kami" align="center" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} {...t} variant={i === 1 ? "quote" : "card"} />
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section id="contact" style={{ padding: "60px 32px", backgroundColor: "#0f0f1a" }}>
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                    <NewsletterForm variant="card" onSubmit={(email) => alert(`Subscribed: ${email}`)} />
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
