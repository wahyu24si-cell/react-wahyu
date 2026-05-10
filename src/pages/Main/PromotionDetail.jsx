import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { promotionsData } from "../../data/promotions";

/**
 * PromotionDetail Component - Halaman detail untuk satu promosi
 *
 * URL: /promotions/:id
 * Contoh: /promotions/001 → detail promosi GACOR10
 *
 * Menampilkan informasi lengkap promosi:
 * - Kode, deskripsi, tipe, status, tanggal kadaluarsa
 * - Statistik penggunaan (used / max)
 * - Syarat & ketentuan
 */
export default function PromotionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [promo, setPromo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setPromo(null);

        const found = promotionsData.find((item) => item.id === id);
        if (!found) {
            setError(`Promosi dengan ID "${id}" tidak ditemukan`);
            return;
        }
        setPromo(found);
    }, [id]);

    if (error) {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div className="panel-title">Promotion Not Found</div>
                    <div id="dashboard-empty-state" style={{ textAlign: "center", padding: "40px" }}>
                        <p style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</p>
                        <button
                            type="button"
                            onClick={() => navigate("/promotions")}
                            style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", fontWeight: 600 }}
                        >
                            ← Back to Promotions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!promo) {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div id="dashboard-empty-state" style={{ textAlign: "center", padding: "40px" }}>
                        Loading promotion details...
                    </div>
                </div>
            </div>
        );
    }

    const usagePercent = promo.maxUse > 0 ? Math.round((promo.usedCount / promo.maxUse) * 100) : 0;
    const isExpired = new Date(promo.expiry) < new Date();
    const daysLeft = Math.ceil((new Date(promo.expiry) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "12px" }}>
                    <div className="panel-title">Promotion Detail</div>
                    <button
                        type="button"
                        onClick={() => navigate("/promotions")}
                        style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", fontWeight: 500 }}
                    >
                        ← Back to Promotions
                    </button>
                </div>

                {/* Layout 2 kolom */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

                    {/* Kolom Kiri */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        {/* Kode Promo Banner */}
                        <div style={{
                            backgroundColor: "#2d2d3d",
                            borderRadius: "12px",
                            padding: "32px",
                            textAlign: "center",
                            border: "2px dashed #f59e0b",
                        }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                                Kode Promo
                            </div>
                            <div style={{ fontSize: "40px", fontWeight: 800, color: "#f59e0b", letterSpacing: "4px", fontFamily: "monospace" }}>
                                {promo.code}
                            </div>
                            <div style={{ marginTop: "12px", fontSize: "14px", color: "#ccc" }}>
                                {promo.description}
                            </div>
                        </div>

                        {/* Info Fields */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <InfoField label="ID Promosi" value={promo.id} />
                            <InfoField label="Nilai Diskon" value={promo.discount} valueColor="#10b981" />
                            <InfoField label="Tipe Diskon" value={
                                <span style={{
                                    backgroundColor: promo.type === "Percentage" ? "#3b82f6" : "#8b5cf6",
                                    color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px",
                                }}>
                                    {promo.type}
                                </span>
                            } />
                            <InfoField label="Status" value={
                                <span style={{
                                    backgroundColor: promo.status === "Active" ? "#10b981" : "#6b7280",
                                    color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "13px",
                                }}>
                                    {promo.status}
                                </span>
                            } />
                            <InfoField label="Minimum Order" value={promo.minOrder} />
                            <InfoField label="Tanggal Dibuat" value={promo.createdAt} />
                        </div>

                        {/* Syarat & Ketentuan */}
                        <div style={{ backgroundColor: "#2d2d3d", borderRadius: "8px", padding: "20px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontWeight: 600 }}>
                                Syarat & Ketentuan
                            </div>
                            <p style={{ margin: 0, fontSize: "14px", color: "#ccc", lineHeight: "1.7" }}>
                                {promo.terms}
                            </p>
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Card Kadaluarsa */}
                        <div style={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderRadius: "8px",
                            padding: "20px",
                            border: `2px solid ${isExpired ? "#ef4444" : daysLeft <= 7 ? "#f59e0b" : "#10b981"}`,
                        }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Kadaluarsa
                            </div>
                            <div style={{ fontSize: "20px", fontWeight: 700, marginTop: "10px", color: isExpired ? "#ef4444" : daysLeft <= 7 ? "#f59e0b" : "#10b981" }}>
                                {promo.expiry}
                            </div>
                            <div style={{ fontSize: "13px", color: "#bbb", marginTop: "6px" }}>
                                {isExpired
                                    ? "Promosi sudah kadaluarsa"
                                    : daysLeft === 0
                                        ? "Kadaluarsa hari ini"
                                        : `${daysLeft} hari lagi`}
                            </div>
                        </div>

                        {/* Card Penggunaan */}
                        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                                Penggunaan
                            </div>
                            <div style={{ fontSize: "24px", fontWeight: 700, color: "#3b82f6" }}>
                                {promo.usedCount} <span style={{ fontSize: "14px", color: "#aaa", fontWeight: 400 }}>/ {promo.maxUse}</span>
                            </div>
                            {/* Progress bar */}
                            <div style={{ marginTop: "12px", backgroundColor: "#374151", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                                <div style={{
                                    width: `${usagePercent}%`,
                                    height: "100%",
                                    backgroundColor: usagePercent >= 90 ? "#ef4444" : usagePercent >= 70 ? "#f59e0b" : "#3b82f6",
                                    borderRadius: "4px",
                                    transition: "width 0.3s",
                                }} />
                            </div>
                            <div style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>
                                {usagePercent}% terpakai
                            </div>
                        </div>

                        {/* Card Sisa Kuota */}
                        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Sisa Kuota
                            </div>
                            <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "10px", color: (promo.maxUse - promo.usedCount) === 0 ? "#ef4444" : "#10b981" }}>
                                {promo.maxUse - promo.usedCount}
                            </div>
                            <div style={{ fontSize: "13px", color: "#bbb", marginTop: "4px" }}>
                                dari {promo.maxUse} total kuota
                            </div>
                        </div>

                        {/* Card Ringkasan */}
                        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                                Ringkasan
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <SummaryRow label="Kode" value={promo.code} />
                                <SummaryRow label="Tipe" value={promo.type} />
                                <SummaryRow label="Min. Order" value={promo.minOrder} />
                                <SummaryRow label="Dibuat" value={promo.createdAt} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Helper: Field info dengan label dan value */
function InfoField({ label, value, valueColor }) {
    return (
        <div>
            <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "6px" }}>
                {label}
            </div>
            <div style={{ fontSize: "15px", fontWeight: 500, color: valueColor || "inherit" }}>
                {value}
            </div>
        </div>
    );
}

/** Helper: Baris ringkasan key-value */
function SummaryRow({ label, value }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: "#aaa" }}>{label}:</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </div>
    );
}
