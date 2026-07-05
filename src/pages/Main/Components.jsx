import { useState } from "react";
import Navbar from "../../components/ui/Navbar";
import HeroSection from "../../components/ui/HeroSection";
import FoodCard from "../../components/ui/FoodCard";
import CategoryBadge from "../../components/ui/CategoryBadge";
import RatingStars from "../../components/ui/RatingStars";
import TestimonialCard from "../../components/ui/TestimonialCard";
import Button from "../../components/ui/Button";
import SectionHeader from "../../components/ui/SectionHeader";
import FeatureItem from "../../components/ui/FeatureItem";
import ChefCard from "../../components/ui/ChefCard";
import PriceTag from "../../components/ui/PriceTag";
import OrderSummary from "../../components/ui/OrderSummary";
import NewsletterForm from "../../components/ui/NewsletterForm";
import Footer from "../../components/ui/Footer";
import StatsCounter from "../../components/ui/StatsCounter";

/**
 * Components - Halaman showcase semua 15 komponen UI reusable
 */
export default function Components() {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [cartItems, setCartItems] = useState([
        { id: "1", name: "Ayam Bakar Spesial", qty: 2, price: 45000 },
        { id: "2", name: "Es Teh Manis", qty: 1, price: 8000 },
    ]);

    const categories = [
        { label: "Semua", emoji: "🍽️" },
        { label: "Makanan", emoji: "🍖" },
        { label: "Minuman", emoji: "🥤" },
        { label: "Dessert", emoji: "🍰" },
        { label: "Paket", emoji: "📦" },
    ];

    function handleQtyChange(id, newQty) {
        setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, qty: newQty } : item));
    }

    function handleRemoveItem(id) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    }

    const sectionStyle = {
        marginBottom: "60px",
        padding: "32px",
        backgroundColor: "#16162a",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.05)",
    };

    const labelStyle = {
        display: "inline-block",
        backgroundColor: "rgba(255,107,53,0.15)",
        color: "#ff6b35",
        padding: "4px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 700,
        marginBottom: "20px",
        letterSpacing: "1px",
        textTransform: "uppercase",
    };

    return (
        <div style={{ backgroundColor: "#0f0f1a", minHeight: "100vh", color: "#fff" }}>

            {/* ── 1. NAVBAR ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>01 · Navbar</span>
                <Navbar logo="Sukses Catering." onOrderClick={() => alert("Order clicked!")} />
            </div>

            {/* ── 2. HERO SECTION ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>02 · Hero Section</span>
                <HeroSection
                    onPrimary={() => alert("Order Now!")}
                    onSecondary={() => alert("View Menu!")}
                />
            </div>

            {/* ── 3. FOOD CARD ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>03 · Food Card</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                    <FoodCard name="Ayam Bakar Spesial" category="Makanan" price={45000} rating={4.8} sold={234} isPopular onAdd={() => alert("Added!")} />
                    <FoodCard name="Es Teh Manis" category="Minuman" price={8000} rating={4.5} sold={198} onAdd={() => alert("Added!")} />
                    <FoodCard name="Nasi Goreng Kampung" category="Makanan" price={35000} rating={4.7} sold={187} onAdd={() => alert("Added!")} />
                    <FoodCard name="Kopi Susu Gacor" category="Minuman" price={18000} rating={4.9} sold={165} isPopular onAdd={() => alert("Added!")} />
                </div>
            </div>

            {/* ── 4. CATEGORY BADGE ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>04 · Category Badge</span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {categories.map((cat) => (
                        <CategoryBadge
                            key={cat.label}
                            label={cat.label}
                            emoji={cat.emoji}
                            active={activeCategory === cat.label}
                            onClick={() => setActiveCategory(cat.label)}
                            variant="pill"
                        />
                    ))}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {categories.map((cat) => (
                        <CategoryBadge key={cat.label} label={cat.label} emoji={cat.emoji} variant="chip" active={activeCategory === cat.label} onClick={() => setActiveCategory(cat.label)} />
                    ))}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {categories.map((cat) => (
                        <CategoryBadge key={cat.label} label={cat.label} emoji={cat.emoji} variant="outline" active={activeCategory === cat.label} onClick={() => setActiveCategory(cat.label)} />
                    ))}
                </div>
            </div>

            {/* ── 5. RATING STARS ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>05 · Rating Stars</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <RatingStars value={4.8} reviewCount={1234} size="lg" />
                    <RatingStars value={3.5} reviewCount={89} size="md" />
                    <RatingStars value={5} size="sm" />
                    <RatingStars value={2.5} size="md" interactive onChange={(v) => alert(`Rated: ${v}`)} />
                </div>
            </div>

            {/* ── 6. TESTIMONIAL CARD ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>06 · Testimonial Card</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                    <TestimonialCard name="Wahyu Putra" role="Wedding Client" rating={5} comment="Makanannya luar biasa enak! Semua tamu puas dan pelayanannya sangat profesional." variant="card" />
                    <TestimonialCard name="Dika Pratama" role="Corporate Event" rating={4.5} comment="Catering terbaik yang pernah kami gunakan untuk acara kantor. Tepat waktu dan rapi." variant="quote" />
                    <TestimonialCard name="Sari Indah" role="Birthday Party" rating={5} comment="Dekorasi dan makanannya sempurna! Tamu-tamu sangat terkesan. Highly recommended!" variant="card" />
                </div>
            </div>

            {/* ── 7. BUTTON ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>07 · Button</span>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <Button variant="primary" rounded>Order Now</Button>
                    <Button variant="secondary">View Menu</Button>
                    <Button variant="outline" rounded>Learn More</Button>
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="danger">Delete</Button>
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <Button size="sm" variant="primary">Small</Button>
                    <Button size="md" variant="primary">Medium</Button>
                    <Button size="lg" variant="primary">Large</Button>
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <Button variant="primary" leftIcon="🛒">Add to Cart</Button>
                    <Button variant="outline" rightIcon="→">See All Menu</Button>
                    <Button variant="primary" loading>Loading...</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                </div>
            </div>

            {/* ── 8. SECTION HEADER ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>08 · Section Header</span>
                <SectionHeader
                    tagline="Our Menu"
                    title="Pilihan Menu Terbaik"
                    description="Nikmati berbagai pilihan menu lezat yang dibuat dari bahan-bahan segar pilihan oleh chef berpengalaman kami."
                    align="center"
                />
                <SectionHeader
                    tagline="About Us"
                    title="Kenapa Pilih Kami?"
                    align="left"
                    showDivider={false}
                />
            </div>

            {/* ── 9. FEATURE ITEM ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>09 · Feature Item</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                    <FeatureItem icon="🥬" title="Bahan Segar" description="Bahan-bahan segar dipilih setiap hari dari supplier terpercaya." variant="card" />
                    <FeatureItem icon="👨‍🍳" title="Chef Berpengalaman" description="Tim chef kami memiliki pengalaman lebih dari 10 tahun." variant="card" />
                    <FeatureItem icon="🚀" title="Pengiriman Cepat" description="Pesanan diantar tepat waktu ke lokasi acara Anda." variant="card" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <FeatureItem icon="🏆" title="Kualitas Terjamin" description="Setiap hidangan melewati quality control ketat sebelum disajikan." variant="inline" />
                    <FeatureItem icon="💰" title="Harga Terjangkau" description="Paket catering mulai dari Rp 25.000 per porsi." variant="inline" />
                </div>
            </div>

            {/* ── 10. CHEF CARD ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>10 · Chef Card</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                    <ChefCard name="Chef Wahyu" specialty="Indonesian Cuisine" rating={4.9} experience={10} menuCount={52} socials={[{ icon: "📸", href: "#" }, { icon: "📘", href: "#" }]} />
                    <ChefCard name="Chef Dika" specialty="Western Fusion" rating={4.7} experience={7} menuCount={38} socials={[{ icon: "📸", href: "#" }]} />
                    <ChefCard name="Chef Sari" specialty="Pastry & Dessert" rating={4.8} experience={5} menuCount={29} socials={[{ icon: "📸", href: "#" }, { icon: "▶️", href: "#" }]} />
                </div>
            </div>

            {/* ── 11. PRICE TAG ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>11 · Price Tag</span>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                    <PriceTag price={45000} size="md" />
                    <PriceTag price={35000} originalPrice={50000} size="lg" />
                    <PriceTag price={18000} variant="badge" label="/ cup" />
                    <PriceTag price={125000} originalPrice={175000} variant="card" label="/ paket" />
                </div>
            </div>

            {/* ── 12. ORDER SUMMARY ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>12 · Order Summary</span>
                <div style={{ maxWidth: "400px" }}>
                    <OrderSummary
                        items={cartItems}
                        deliveryFee={15000}
                        discount={10000}
                        promoCode="GACOR10"
                        onCheckout={() => alert("Checkout!")}
                        onRemoveItem={handleRemoveItem}
                        onQtyChange={handleQtyChange}
                    />
                </div>
            </div>

            {/* ── 13. NEWSLETTER FORM ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>13 · Newsletter Form</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <NewsletterForm variant="card" onSubmit={(email) => alert(`Subscribed: ${email}`)} />
                    <div>
                        <NewsletterForm
                            variant="stacked"
                            title="Jangan Ketinggalan Promo!"
                            subtitle="Daftar sekarang dan hemat lebih banyak."
                            onSubmit={(email) => alert(`Subscribed: ${email}`)}
                        />
                    </div>
                </div>
            </div>

            {/* ── 14. STATS COUNTER ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>14 · Stats Counter</span>
                <StatsCounter animate />
            </div>

            {/* ── 15. FOOTER ── */}
            <div style={sectionStyle}>
                <span style={labelStyle}>15 · Footer</span>
                <Footer />
            </div>

        </div>
    );
}
