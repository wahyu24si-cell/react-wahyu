import { useState } from "react";

const STATUS_STYLE = {
    "Delivered":   { bg: "#10b981", label: "✅ Delivered" },
    "On Delivery": { bg: "#3b82f6", label: "🚚 On Delivery" },
    "Preparing":   { bg: "#f59e0b", label: "🍳 Preparing" },
    "Canceled":    { bg: "#ef4444", label: "❌ Canceled" },
};

const mockOrders = [
    { id: "ORD-001", date: "20 Jun 2026", items: "Ayam Bakar Spesial × 2, Es Teh Manis × 1", total: 98000, status: "Delivered",   rating: 5 },
    { id: "ORD-002", date: "18 Jun 2026", items: "Nasi Goreng Kampung × 3",                   total: 105000, status: "Delivered",   rating: 4 },
    { id: "ORD-003", date: "15 Jun 2026", items: "Paket Catering 10 Orang",                    total: 350000, status: "Delivered",   rating: 5 },
    { id: "ORD-004", date: "12 Jun 2026", items: "Burger Spesial × 2, Kopi Susu × 2",          total: 146000, status: "Delivered",   rating: 4 },
    { id: "ORD-005", date: "10 Jun 2026", items: "Lava Cake Coklat × 4",                       total: 112000, status: "Canceled",    rating: null },
    { id: "ORD-006", date: "Hari ini",    items: "Ayam Bakar Spesial × 1, Mie Goreng × 1",    total: 83000,  status: "On Delivery", rating: null },
    { id: "ORD-007", date: "Hari ini",    items: "Paket Gold 20 Orang",                         total: 900000, status: "Preparing",  rating: null },
];

const formatRp = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

export default function MemberOrders() {
    const [filter, setFilter] = useState("Semua");
    const [search, setSearch] = useState("");

    const filters = ["Semua", "Preparing", "On Delivery", "Delivered", "Canceled"];

    const filtered = mockOrders.filter((o) => {
        const matchFilter = filter === "Semua" || o.status === filter;
        const matchSearch = search === "" || o.id.toLowerCase().includes(search.toLowerCase()) || o.items.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const totalSpent = mockOrders
        .filter((o) => o.status === "Delivered")
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px" }}>
                {[
                    { label: "Total Order",    value: mockOrders.length,                                            color: "#3b82f6" },
                    { label: "Selesai",        value: mockOrders.filter(o => o.status === "Delivered").length,     color: "#10b981" },
                    { label: "Dibatalkan",     value: mockOrders.filter(o => o.status === "Canceled").length,     color: "#ef4444" },
                    { label: "Total Belanja",  value: formatRp(totalSpent),                                        color: "#f59e0b" },
                ].map((s) => (
                    <div key={s.label} style={{ backgroundColor: "#1e1e2e", borderRadius: "12px", padding: "16px", borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="panel-card">
                <div className="panel-title">Riwayat Pesanan</div>

                {/* Filter & Search */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {filters.map((f) => (
                            <button key={f} type="button" onClick={() => setFilter(f)}
                                style={{
                                    padding: "6px 14px", borderRadius: "50px", border: "none",
                                    cursor: "pointer", fontSize: "12px", fontWeight: 600,
                                    backgroundColor: filter === f ? "#ff6b35" : "#2d2d3d",
                                    color: filter === f ? "white" : "#888",
                                    transition: "all 0.2s",
                                }}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text" placeholder="Cari order ID atau menu..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, minWidth: "180px", padding: "8px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                    />
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div id="dashboard-empty-state">Tidak ada order ditemukan</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    {["Order ID", "Tanggal", "Item", "Total", "Status", "Rating"].map((h) => (
                                        <th key={h} style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: "13px", color: "#aaa" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order, i) => {
                                    const st = STATUS_STYLE[order.status] || STATUS_STYLE["Preparing"];
                                    return (
                                        <tr key={order.id} style={{ borderBottom: "1px solid #2d2d3d", backgroundColor: i % 2 === 0 ? "#1e1e2e" : "#232333" }}>
                                            <td style={{ padding: "12px", fontWeight: 700, color: "#ff6b35", fontSize: "13px" }}>{order.id}</td>
                                            <td style={{ padding: "12px", fontSize: "13px", color: "#aaa" }}>{order.date}</td>
                                            <td style={{ padding: "12px", fontSize: "12px", maxWidth: "220px", color: "#ccc" }}>{order.items}</td>
                                            <td style={{ padding: "12px", fontWeight: 700, color: "#10b981", fontSize: "13px" }}>{formatRp(order.total)}</td>
                                            <td style={{ padding: "12px" }}>
                                                <span style={{ backgroundColor: st.bg, color: "white", padding: "4px 10px", borderRadius: "50px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", fontSize: "13px" }}>
                                                {order.rating ? (
                                                    <span style={{ color: "#f59e0b" }}>{"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)}</span>
                                                ) : (
                                                    <span style={{ color: "#444" }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
