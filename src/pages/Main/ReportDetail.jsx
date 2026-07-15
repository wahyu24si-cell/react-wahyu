import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { monthlySalesData, topProductsData } from "../../data/reports";

/**
 * formatRupiah - Memformat angka menjadi tampilan rupiah
 */
function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

/**
 * ReportDetail Component - Halaman detail laporan per bulan
 *
 * URL: /reports/:id
 * Contoh: /reports/0 → detail laporan Januari
 *
 * Menampilkan informasi lengkap laporan bulanan:
 * - Revenue, orders, delivered, canceled
 * - Success rate, avg order value, new customers
 * - Perbandingan dengan bulan sebelumnya
 * - Produk terlaris bulan tersebut
 * - Catatan operasional
 */
export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [prevReport, setPrevReport] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        setReport(null);
        setPrevReport(null);

        const found = monthlySalesData.find((item) => item.id === id);
        if (!found) {
            setError(`Laporan dengan ID "${id}" tidak ditemukan`);
            return;
        }

        setReport(found);

        // Ambil data bulan sebelumnya untuk perbandingan
        const currentIndex = monthlySalesData.indexOf(found);
        if (currentIndex > 0) {
            setPrevReport(monthlySalesData[currentIndex - 1]);
        }
    }, [id]);

    if (error) {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div className="panel-title">Laporan Tidak Ditemukan</div>
                    <div id="dashboard-empty-state" style={{ textAlign: "center", padding: "40px" }}>
                        <p style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</p>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/reports")}
                            style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", fontWeight: 600 }}
                        >
                            ← Kembali ke Laporan
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div id="dashboard-empty-state" style={{ textAlign: "center", padding: "40px" }}>
                        Memuat detail laporan...
                    </div>
                </div>
            </div>
        );
    }

    const successRate = report.orders > 0
        ? ((report.delivered / report.orders) * 100).toFixed(1)
        : "0.0";

    /**
     * getDiff - Menghitung selisih dan arah perubahan vs bulan sebelumnya
     */
    function getDiff(current, prev) {
        if (!prev) return null;
        const diff = current - prev;
        const pct = prev > 0 ? ((diff / prev) * 100).toFixed(1) : "0.0";
        return { diff, pct, up: diff >= 0 };
    }

    const revDiff = getDiff(report.revenue, prevReport?.revenue);
    const ordDiff = getDiff(report.orders, prevReport?.orders);
    const delDiff = getDiff(report.delivered, prevReport?.delivered);
    const canDiff = getDiff(report.canceled, prevReport?.canceled);

    return (
        <div id="dashboard-container">
            <div className="panel-card">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                        <div className="panel-title">Detail Laporan</div>
                        <div style={{ fontSize: "14px", color: "#aaa", marginTop: "4px" }}>{report.fullMonth}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {/* Navigasi ke bulan sebelumnya */}
                        {Number(id) > 0 && (
                            <button
                                type="button"
                                onClick={() => navigate(`/reports/${Number(id) - 1}`)}
                                style={{ padding: "8px 14px", cursor: "pointer", backgroundColor: "#374151", color: "white", border: "none", borderRadius: "4px", fontWeight: 500 }}
                            >
                                ← Sebelumnya
                            </button>
                        )}
                        {/* Navigasi ke bulan berikutnya */}
                        {Number(id) < monthlySalesData.length - 1 && (
                            <button
                                type="button"
                                onClick={() => navigate(`/reports/${Number(id) + 1}`)}
                                style={{ padding: "8px 14px", cursor: "pointer", backgroundColor: "#374151", color: "white", border: "none", borderRadius: "4px", fontWeight: 500 }}
                            >
                                Selanjutnya →
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate("/admin/reports")}
                            style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", fontWeight: 500 }}
                        >
                            ← Kembali ke Laporan
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                    <KpiCard
                        label="Pendapatan"
                        value={formatRupiah(report.revenue)}
                        color="#10b981"
                        diff={revDiff}
                        diffFormat={(d) => formatRupiah(Math.abs(d.diff))}
                    />
                    <KpiCard
                        label="Total Pesanan"
                        value={report.orders}
                        color="#3b82f6"
                        diff={ordDiff}
                        diffFormat={(d) => Math.abs(d.diff)}
                    />
                    <KpiCard
                        label="Terkirim"
                        value={report.delivered}
                        color="#8b5cf6"
                        diff={delDiff}
                        diffFormat={(d) => Math.abs(d.diff)}
                    />
                    <KpiCard
                        label="Dibatalkan"
                        value={report.canceled}
                        color="#ef4444"
                        diff={canDiff}
                        diffFormat={(d) => Math.abs(d.diff)}
                        invertColor
                    />
                </div>

                {/* Layout 2 kolom */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "28px" }}>

                    {/* Kolom Kiri */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                        {/* Statistik Detail */}
                        <div style={{ backgroundColor: "#2d2d3d", borderRadius: "8px", padding: "24px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "16px" }}>
                                Statistik Detail
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <StatItem label="Tingkat Keberhasilan" value={`${successRate}%`} color={Number(successRate) >= 90 ? "#10b981" : Number(successRate) >= 80 ? "#f59e0b" : "#ef4444"} />
                                <StatItem label="Rata-rata Nilai Pesanan" value={formatRupiah(report.avgOrderValue)} color="#3b82f6" />
                                <StatItem label="Pelanggan Baru" value={report.newCustomers} color="#8b5cf6" />
                                <StatItem label="Produk Terlaris" value={report.topProduct} color="#f59e0b" />
                            </div>
                        </div>

                        {/* Progress Bar Success Rate */}
                        <div style={{ backgroundColor: "#2d2d3d", borderRadius: "8px", padding: "24px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "16px" }}>
                                Tingkat Keberhasilan Pengiriman
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                                <span>Terkirim: {report.delivered}</span>
                                <span style={{ fontWeight: 700, color: Number(successRate) >= 90 ? "#10b981" : "#f59e0b" }}>{successRate}%</span>
                            </div>
                            <div style={{ backgroundColor: "#374151", borderRadius: "6px", height: "12px", overflow: "hidden" }}>
                                <div style={{
                                    width: `${successRate}%`,
                                    height: "100%",
                                    backgroundColor: Number(successRate) >= 90 ? "#10b981" : Number(successRate) >= 80 ? "#f59e0b" : "#ef4444",
                                    borderRadius: "6px",
                                }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#aaa" }}>
                                <span>Dibatalkan: {report.canceled}</span>
                                <span>Total: {report.orders}</span>
                            </div>
                        </div>

                        {/* Catatan Operasional */}
                        <div style={{ backgroundColor: "#2d2d3d", borderRadius: "8px", padding: "24px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "12px" }}>
                                Catatan Operasional
                            </div>
                            <p style={{ margin: 0, fontSize: "14px", color: "#ccc", lineHeight: "1.7" }}>
                                {report.notes}
                            </p>
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Perbandingan Bulan Sebelumnya */}
                        {prevReport && (
                            <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                                <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", fontWeight: 600 }}>
                                    vs {prevReport.month}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <CompareRow label="Pendapatan" current={formatRupiah(report.revenue)} diff={revDiff} />
                                    <CompareRow label="Pesanan" current={report.orders} diff={ordDiff} />
                                    <CompareRow label="Terkirim" current={report.delivered} diff={delDiff} />
                                    <CompareRow label="Dibatalkan" current={report.canceled} diff={canDiff} invertColor />
                                </div>
                            </div>
                        )}

                        {/* Top 3 Produk Terlaris */}
                        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", fontWeight: 600 }}>
                                Top Produk (Tahunan)
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {topProductsData.slice(0, 3).map((p) => (
                                    <div key={p.rank} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{
                                            backgroundColor: p.rank === 1 ? "#f59e0b" : p.rank === 2 ? "#9ca3af" : "#b45309",
                                            color: "white", width: "24px", height: "24px", borderRadius: "50%",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "12px", fontWeight: 700, flexShrink: 0,
                                        }}>
                                            {p.rank}
                                        </span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                            <div style={{ fontSize: "11px", color: "#aaa" }}>{p.sold} terjual</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigasi Bulan */}
                        <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px" }}>
                            <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", fontWeight: 600 }}>
                                Navigasi Bulan
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {monthlySalesData.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => navigate(`/reports/${m.id}`)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "4px",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            fontSize: "13px",
                                            fontWeight: m.id === id ? 700 : 400,
                                            backgroundColor: m.id === id ? "#10b981" : "transparent",
                                            color: m.id === id ? "white" : "#ccc",
                                        }}
                                    >
                                        {m.fullMonth}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** KPI Card dengan indikator perubahan vs bulan sebelumnya */
function KpiCard({ label, value, color, diff, diffFormat, invertColor }) {
    return (
        <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: `4px solid ${color}` }}>
            <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>{label}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color }}>{value}</div>
            {diff && (
                <div style={{
                    fontSize: "12px",
                    marginTop: "6px",
                    color: invertColor
                        ? (diff.up ? "#ef4444" : "#10b981")
                        : (diff.up ? "#10b981" : "#ef4444"),
                }}>
                    {diff.up ? "▲" : "▼"} {diffFormat(diff)} ({diff.up ? "+" : ""}{diff.pct}%)
                </div>
            )}
        </div>
    );
}

/** Stat item untuk grid statistik */
function StatItem({ label, value, color }) {
    return (
        <div>
            <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: color || "inherit" }}>{value}</div>
        </div>
    );
}

/** Baris perbandingan dengan bulan sebelumnya */
function CompareRow({ label, current, diff, invertColor }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
            <span style={{ color: "#aaa" }}>{label}</span>
            <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{current}</div>
                {diff && (
                    <div style={{
                        fontSize: "11px",
                        color: invertColor
                            ? (diff.up ? "#ef4444" : "#10b981")
                            : (diff.up ? "#10b981" : "#ef4444"),
                    }}>
                        {diff.up ? "▲" : "▼"} {diff.pct}%
                    </div>
                )}
            </div>
        </div>
    );
}
