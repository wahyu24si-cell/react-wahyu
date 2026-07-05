import RatingStars from "../../../components/ui/RatingStars";

const TIER_CONFIG = {
    Bronze:   { color: "#b45309", bg: "rgba(180,83,9,0.12)",   next: "Silver",   pointsNeeded: 500  },
    Silver:   { color: "#9ca3af", bg: "rgba(156,163,175,0.12)", next: "Gold",     pointsNeeded: 1000 },
    Gold:     { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  next: "Platinum", pointsNeeded: 2000 },
    Platinum: { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  next: null,       pointsNeeded: null },
};

const mockStats = {
    totalOrders: 14,
    totalSpent: 1260000,
    points: 840,
    tier: "Gold",
    joinDate: "Januari 2026",
    favoriteMenu: "Ayam Bakar Spesial",
    avgRating: 4.8,
    savedAddresses: 2,
};

export default function MemberProfile({ user, displayName }) {
    const tier = TIER_CONFIG[mockStats.tier] || TIER_CONFIG.Bronze;
    const progressPct = tier.next
        ? Math.min((mockStats.points / tier.pointsNeeded) * 100, 100)
        : 100;

    const formatRp = (v) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── Stats Row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                {[
                    { label: "Total Order",   value: mockStats.totalOrders,       color: "#3b82f6", icon: "🛒" },
                    { label: "Total Belanja", value: formatRp(mockStats.totalSpent), color: "#10b981", icon: "💰" },
                    { label: "Poin Reward",   value: `${mockStats.points} pts`,   color: "#f59e0b", icon: "⭐" },
                    { label: "Bergabung",     value: mockStats.joinDate,           color: "#8b5cf6", icon: "📅" },
                ].map((s) => (
                    <div key={s.label} style={{ backgroundColor: "#1e1e2e", borderRadius: "12px", padding: "20px", borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* ── Tier Card ── */}
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "16px", padding: "28px", border: `2px solid ${tier.color}40` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: tier.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                            {mockStats.tier === "Platinum" ? "💎" : mockStats.tier === "Gold" ? "🥇" : mockStats.tier === "Silver" ? "🥈" : "🥉"}
                        </div>
                        <div>
                            <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Status Keanggotaan</div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: tier.color }}>{mockStats.tier}</div>
                        </div>
                    </div>

                    {tier.next ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888", marginBottom: "8px" }}>
                                <span>Menuju {tier.next}</span>
                                <span style={{ color: tier.color, fontWeight: 600 }}>{mockStats.points} / {tier.pointsNeeded} pts</span>
                            </div>
                            <div style={{ backgroundColor: "#2d2d3d", borderRadius: "6px", height: "10px", overflow: "hidden" }}>
                                <div style={{ width: `${progressPct}%`, height: "100%", backgroundColor: tier.color, borderRadius: "6px", transition: "width 0.5s" }} />
                            </div>
                            <p style={{ fontSize: "12px", color: "#666", margin: "10px 0 0" }}>
                                Butuh <strong style={{ color: tier.color }}>{tier.pointsNeeded - mockStats.points} poin</strong> lagi untuk naik ke {tier.next}
                            </p>
                        </>
                    ) : (
                        <div style={{ fontSize: "13px", color: "#8b5cf6", fontWeight: 600, marginTop: "8px" }}>
                            ✨ Kamu sudah di tier tertinggi!
                        </div>
                    )}
                </div>

                {/* ── Info Akun ── */}
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "16px", padding: "28px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>📋 Info Akun</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            { label: "Nama",         value: displayName },
                            { label: "Email",        value: user?.email || "-" },
                            { label: "Member sejak", value: mockStats.joinDate },
                            { label: "Menu favorit", value: mockStats.favoriteMenu },
                            { label: "Alamat tersimpan", value: `${mockStats.savedAddresses} alamat` },
                        ].map((row) => (
                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "10px" }}>
                                <span style={{ color: "#888" }}>{row.label}</span>
                                <span style={{ color: "#fff", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{row.value}</span>
                            </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <span style={{ color: "#888" }}>Rating rata-rata</span>
                            <RatingStars value={mockStats.avgRating} size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Benefit aktif ── */}
            <div style={{ backgroundColor: "#1e1e2e", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>🎁 Benefit Aktif Kamu</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                    {[
                        { icon: "🏷️", text: "Diskon 15% setiap order" },
                        { icon: "🚚", text: "Gratis ongkir tiap hari" },
                        { icon: "⚡", text: "Priority order processing" },
                        { icon: "🎂", text: "Surprise di hari ulang tahun" },
                        { icon: "📜", text: "Akses riwayat order lengkap" },
                        { icon: "💬", text: "Customer support prioritas" },
                    ].map((b) => (
                        <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#2d2d3d", borderRadius: "10px", padding: "12px" }}>
                            <span style={{ fontSize: "18px" }}>{b.icon}</span>
                            <span style={{ fontSize: "12px", color: "#ccc", lineHeight: 1.4 }}>{b.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
