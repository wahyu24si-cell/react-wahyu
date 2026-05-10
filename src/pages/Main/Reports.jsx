import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
 * Reports Component - Halaman laporan dan analitik bisnis
 *
 * Fitur:
 * - Ringkasan statistik tahunan
 * - Tabel laporan penjualan per bulan
 * - Daftar produk terlaris
 * - Filter berdasarkan bulan
 */
export default function Reports() {
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [activeTab, setActiveTab] = useState("monthly"); // "monthly" | "products"

    /**
     * filteredData - Data yang difilter berdasarkan bulan yang dipilih
     */
    const filteredData = useMemo(() => {
        if (selectedMonth === "all") return monthlySalesData;
        return monthlySalesData.filter((_, index) => String(index) === selectedMonth);
    }, [selectedMonth]);

    /**
     * summary - Ringkasan total dari data yang difilter
     */
    const summary = useMemo(() => {
        return filteredData.reduce(
            (acc, row) => ({
                revenue: acc.revenue + row.revenue,
                orders: acc.orders + row.orders,
                delivered: acc.delivered + row.delivered,
                canceled: acc.canceled + row.canceled,
            }),
            { revenue: 0, orders: 0, delivered: 0, canceled: 0 }
        );
    }, [filteredData]);

    /**
     * maxRevenue - Nilai revenue tertinggi untuk skala bar chart
     */
    const maxRevenue = Math.max(...monthlySalesData.map((d) => d.revenue));

    return (
        <div id="dashboard-container">
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #10b981" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#10b981" }}>{formatRupiah(summary.revenue)}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Total Revenue</div>
                </div>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #3b82f6" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#3b82f6" }}>{summary.orders}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Total Orders</div>
                </div>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #8b5cf6" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#8b5cf6" }}>{summary.delivered}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Total Delivered</div>
                </div>
                <div style={{ backgroundColor: "#1e1e2e", borderRadius: "8px", padding: "20px", borderLeft: "4px solid #ef4444" }}>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#ef4444" }}>{summary.canceled}</div>
                    <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Total Canceled</div>
                </div>
            </div>

            {/* Bar Chart Revenue */}
            <div className="panel-card" style={{ marginBottom: "24px" }}>
                <div className="panel-title">Revenue per Bulan</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px", padding: "8px 0" }}>
                    {monthlySalesData.map((data) => (
                        <div key={data.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            <div
                                title={formatRupiah(data.revenue)}
                                style={{
                                    width: "100%",
                                    height: `${(data.revenue / maxRevenue) * 130}px`,
                                    backgroundColor: "#10b981",
                                    borderRadius: "4px 4px 0 0",
                                    transition: "opacity 0.2s",
                                    cursor: "pointer",
                                    opacity: selectedMonth === "all" || String(monthlySalesData.indexOf(data)) === selectedMonth ? 1 : 0.3,
                                }}
                            />
                            <span style={{ fontSize: "11px", color: "#aaa" }}>{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="panel-card">
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab("monthly")}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: "13px",
                                backgroundColor: activeTab === "monthly" ? "#10b981" : "#2d2d3d",
                                color: activeTab === "monthly" ? "white" : "#aaa",
                            }}
                        >
                            Laporan Bulanan
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("products")}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: "13px",
                                backgroundColor: activeTab === "products" ? "#10b981" : "#2d2d3d",
                                color: activeTab === "products" ? "white" : "#aaa",
                            }}
                        >
                            Produk Terlaris
                        </button>
                    </div>

                    {/* Filter bulan (hanya tampil di tab monthly) */}
                    {activeTab === "monthly" && (
                        <select
                            aria-label="Filter bulan"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "4px",
                                border: "1px solid #444",
                                backgroundColor: "#2d2d3d",
                                color: "#fff",
                                fontSize: "13px",
                                cursor: "pointer",
                            }}
                        >
                            <option value="all">Semua Bulan</option>
                            {monthlySalesData.map((data, index) => (
                                <option key={data.month} value={String(index)}>{data.month}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Tab: Laporan Bulanan */}
                {activeTab === "monthly" && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#1e1e2e" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Bulan</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Revenue</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Orders</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Delivered</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Canceled</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Success Rate</th>
                                    <th style={{ padding: "12px", textAlign: "center", fontWeight: 600 }}>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, index) => {
                                    const successRate = row.orders > 0
                                        ? ((row.delivered / row.orders) * 100).toFixed(1)
                                        : "0.0";
                                    return (
                                        <tr
                                            key={row.month}
                                            style={{
                                                borderBottom: "1px solid #333",
                                                backgroundColor: index % 2 === 0 ? "#1e1e2e" : "#232333",
                                            }}
                                        >
                                            <td style={{ padding: "12px", fontWeight: 600 }}>{row.month}</td>
                                            <td style={{ padding: "12px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>
                                                {formatRupiah(row.revenue)}
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "right" }}>{row.orders}</td>
                                            <td style={{ padding: "12px", textAlign: "right", color: "#3b82f6" }}>{row.delivered}</td>
                                            <td style={{ padding: "12px", textAlign: "right", color: "#ef4444" }}>{row.canceled}</td>
                                            <td style={{ padding: "12px", textAlign: "right" }}>
                                                <span style={{
                                                    backgroundColor: Number(successRate) >= 90 ? "#10b981" : Number(successRate) >= 80 ? "#f59e0b" : "#ef4444",
                                                    color: "white",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                }}>
                                                    {successRate}%
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <Link
                                                    to={`/reports/${row.id}`}
                                                    style={{
                                                        backgroundColor: "#3b82f6",
                                                        color: "white",
                                                        padding: "5px 12px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        textDecoration: "none",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {/* Total row */}
                            <tfoot>
                                <tr style={{ backgroundColor: "#2d2d3d", borderTop: "2px solid #444" }}>
                                    <td style={{ padding: "12px", fontWeight: 700 }}>TOTAL</td>
                                    <td style={{ padding: "12px", textAlign: "right", color: "#10b981", fontWeight: 700 }}>
                                        {formatRupiah(summary.revenue)}
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 700 }}>{summary.orders}</td>
                                    <td style={{ padding: "12px", textAlign: "right", color: "#3b82f6", fontWeight: 700 }}>{summary.delivered}</td>
                                    <td style={{ padding: "12px", textAlign: "right", color: "#ef4444", fontWeight: 700 }}>{summary.canceled}</td>
                                    <td style={{ padding: "12px", textAlign: "right" }}>
                                        <span style={{
                                            backgroundColor: "#10b981",
                                            color: "white",
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                        }}>
                                            {summary.orders > 0 ? ((summary.delivered / summary.orders) * 100).toFixed(1) : "0.0"}%
                                        </span>
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Tab: Produk Terlaris */}
                {activeTab === "products" && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#1e1e2e" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d", borderBottom: "2px solid #444" }}>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Rank</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Produk</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Kategori</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Terjual</th>
                                    <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProductsData.map((product, index) => (
                                    <tr
                                        key={product.rank}
                                        style={{
                                            borderBottom: "1px solid #333",
                                            backgroundColor: index % 2 === 0 ? "#1e1e2e" : "#232333",
                                        }}
                                    >
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                backgroundColor: product.rank === 1 ? "#f59e0b" : product.rank === 2 ? "#9ca3af" : product.rank === 3 ? "#b45309" : "#374151",
                                                color: "white",
                                                padding: "4px 10px",
                                                borderRadius: "50%",
                                                fontSize: "13px",
                                                fontWeight: 700,
                                            }}>
                                                {product.rank}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px", fontWeight: 600 }}>{product.name}</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{product.sold}</td>
                                        <td style={{ padding: "12px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>
                                            {formatRupiah(product.revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
