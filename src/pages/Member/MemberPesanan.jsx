import { useState } from "react";

const formatRp = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

const ALL_ORDERS = [
    { id: "ORD-001", menu: "Ayam Bakar × 2",          total: 90000,  status: "Delivered",   date: "20 Jun 2026", rating: 5 },
    { id: "ORD-002", menu: "Nasi Goreng × 3",          total: 105000, status: "Delivered",   date: "18 Jun 2026", rating: 4 },
    { id: "ORD-003", menu: "Paket Catering 20 Orang",  total: 500000, status: "On Delivery", date: "Hari ini",    rating: null },
    { id: "ORD-004", menu: "Es Teh × 4, Kopi × 2",    total: 68000,  status: "Preparing",   date: "Hari ini",    rating: null },
    { id: "ORD-005", menu: "Burger Spesial × 2",       total: 110000, status: "Canceled",    date: "15 Jun 2026", rating: null },
    { id: "ORD-006", menu: "Lava Cake × 3",            total: 84000,  status: "Delivered",   date: "10 Jun 2026", rating: 5 },
    { id: "ORD-007", menu: "Mie Goreng Jumbo × 2",     total: 76000,  status: "Delivered",   date: "5 Jun 2026",  rating: 4 },
];

const STATUS_MAP = {
    "Delivered":   { color: "#10b981", label: "✅ Selesai" },
    "On Delivery": { color: "#3b82f6", label: "🚚 Dikirim" },
    "Preparing":   { color: "#f59e0b", label: "🍳 Diproses" },
    "Canceled":    { color: "#ef4444", label: "❌ Dibatal" },
};

const FILTERS = ["Semua", "Preparing", "On Delivery", "Delivered", "Canceled"];

export default function MemberPesanan() {
    const [filter, setFilter] = useState("Semua");

    const shown = filter === "Semua"
        ? ALL_ORDERS
        : ALL_ORDERS.filter((o) => o.status === filter);

    const totalBelanja = ALL_ORDERS
        .filter((o) => o.status !== "Canceled")
        .reduce((s, o) => s + o.total, 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Header */}
            <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, color: "#fff" }}>🛒 Riwayat Pesanan</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                    Total {ALL_ORDERS.length} pesanan · {formatRp(totalBelanja)} belanja
                </p>
            </div>

            {/* Summary mini */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {[
                    { label: "Total",     value: ALL_ORDERS.length,                                       color: "#3b82f6" },
                    { label: "Selesai",   value: ALL_ORDERS.filter(o => o.status === "Delivered").length,  color: "#10b981" },
                    { label: "Aktif",     value: ALL_ORDERS.filter(o => ["Preparing","On Delivery"].includes(o.status)).length, color: "#f59e0b" },
                    { label: "Dibatal",   value: ALL_ORDERS.filter(o => o.status === "Canceled").length,   color: "#ef4444" },
                ].map((s) => (
                    <div key={s.label} style={{
                        backgroundColor: "#13131f", borderRadius: "10px",
                        padding: "14px", borderLeft: `3px solid ${s.color}`, textAlign: "center",
                    }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {FILTERS.map((f) => (
                    <button key={f} type="button" onClick={() => setFilter(f)}
                        style={{
                            padding: "6px 16px", borderRadius: "50px", border: "none",
                            backgroundColor: filter === f ? "#ff6b35" : "#1e1e2e",
                            color: filter === f ? "#fff" : "#888",
                            fontSize: "12px", fontWeight: 600, cursor: "pointer",
                            transition: "all 0.2s",
                        }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {shown.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#555" }}>
                        Tidak ada pesanan ditemukan
                    </div>
                ) : shown.map((order) => {
                    const st = STATUS_MAP[order.status];
                    return (
                        <div key={order.id} style={{
                            backgroundColor: "#13131f", borderRadius: "12px",
                            padding: "16px 18px", border: "1px solid rgba(255,255,255,0.05)",
                            display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
                        }}>
                            {/* ID & tanggal */}
                            <div style={{ minWidth: "88px" }}>
                                <div style={{ fontSize: "13px", fontWeight: 800, color: "#ff6b35" }}>{order.id}</div>
                                <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{order.date}</div>
                            </div>

                            {/* Divider */}
                            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.06)" }} />

                            {/* Menu */}
                            <div style={{ flex: 1, minWidth: "140px" }}>
                                <div style={{ fontSize: "13px", color: "#ddd" }}>{order.menu}</div>
                            </div>

                            {/* Rating */}
                            <div style={{ fontSize: "13px", color: "#f59e0b", minWidth: "60px", textAlign: "center" }}>
                                {order.rating ? "★".repeat(order.rating) : <span style={{ color: "#444" }}>—</span>}
                            </div>

                            {/* Total */}
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#10b981", minWidth: "96px", textAlign: "right" }}>
                                {formatRp(order.total)}
                            </div>

                            {/* Status */}
                            <span style={{
                                backgroundColor: st.color + "18",
                                color: st.color,
                                border: `1px solid ${st.color}33`,
                                padding: "4px 12px", borderRadius: "50px",
                                fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
                            }}>
                                {st.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
