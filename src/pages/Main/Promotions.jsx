import { useState } from "react";
import { Link } from "react-router-dom";
import { promotionsData } from "../../data/promotions";

/**
 * Data awal promosi diambil dari file data terpusat
 */
const initialPromotions = promotionsData;

/**
 * getNextId - Menghasilkan ID 3 digit berikutnya
 */
function getNextId(items) {
    const maxId = items.reduce((maxValue, item) => {
        const numeric = Number(String(item.id).replace(/[^0-9]/g, ""));
        return numeric > maxValue ? numeric : maxValue;
    }, 0);
    return String(maxId + 1).padStart(3, "0");
}

/**
 * Promotions Component - Halaman untuk mengelola data promosi
 *
 * Fitur:
 * - Menampilkan daftar promosi dalam bentuk tabel
 * - Form untuk menambah promosi baru
 * - Search filtering berdasarkan kode atau deskripsi
 * - Hapus promosi yang sudah tidak diperlukan
 */
export default function Promotions() {
    const [promotions, setPromotions] = useState(initialPromotions);
    const [searchQuery, setSearchQuery] = useState("");
    const [promoForm, setPromoForm] = useState({
        code: "",
        description: "",
        discount: "",
        type: "Percentage",
        status: "Active",
        expiry: "",
    });

    /**
     * filteredPromotions - Filter promosi berdasarkan search query
     */
    const filteredPromotions = searchQuery.trim() === ""
        ? promotions
        : promotions.filter((promo) =>
            [promo.code, promo.description, promo.type, promo.status]
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );

    /**
     * getStatusClass - Menentukan style badge berdasarkan status promosi
     */
    function getStatusBadgeStyle(status) {
        return {
            backgroundColor: status === "Active" ? "#10b981" : "#6b7280",
            color: "white",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
        };
    }

    /**
     * getTypeBadgeStyle - Menentukan style badge berdasarkan tipe promosi
     */
    function getTypeBadgeStyle(type) {
        return {
            backgroundColor: type === "Percentage" ? "#3b82f6" : "#8b5cf6",
            color: "white",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
        };
    }

    /**
     * handleSubmitPromo - Menangani submit form promosi baru
     */
    function handleSubmitPromo(event) {
        event.preventDefault();

        if (!promoForm.code.trim() || !promoForm.description.trim() || !promoForm.discount.trim() || !promoForm.expiry) {
            alert("Silakan isi semua field yang wajib");
            return;
        }

        const newId = getNextId(promotions);
        setPromotions((current) => [
            {
                id: newId,
                code: promoForm.code.trim().toUpperCase(),
                description: promoForm.description.trim(),
                discount: promoForm.discount.trim(),
                type: promoForm.type,
                status: promoForm.status,
                expiry: promoForm.expiry,
            },
            ...current,
        ]);

        setPromoForm({
            code: "",
            description: "",
            discount: "",
            type: "Percentage",
            status: "Active",
            expiry: "",
        });
    }

    /**
     * handleDeletePromo - Menghapus promosi berdasarkan ID
     */
    function handleDeletePromo(id) {
        if (window.confirm("Hapus promosi ini?")) {
            setPromotions((current) => current.filter((promo) => promo.id !== id));
        }
    }

    const activeCount = promotions.filter((p) => p.status === "Active").length;
    const inactiveCount = promotions.filter((p) => p.status === "Inactive").length;

    return (
        <div id="dashboard-container">
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #10b981" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#10b981" }}>{promotions.length}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Total Promosi</div>
                </div>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #3b82f6" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#3b82f6" }}>{activeCount}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Promosi Aktif</div>
                </div>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #6b7280" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#6b7280" }}>{inactiveCount}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Promosi Nonaktif</div>
                </div>
            </div>

            <div className="panel-card">
                <div className="panel-title">Promotions</div>

                {/* Form tambah promosi */}
                <form className="quick-add-form" onSubmit={handleSubmitPromo} noValidate>
                    <input
                        type="text"
                        placeholder="Kode promo (contoh: DISKON10)"
                        aria-label="Kode promo"
                        value={promoForm.code}
                        onChange={(e) => setPromoForm((c) => ({ ...c, code: e.target.value }))}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Deskripsi promosi"
                        aria-label="Deskripsi"
                        value={promoForm.description}
                        onChange={(e) => setPromoForm((c) => ({ ...c, description: e.target.value }))}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nilai diskon (contoh: 10% atau Rp 20.000)"
                        aria-label="Nilai diskon"
                        value={promoForm.discount}
                        onChange={(e) => setPromoForm((c) => ({ ...c, discount: e.target.value }))}
                        required
                    />
                    <select
                        aria-label="Tipe diskon"
                        value={promoForm.type}
                        onChange={(e) => setPromoForm((c) => ({ ...c, type: e.target.value }))}
                    >
                        <option value="Percentage">Percentage</option>
                        <option value="Fixed">Fixed</option>
                    </select>
                    <select
                        aria-label="Status promosi"
                        value={promoForm.status}
                        onChange={(e) => setPromoForm((c) => ({ ...c, status: e.target.value }))}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <input
                        type="date"
                        aria-label="Tanggal kadaluarsa"
                        value={promoForm.expiry}
                        onChange={(e) => setPromoForm((c) => ({ ...c, expiry: e.target.value }))}
                        required
                    />
                    <button type="submit">Add Promo</button>
                </form>

                {/* Search bar */}
                <div style={{ marginBottom: "16px" }}>
                    <input
                        type="text"
                        placeholder="Cari kode promo atau deskripsi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #444",
                            backgroundColor: "#2d2d3d",
                            color: "#fff",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {/* Tabel promosi */}
                {filteredPromotions.length === 0 ? (
                    <div id="dashboard-empty-state">No promotions found</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#1e1e2e" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>ID</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Kode</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Deskripsi</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Diskon</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Tipe</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Kadaluarsa</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPromotions.map((promo, index) => (
                                    <tr
                                        key={promo.id}
                                        style={{
                                            borderBottom: "1px solid #333",
                                            backgroundColor: index % 2 === 0 ? "#1e1e2e" : "#232333",
                                        }}
                                    >
                                        <td style={{ padding: "12px" }}>{promo.id}</td>
                                        <td style={{ padding: "12px", fontWeight: 600, color: "#f59e0b" }}>
                                            <Link
                                                to={`/promotions/${promo.id}`}
                                                style={{ color: "#f59e0b", textDecoration: "none" }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                                                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                                            >
                                                {promo.code}
                                            </Link>
                                        </td>
                                        <td style={{ padding: "12px", maxWidth: "220px" }}>{promo.description}</td>
                                        <td style={{ padding: "12px", fontWeight: 600 }}>{promo.discount}</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={getTypeBadgeStyle(promo.type)}>{promo.type}</span>
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={getStatusBadgeStyle(promo.status)}>{promo.status}</span>
                                        </td>
                                        <td style={{ padding: "12px" }}>{promo.expiry}</td>
                                        <td style={{ padding: "12px", display: "flex", gap: "6px" }}>
                                            <Link
                                                to={`/promotions/${promo.id}`}
                                                style={{
                                                    backgroundColor: "#3b82f6",
                                                    color: "white",
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    textDecoration: "none",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Detail
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePromo(promo.id)}
                                                style={{
                                                    backgroundColor: "#ef4444",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ marginTop: "16px", fontSize: "14px", color: "#999" }}>
                    Menampilkan {filteredPromotions.length} dari {promotions.length} promosi
                </div>
            </div>
        </div>
    );
}
