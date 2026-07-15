import { useState } from "react";

const STATUS_COLORS = {
    "Delivered":   "#10b981",
    "On Delivery": "#3b82f6",
    "Preparing":   "#f59e0b",
    "Canceled":    "#ef4444",
};

/**
 * Orders — Admin CRUD: Create, Read, Update (status+data), Delete
 */
export default function Orders({ orders, onAddOrder, onEditOrder, onDeleteOrder, isEmpty }) {
    const [form, setForm] = useState({ customer: "", item: "", total: "", status: "Preparing" });
    const [editId, setEditId]   = useState(null);
    const [search, setSearch]   = useState("");
    const [confirm, setConfirm] = useState(null); // id yang akan dihapus

    const filtered = search.trim()
        ? orders.filter(o => [o.id, o.customer, o.item, o.status].join(" ").toLowerCase().includes(search.toLowerCase()))
        : orders;

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.customer.trim() || !form.item.trim() || !form.total.trim()) {
            alert("Isi semua field yang wajib"); return;
        }
        if (editId) {
            onEditOrder?.({ ...form, id: editId });
            setEditId(null);
        } else {
            onAddOrder(form);
        }
        setForm({ customer: "", item: "", total: "", status: "Preparing" });
    }

    function startEdit(order) {
        setEditId(order.id);
        setForm({ customer: order.customer, item: order.item, total: order.total.replace(/[^0-9]/g, ""), status: order.status });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditId(null);
        setForm({ customer: "", item: "", total: "", status: "Preparing" });
    }

    return (
        <div id="dashboard-container">
            {/* ── FORM CREATE / EDIT ── */}
            <div className="panel-card" style={{ marginBottom: "20px" }}>
                <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{editId ? "✏️ Perbarui Pesanan" : "➕ Tambah Pesanan"}</span>
                    {editId && (
                        <button type="button" onClick={cancelEdit}
                            style={{ fontSize: "12px", color: "#888", background: "none", border: "1px solid #444", padding: "4px 12px", borderRadius: "6px", cursor: "pointer" }}>
                            Batal Perbarui
                        </button>
                    )}
                </div>
                <form className="quick-add-form" onSubmit={handleSubmit} noValidate>
                    <input type="text" placeholder="Nama pelanggan" value={form.customer}
                        onChange={e => setForm(p => ({ ...p, customer: e.target.value }))} required />
                    <input type="text" placeholder="Nama menu" value={form.item}
                        onChange={e => setForm(p => ({ ...p, item: e.target.value }))} required />
                    <input type="text" placeholder="Total (contoh: 78000)" value={form.total}
                        onChange={e => setForm(p => ({ ...p, total: e.target.value }))} required />
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                        <option value="Preparing">Diproses</option>
                        <option value="On Delivery">Dalam Pengiriman</option>
                        <option value="Delivered">Terkirim</option>
                        <option value="Canceled">Dibatalkan</option>
                    </select>
                    <button type="submit" style={{ backgroundColor: editId ? "#3b82f6" : "#ff6b35" }}>
                        {editId ? "Perbarui Pesanan" : "Tambah Pesanan"}
                    </button>
                </form>
            </div>

            {/* ── TABLE ── */}
            <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                    <div className="panel-title" style={{ margin: 0 }}>Daftar Pesanan ({filtered.length})</div>
                    <input type="text" placeholder="Cari pesanan..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: "8px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none", width: "220px" }} />
                </div>

                {isEmpty || filtered.length === 0 ? (
                    <div id="dashboard-empty-state">Tidak ada pesanan ditemukan</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>ID Pesanan</th><th>Pelanggan</th><th>Menu</th>
                                    <th>Total</th><th>Status</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <tr key={order.id} style={{ backgroundColor: editId === order.id ? "rgba(59,130,246,0.06)" : "transparent" }}>
                                        <td style={{ fontWeight: 700, color: "#ff6b35" }}>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.item}</td>
                                        <td>{order.total}</td>
                                        <td>
                                            <span style={{
                                                backgroundColor: (STATUS_COLORS[order.status] || "#666") + "22",
                                                color: STATUS_COLORS[order.status] || "#aaa",
                                                border: `1px solid ${(STATUS_COLORS[order.status] || "#666")}44`,
                                                padding: "3px 10px", borderRadius: "50px",
                                                fontSize: "11px", fontWeight: 700,
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button type="button" onClick={() => startEdit(order)}
                                                    style={actionBtn("#3b82f6")}>
                                                    ✏️ Perbarui
                                                </button>
                                                <button type="button" onClick={() => setConfirm(order.id)}
                                                    style={actionBtn("#ef4444")}>
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── CONFIRM DELETE MODAL ── */}
            {confirm && (
                <ConfirmModal
                    message={`Hapus pesanan ${confirm}?`}
                    onConfirm={() => { onDeleteOrder?.(confirm); setConfirm(null); }}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div>
    );
}

function actionBtn(color) {
    return {
        padding: "5px 12px", borderRadius: "6px", border: "none",
        backgroundColor: color + "18", color, fontWeight: 600,
        fontSize: "12px", cursor: "pointer",
    };
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <>
            <div onClick={onCancel} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 900 }} />
            <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                backgroundColor: "#1e1e2e", borderRadius: "14px", padding: "28px 32px",
                zIndex: 901, textAlign: "center", minWidth: "300px",
                border: "1px solid rgba(239,68,68,0.3)",
            }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
                <p style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: "0 0 20px" }}>{message}</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button type="button" onClick={onConfirm}
                        style={{ padding: "9px 24px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                        Ya, Hapus
                    </button>
                    <button type="button" onClick={onCancel}
                        style={{ padding: "9px 24px", backgroundColor: "#2d2d3d", color: "#aaa", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                        Batal
                    </button>
                </div>
            </div>
        </>
    );
}
