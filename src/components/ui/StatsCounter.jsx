import { useEffect, useRef, useState } from "react";

/**
 * StatsCounter Component - Animasi angka statistik
 *
 * Props:
 * @param {Array} stats - Array of { value, suffix, label, icon }
 * @param {string} variant - "row" | "grid" | "card"
 * @param {boolean} animate - Aktifkan animasi count-up
 */
export default function StatsCounter({
    stats = [
        { value: 500, suffix: "+", label: "Menu Items", icon: "🍽️" },
        { value: 10000, suffix: "+", label: "Happy Clients", icon: "😊" },
        { value: 8, suffix: " Tahun", label: "Pengalaman", icon: "🏆" },
        { value: 4.9, suffix: "★", label: "Rating", icon: "⭐" },
    ],
    variant = "row",
    animate = true,
}) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: variant === "grid"
                ? "repeat(2, 1fr)"
                : `repeat(${stats.length}, 1fr)`,
            gap: "24px",
        }}>
            {stats.map((stat, i) => (
                <StatItem key={i} stat={stat} animate={animate} variant={variant} delay={i * 150} />
            ))}
        </div>
    );
}

function StatItem({ stat, animate, variant, delay }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const animated = useRef(false);

    useEffect(() => {
        if (!animate) { setCount(stat.value); return; }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !animated.current) {
                animated.current = true;
                setTimeout(() => {
                    const isDecimal = !Number.isInteger(stat.value);
                    const duration = 1500;
                    const steps = 60;
                    const increment = stat.value / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= stat.value) {
                            setCount(stat.value);
                            clearInterval(timer);
                        } else {
                            setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
                        }
                    }, duration / steps);
                }, delay);
            }
        }, { threshold: 0.3 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [stat.value, animate, delay]);

    const isCard = variant === "card" || variant === "grid";

    return (
        <div ref={ref} style={{
            textAlign: "center",
            padding: isCard ? "28px 20px" : "20px",
            backgroundColor: isCard ? "#1e1e2e" : "transparent",
            borderRadius: isCard ? "16px" : 0,
            border: isCard ? "1px solid rgba(255,255,255,0.06)" : "none",
            transition: "transform 0.2s",
        }}
            onMouseEnter={(e) => { if (isCard) e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { if (isCard) e.currentTarget.style.transform = "translateY(0)"; }}
        >
            {stat.icon && (
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
            )}
            <div style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#ff6b35", lineHeight: 1 }}>
                {count}{stat.suffix}
            </div>
            <div style={{ fontSize: "14px", color: "#888", marginTop: "6px", fontWeight: 500 }}>
                {stat.label}
            </div>
        </div>
    );
}
