import { useState } from "react";
import { Link } from "react-router-dom";
import { promotionsData } from "../../data/promotions";

const EMPTY_FORM = { code: "", description: "", discount: "", type: "Percentage", status: "Active", expiry: "" };

function getNextId(items) {
    const maxId = items.reduce((m, item) => Math.max(m, Number(String(item.id).replace(/[^0-9]/g, "")) || 0), 0);
    return String(maxId + 1).padStart(3, "0");
}

/**
 * Promotions — Admin CRUD: Create, Read, Update, Delete
 */
export default function Promotions() {
    const [promotions, setPromotions] = useState(promotionsData);
    const [searchQuery, setSearchQuery] = useState("");
    const [promoForm, setPromoForm]     = useState(EMPTY_FORM);
    const [editId, setEditId]           = useState(null);
    const [confirm, setConfirm]         = useState(null);

    const filtered = searchQuery.trim() === ""
        ? promotions
        : promotions.filter((p) =>
            [p.code, p.description, p.type, p.status].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        );

    const badgeType   = (t) => ({ backgroundColor: t === "Percentage" ? "#3b82f6" : "#8b5cf6", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 });
    const badgeStatus = (s) => ({ backgroundColor: s === "Active" ? "#10b981" : "#6b7280", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 });

    function handleSubmit(e) {
        e.preventDefault();
        if (!promoForm.code.trim() || !promoForm.description.trim() || !promoForm.discount.trim() || !promoForm.expiry) {
            alert("Isi semua field yang wajib"); return;
        }
        if (editId) {
            setPromotions((prev) => prev.map((p) =>
                p.id === editId ? { ...p, ...promoForm, code: promoForm.code.trim().toUpperCase() } : p
            ));
            setEditId(null);
        } else {
            setPromotions((prev) => [{ id: getNextId(prev), ...promoForm, code: promoForm.code.trim().toUpperCase() }, ...prev]);
        }
        setPromoForm(EMPTY_FORM);
    }

    function startEdit(promo) {
        setEditId(promo.id);
        setPromoForm({ code: promo.code, description: promo.description, discount: promo.discount, type: promo.type, status: promo.status, expiry: promo.expiry });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDelete(id) { setPromotions((prev) => prev.filter((p) => p.id !== id)); setConfirm(null); }

    const activeCount   = promotions.filter((p) => p.status === "Active").length;
    const inactiveCount = promotions.filter((p) => p.status === "Inactive").length;

    return (
        <div id="dashboard-container">
            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {[
                    { label: "Total Promosi",    value: promotions.length, color: "#10b981" },
                    { label: "Promosi Aktif",    value: activeCount,       color: "#3b82f6" },
                    { label: "Promosi Nonaktif", value: inactiveCount,     color: "#6b7280" },
                ].map((s) => (
                    <div key={s.label} style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "18px 20px", borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ fontSize: "26px", fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Form CREATE / EDIT */}
            <div className="panel-card" style={{ marginBottom: "20px" }}>
                <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{editId ? "✏️ Perbarui Promosi" : "➕ Tambah Promosi"}</span>
                    {editId && (
                        <button type="button" onClick={() => { setEditId(null); setPromoForm(EMPTY_FORM); }}
                            style={{ fontSize: "12px", color: "#888", background: "none", border: "1px solid #444", padding: "4px 12px", borderRadius: "6px", cursor: "pointer" }}>
                            Batal
                        </button>
                    )}
                </div>
                <form className="quick-add-form" onSubmit={handleSubmit} noValidate>
                    <input type="text" placeholder="Kode promo" value={promoForm.code} onChange={(e) => setPromoForm((c) => ({ ...c, code: e.target.value }))} required />
                    <input type="text" placeholder="Deskripsi" value={promoForm.description} onChange={(e) => setPromoForm((c) => ({ ...c, description: e.target.value }))} required />
                    <input type="text" placeholder="Nilai diskon (10% / Rp 20.000)" value={promoForm.discount} onChange={(e) => setPromoForm((c) => ({ ...c, discount: e.target.value }))} required />
                    <select value={promoForm.type} onChange={(e) => setPromoForm((c) => ({ ...c, type: e.target.value }))}>
                        <option value="Percentage">Persentase</option>
                        <option value="Fixed">Tetap</option>
                    </select>
                    <select value={promoForm.status} onChange={(e) => setPromoForm((c) => ({ ...c, status: e.target.value }))}>
                        <option value="Active">Aktif</option>
                        <option value="Inactive">Nonaktif</option>
                    </select>
                    <input type="date" value={promoForm.expiry} onChange={(e) => setPromoForm((c) => ({ ...c, expiry: e.target.value }))} required />
                    <button type="submit" style={{ backgroundColor: editId ? "#3b82f6" : "#ff6b35" }}>
                        {editId ? "Perbarui" : "Tambah"}
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                    <div className="panel-title" style={{ margin: 0 }}>Daftar Promosi ({filtered.length})</div>
                    <input type="text" placeholder="Cari promo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: "8px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none", width: "220px" }} />
                </div>

                {filtered.length === 0 ? (
                    <div id="dashboard-empty-state">Tidak ada promosi ditemukan</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    {["ID", "Kode", "Deskripsi", "Diskon", "Tipe", "Status", "Kadaluarsa", "Aksi"].map((h) => (
                                        <th key={h} style={{ padding: "11px 12px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#aaa" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((promo, i) => (
                                    <tr key={promo.id} style={{ borderBottom: "1px solid #333", backgroundColor: editId === promo.id ? "rgba(59,130,246,0.06)" : i % 2 === 0 ? "#1e1e2e" : "#232333" }}>
                                        <td style={{ padding: "11px 12px", fontSize: "12px" }}>{promo.id}</td>
                                        <td style={{ padding: "11px 12px", fontWeight: 700 }}>
                                            <Link to={`/admin/promotions/${promo.id}`} style={{ color: "#f59e0b", textDecoration: "none" }}>{promo.code}</Link>
                                        </td>
                                        <td style={{ padding: "11px 12px", fontSize: "12px", maxWidth: "200px" }}>{promo.description}</td>
                                        <td style={{ padding: "11px 12px", fontWeight: 600 }}>{promo.discount}</td>
                                        <td style={{ padding: "11px 12px" }}><span style={badgeType(promo.type)}>{promo.type}</span></td>
                                        <td style={{ padding: "11px 12px" }}><span style={badgeStatus(promo.status)}>{promo.status}</span></td>
                                        <td style={{ padding: "11px 12px", fontSize: "12px" }}>{promo.expiry}</td>
                                        <td style={{ padding: "11px 12px" }}>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                <Link to={`/admin/promotions/${promo.id}`} style={actionBtn("#3b82f6", true)}>Detail</Link>
                                                <button type="button" onClick={() => startEdit(promo)} style={actionBtn("#f59e0b")}>✏️ Perbarui</button>
                                                <button type="button" onClick={() => setConfirm(promo.id)} style={actionBtn("#ef4444")}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
                    Menampilkan {filtered.length} dari {promotions.length} promosi
                </div>
            </div>

            {confirm && <ConfirmModal message="Hapus promosi ini?" onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
        </div>
    );
}

function actionBtn(color, isLink = false) {
    return { padding: "5px 10px", borderRadius: "6px", border: "none", backgroundColor: color + "20", color, fontWeight: 600, fontSize: "12px", cursor: "pointer", ...(isLink ? { textDecoration: "none" } : {}) };
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
