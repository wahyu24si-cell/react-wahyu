import { useState } from "react";

const currentPoints = 840;

const rewardHistory = [
    { id: 1, type: "earn",  desc: "Order ORD-003 selesai",       points: +175, date: "15 Jun 2026" },
    { id: 2, type: "earn",  desc: "Order ORD-002 selesai",       points: +52,  date: "18 Jun 2026" },
    { id: 3, type: "earn",  desc: "Order ORD-001 selesai",       points: +49,  date: "20 Jun 2026" },
    { id: 4, type: "redeem", desc: "Redeem diskon Rp 20.000",    points: -200, date: "10 Jun 2026" },
    { id: 5, type: "earn",  desc: "Bonus pendaftaran member",     points: +500, date: "1 Jan 2026" },
    { id: 6, type: "earn",  desc: "Order ORD-004 selesai",       points: +73,  date: "12 Jun 2026" },
];

const vouchers = [
    { id: "V1", name: "Diskon Rp 20.000",  cost: 200,  icon: "🏷️", desc: "Potongan langsung Rp 20.000 untuk order berikutnya",  available: true },
    { id: "V2", name: "Diskon 10%",         cost: 350,  icon: "💯", desc: "Diskon 10% maksimal Rp 50.000",                        available: true },
    { id: "V3", name: "Gratis Ongkir",      cost: 150,  icon: "🚚", desc: "Gratis ongkir untuk 1x order",                         available: true },
    { id: "V4", name: "Dessert Gratis",     cost: 180,  icon: "🍰", desc: "Satu porsi dessert pilihan gratis",                    available: true },
    { id: "V5", name: "Upgrade ke Gold",    cost: 800,  icon: "🥇", desc: "Langsung naik tier ke Gold",                           available: false },
    { id: "V6", name: "Cashback Rp 50.000", cost: 600,  icon: "💸", desc: "Cashback Rp 50.000 ke saldo kamu",                    available: true },
];

export default function MemberRewards() {
    const [redeemedIds, setRedeemedIds] = useState([]);
    const [points, setPoints] = useState(currentPoints);

    function handleRedeem(voucher) {
        if (points < voucher.cost) { alert("Poin kamu tidak cukup!"); return; }
        if (window.confirm(`Tukar ${voucher.cost} poin untuk "${voucher.name}"?`)) {
            setPoints((p) => p - voucher.cost);
            setRedeemedIds((ids) => [...ids, voucher.id]);
        }
    }

    const earnedTotal   = rewardHistory.filter(r => r.type === "earn").reduce((s, r) => s + r.points, 0);
    const redeemedTotal = rewardHistory.filter(r => r.type === "redeem").reduce((s, r) => s + Math.abs(r.points), 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Points summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px" }}>
                {[
                    { label: "Poin Aktif",    value: points,        color: "#f59e0b", icon: "⭐" },
                    { label: "Total Diperoleh", value: earnedTotal, color: "#10b981", icon: "📈" },
                    { label: "Total Ditukar",  value: redeemedTotal, color: "#8b5cf6", icon: "🎁" },
                    { label: "Voucher Aktif",  value: redeemedIds.length, color: "#3b82f6", icon: "🏷️" },
                ].map((s) => (
                    <div key={s.label} style={{ backgroundColor: "#1e1e2e", borderRadius: "12px", padding: "20px", borderLeft: `4px solid ${s.color}`, textAlign: "center" }}>
                        <div style={{ fontSize: "24px", marginBottom: "4px" }}>{s.icon}</div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* Voucher catalog */}
                <div className="panel-card">
                    <div className="panel-title">🎁 Tukar Poin</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {vouchers.map((v) => {
                            const isRedeemed = redeemedIds.includes(v.id);
                            const canAfford = points >= v.cost;
                            return (
                                <div key={v.id} style={{
                                    display: "flex", alignItems: "center", gap: "12px",
                                    backgroundColor: "#2d2d3d", borderRadius: "10px", padding: "14px",
                                    border: isRedeemed ? "1px solid #10b981" : "1px solid transparent",
                                    opacity: !v.available ? 0.5 : 1,
                                }}>
                                    <div style={{ fontSize: "28px", flexShrink: 0 }}>{v.icon}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{v.name}</div>
                                        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{v.desc}</div>
                                        <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 700, marginTop: "4px" }}>⭐ {v.cost} poin</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRedeem(v)}
                                        disabled={isRedeemed || !v.available || !canAfford}
                                        style={{
                                            padding: "7px 14px", borderRadius: "8px", border: "none",
                                            fontWeight: 700, fontSize: "12px", cursor: isRedeemed || !canAfford || !v.available ? "not-allowed" : "pointer",
                                            backgroundColor: isRedeemed ? "#10b981" : canAfford && v.available ? "#ff6b35" : "#374151",
                                            color: "white", flexShrink: 0, transition: "background 0.2s",
                                        }}>
                                        {isRedeemed ? "✓ Ditukar" : !canAfford ? "Kurang" : "Tukar"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* History */}
                <div className="panel-card">
                    <div className="panel-title">📜 Riwayat Poin</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {rewardHistory.map((r) => (
                            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#2d2d3d", borderRadius: "10px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: r.type === "earn" ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                                    {r.type === "earn" ? "📈" : "🎁"}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.desc}</div>
                                    <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{r.date}</div>
                                </div>
                                <div style={{ fontSize: "15px", fontWeight: 800, color: r.type === "earn" ? "#10b981" : "#8b5cf6", flexShrink: 0 }}>
                                    {r.type === "earn" ? "+" : ""}{r.points}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
