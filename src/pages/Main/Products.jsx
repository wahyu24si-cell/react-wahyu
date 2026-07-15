import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productsData from "../../data/products.json";

const formatRp = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

const EMPTY_FORM = { title: "", code: "", category: "", brand: "", price: "", stock: "" };

/**
 * Products — Admin CRUD: Create, Read, Update, Delete
 */
export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm]         = useState(EMPTY_FORM);
    const [editId, setEditId]     = useState(null);
    const [search, setSearch]     = useState("");
    const [confirm, setConfirm]   = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { setProducts(productsData); }, []);

    const filtered = search.trim()
        ? products.filter(p => [p.title, p.category, p.brand, p.code].join(" ").toLowerCase().includes(search.toLowerCase()))
        : products;

    function getNextId() {
        const max = products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
        return String(max + 1).padStart(3, "0");
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.category.trim() || !form.price) {
            alert("Isi minimal nama, kategori, dan harga"); return;
        }
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock || 0) };

        if (editId) {
            setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...payload } : p));
            setEditId(null);
        } else {
            setProducts(prev => [{ id: getNextId(), ...payload }, ...prev]);
        }
        setForm(EMPTY_FORM);
        setShowForm(false);
    }

    function startEdit(product) {
        setEditId(product.id);
        setForm({ title: product.title, code: product.code || "", category: product.category, brand: product.brand || "", price: String(product.price), stock: String(product.stock) });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDelete(id) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setConfirm(null);
    }

    return (
        <div id="dashboard-container">

            {/* ── HEADER + TOGGLE FORM ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff" }}>🛍️ Manajemen Produk</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#777" }}>{products.length} produk terdaftar</p>
                </div>
                <button type="button" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM); }}
                    style={{ padding: "9px 20px", backgroundColor: showForm ? "#374151" : "#ff6b35", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    {showForm ? "✕ Tutup Form" : "➕ Tambah Produk"}
                </button>
            </div>

            {/* ── FORM CREATE / EDIT ── */}
            {showForm && (
                <div className="panel-card" style={{ marginBottom: "20px" }}>
                    <div className="panel-title">{editId ? "✏️ Perbarui Produk" : "➕ Produk Baru"}</div>
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "14px" }}>
                            {[
                                { key: "title",    label: "Nama Produk *", type: "text",   placeholder: "Ayam Bakar Spesial" },
                                { key: "code",     label: "Kode Produk",   type: "text",   placeholder: "PRD-001" },
                                { key: "category", label: "Kategori *",    type: "text",   placeholder: "Makanan" },
                                { key: "brand",    label: "Brand",         type: "text",   placeholder: "Gacor" },
                                { key: "price",    label: "Harga *",       type: "number", placeholder: "45000" },
                                { key: "stock",    label: "Stok",          type: "number", placeholder: "50" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: "block", fontSize: "11px", color: "#888", marginBottom: "5px", fontWeight: 600, textTransform: "uppercase" }}>
                                        {f.label}
                                    </label>
                                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        style={{ width: "100%", padding: "9px 12px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" style={{ padding: "10px 24px", backgroundColor: editId ? "#3b82f6" : "#ff6b35", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                                {editId ? "Perbarui Produk" : "Simpan Produk"}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                                style={{ padding: "10px 20px", backgroundColor: "#374151", color: "#aaa", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── TABLE ── */}
            <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                    <div className="panel-title" style={{ margin: 0 }}>Daftar Produk ({filtered.length})</div>
                    <input type="text" placeholder="Cari produk..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: "8px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "13px", outline: "none", width: "220px" }} />
                </div>

                {filtered.length === 0 ? (
                    <div id="dashboard-empty-state">Tidak ada produk ditemukan</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    {["ID", "Nama", "Kode", "Kategori", "Brand", "Harga", "Stok", "Aksi"].map(h => (
                                        <th key={h} style={{ padding: "11px 12px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid #2d2d3d", backgroundColor: editId === p.id ? "rgba(59,130,246,0.06)" : i % 2 === 0 ? "#1e1e2e" : "#222232" }}>
                                        <td style={{ padding: "11px 12px", fontWeight: 700, color: "#ff6b35" }}>{p.id}</td>
                                        <td style={{ padding: "11px 12px" }}>
                                            <Link to={`/admin/products/${p.id}`} style={{ color: "#10b981", textDecoration: "none", fontWeight: 500 }}
                                                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                                                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                                                {p.title}
                                            </Link>
                                        </td>
                                        <td style={{ padding: "11px 12px", fontFamily: "monospace", fontSize: "12px" }}>{p.code}</td>
                                        <td style={{ padding: "11px 12px" }}>
                                            <span style={{ backgroundColor: "#3b82f620", color: "#3b82f6", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{p.category}</span>
                                        </td>
                                        <td style={{ padding: "11px 12px", color: "#aaa" }}>{p.brand}</td>
                                        <td style={{ padding: "11px 12px", fontWeight: 700, color: "#10b981" }}>{formatRp(p.price)}</td>
                                        <td style={{ padding: "11px 12px" }}>
                                            <span style={{ backgroundColor: p.stock > 20 ? "#10b98120" : "#f59e0b20", color: p.stock > 20 ? "#10b981" : "#f59e0b", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td style={{ padding: "11px 12px" }}>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button type="button" onClick={() => startEdit(p)} style={actionBtn("#3b82f6")}>✏️</button>
                                                <button type="button" onClick={() => setConfirm(p.id)} style={actionBtn("#ef4444")}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
                    Menampilkan {filtered.length} dari {products.length} produk
                </div>
            </div>

            {confirm && (
                <ConfirmModal
                    message="Hapus produk ini secara permanen?"
                    onConfirm={() => handleDelete(confirm)}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div>
    );
}

function actionBtn(color) {
    return { padding: "5px 10px", borderRadius: "6px", border: "none", backgroundColor: color + "18", color, fontWeight: 600, fontSize: "13px", cursor: "pointer" };
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
