import { useState } from "react";

const TIER_COLORS = { Platinum: "#8b5cf6", Gold: "#f59e0b", Silver: "#9ca3af", Bronze: "#b45309" };

/**
 * Customers — Admin CRUD: Create, Read, Update, Delete
 */
export default function Customers({ customers, onAddCustomer, onEditCustomer, onDeleteCustomer, isEmpty }) {
    const [form, setForm]       = useState({ name: "", email: "", city: "", totalOrder: "", tier: "Bronze" });
    const [editId, setEditId]   = useState(null);
    const [search, setSearch]   = useState("");
    const [confirm, setConfirm] = useState(null);

    const filtered = search.trim()
        ? customers.filter(c => [c.name, c.email, c.city, c.tier].join(" ").toLowerCase().includes(search.toLowerCase()))
        : customers;

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.city.trim()) {
            alert("Isi nama, email, dan kota"); return;
        }
        if (editId) {
            onEditCustomer?.({ ...form, id: editId, totalOrder: Number(form.totalOrder || 0) });
            setEditId(null);
        } else {
            onAddCustomer(form);
        }
        setForm({ name: "", email: "", city: "", totalOrder: "", tier: "Bronze" });
    }

    function startEdit(c) {
        setEditId(c.id);
        setForm({ name: c.name, email: c.email, city: c.city, totalOrder: String(c.totalOrder), tier: c.tier });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div id="dashboard-container">
            {/* ── FORM ── */}
            <div className="panel-card" style={{ marginBottom: "20px" }}>
                <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{editId ? "✏️ Perbarui Pelanggan" : "➕ Tambah Pelanggan"}</span>
                    {editId && (
                        <button type="button" onClick={() => { setEditId(null); setForm({ name: "", email: "", city: "", totalOrder: "", tier: "Bronze" }); }}
                            style={{ fontSize: "12px", color: "#888", background: "none", border: "1px solid #444", padding: "4px 12px", borderRadius: "6px", cursor: "pointer" }}>
                            Batal Perbarui
                        </button>
                    )}
                </div>
                <form className="quick-add-form" onSubmit={handleSubmit} noValidate>
                    <input type="text" placeholder="Nama pelanggan" value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    <input type="email" placeholder="Email" value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                    <input type="text" placeholder="Kota" value={form.city}
                        onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required />
                    <input type="number" min="0" placeholder="Total pesanan" value={form.totalOrder}
                        onChange={e => setForm(p => ({ ...p, totalOrder: e.target.value }))} />
                    <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}>
                        <option value="Bronze">Perunggu</option>
                        <option value="Silver">Perak</option>
                        <option value="Gold">Emas</option>
                        <option value="Platinum">Platinum</option>
                    </select>
                    <button type="submit" style={{ backgroundColor: editId ? "#3b82f6" : "#ff6b35" }}>
                        {editId ? "Perbarui" : "Tambah"}
                    </button>
                </form>
            </div>

            {/* ── TABLE ── */}
            <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                    <div className="panel-title" style={{ margin: 0 }}>Daftar Pelanggan ({filtered.length})</div>
                    <input type="text" placeholder="Cari pelanggan..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: "8px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none", width: "220px" }} />
                </div>

                {isEmpty || filtered.length === 0 ? (
                    <div id="dashboard-empty-state">Tidak ada customer ditemukan</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>ID</th><th>Nama</th><th>Email</th>
                                    <th>Kota</th><th>Total Order</th><th>Tier</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id} style={{ backgroundColor: editId === c.id ? "rgba(59,130,246,0.06)" : "transparent" }}>
                                        <td style={{ fontWeight: 700, color: "#ff6b35" }}>{c.id}</td>
                                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                                        <td style={{ color: "#aaa", fontSize: "12px" }}>{c.email}</td>
                                        <td>{c.city}</td>
                                        <td style={{ textAlign: "center" }}>{c.totalOrder}</td>
                                        <td>
                                            <span style={{
                                                backgroundColor: (TIER_COLORS[c.tier] || "#666") + "20",
                                                color: TIER_COLORS[c.tier] || "#aaa",
                                                padding: "3px 10px", borderRadius: "50px",
                                                fontSize: "11px", fontWeight: 700,
                                            }}>
                                                {c.tier}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button type="button" onClick={() => startEdit(c)} style={actionBtn("#3b82f6")}>✏️ Perbarui</button>
                                                <button type="button" onClick={() => setConfirm(c.id)} style={actionBtn("#ef4444")}>🗑️ Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {confirm && (
                <ConfirmModal
                    message={`Hapus customer ini?`}
                    onConfirm={() => { onDeleteCustomer?.(confirm); setConfirm(null); }}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div>
    );
}

function actionBtn(color) {
    return { padding: "5px 12px", borderRadius: "6px", border: "none", backgroundColor: color + "18", color, fontWeight: 600, fontSize: "12px", cursor: "pointer" };
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <>
            <div onClick={onCancel} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 900 }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", backgroundColor: "#1e1e2e", borderRadius: "14px", padding: "28px 32px", zIndex: 901, textAlign: "center", minWidth: "300px", border: "1px solid rgba(239,68,68,0.3)" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
                <p style={{ color: "#fff", fontSize: "15px", fontWeight: 600, margin: "0 0 20px" }}>{message}</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button type="button" onClick={onConfirm} style={{ padding: "9px 24px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>Ya, Hapus</button>
                    <button type="button" onClick={onCancel} style={{ padding: "9px 24px", backgroundColor: "#2d2d3d", color: "#aaa", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                </div>
            </div>
        </>
    );
}
