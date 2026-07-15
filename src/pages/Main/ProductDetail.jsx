import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import productsData from "../../data/products.json";

/**
 * ProductDetail Component - Halaman untuk menampilkan detail produk tertentu
 * 
 * Menggunakan Dynamic Route dengan parameter :id
 * URL: /products/:id
 * Contoh: /products/001 → detail produk dengan id 001
 * 
 * Mengambil data produk dari JSON berdasarkan ID yang diterima dari URL parameter
 * Menampilkan informasi lengkap: gambar, judul, kategori, brand, harga, stok
 * 
 * @returns {JSX.Element} Halaman detail produk atau pesan error jika produk tidak ditemukan
 */
export default function ProductDetail() {
    // Mengambil parameter id dari URL menggunakan useParams()
    const { id } = useParams();
    // Hook untuk navigasi ke halaman lain
    const navigate = useNavigate();
    // State untuk menyimpan data produk yang ditemukan
    const [product, setProduct] = useState(null);
    // State untuk menyimpan pesan error jika terjadi masalah
    const [error, setError] = useState(null);

    /**
     * useEffect - Mencari dan memuat data produk berdasarkan ID
     * Dijalankan setiap kali parameter id berubah
     * Mencari produk di array productsData dengan id yang sesuai
     */
    useEffect(() => {
        // Reset state sebelum mencari ulang produk baru
        setError(null);
        setProduct(null);

        const foundProduct = productsData.find((item) => item.id === id);

        if (!foundProduct) {
            setError(`Produk dengan ID "${id}" tidak ditemukan`);
            return;
        }

        setProduct(foundProduct);
    }, [id]);

    /**
     * formatRupiah - Mengubah angka menjadi format Rupiah Indonesia
     * Contoh: 45000 → "Rp 45.000"
     * @param {number} amount - Jumlah dalam bentuk angka
     * @returns {string} Angka yang sudah diformat dengan Rp
     */
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    /**
     * getStockStatus - Menentukan status stok produk
     * Mengembalikan status dan warna berdasarkan jumlah stok
     * @param {number} stock - Jumlah stok produk
     * @returns {object} Objek dengan status dan warna
     */
    const getStockStatus = (stock) => {
        if (stock > 50) {
            return { label: "Stok Melimpah", color: "#10b981" };
        } else if (stock > 20) {
            return { label: "Stok Tersedia", color: "#3b82f6" };
        } else if (stock > 0) {
            return { label: "Stok Terbatas", color: "#f59e0b" };
        } else {
            return { label: "Stok Habis", color: "#ef4444" };
        }
    };

    // Jika terjadi error, tampilkan pesan error
    if (error) {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div className="panel-title">Produk Tidak Ditemukan</div>
                    <div id="dashboard-empty-state" style={{ textAlign: "center", padding: "40px" }}>
                        <p style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</p>
                        <button 
                            onClick={() => navigate("/admin/products")}
                            style={{
                                padding: "10px 20px",
                                cursor: "pointer",
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: 600,
                            }}
                        >
                            ← Kembali ke Produk
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Jika data masih dimuat (loading), tampilkan pesan loading
    if (!product) {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div id="dashboard-empty-state" style={{ textAlign: "center", padding: "40px" }}>
                        Memuat detail produk...
                    </div>
                </div>
            </div>
        );
    }

    // Mendapatkan status stok dan warnanya
    const stockStatus = getStockStatus(product.stock);

    // Render detail produk
    return (
        <div id="dashboard-container">
            <div className="panel-card">
                {/* Header dengan tombol kembali */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div className="panel-title">Detail Produk</div>
                    <button 
                        onClick={() => navigate("/admin/products")}
                        style={{
                            padding: "8px 16px",
                            cursor: "pointer",
                            backgroundColor: "#6b7280",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#4b5563"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#6b7280"}
                    >
                        ← Kembali ke Produk
                    </button>
                </div>

                {/* Layout: 2 kolom - kiri info utama, kanan spesifikasi */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "2fr 1fr", 
                    gap: "40px",
                    padding: "30px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px"
                }}>
                    {/* Kolom Kiri: Informasi Produk Utama */}
                    <div>
                        {/* Placeholder gambar produk */}
                        <div style={{
                            width: "100%",
                            height: "300px",
                            backgroundColor: "#2d2d3d",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "30px",
                            border: "2px dashed #444",
                            fontSize: "14px",
                            color: "#999",
                        }}>
                            Tidak Ada Gambar
                        </div>

                        {/* Nama dan Judul Produk */}
                        <h2 style={{ margin: "0 0 15px 0", fontSize: "28px", fontWeight: 700 }}>
                            {product.title}
                        </h2>

                        {/* Daftar spesifikasi produk */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {/* ID Produk */}
                            <div>
                                <label style={{ fontWeight: 600, color: "#999", fontSize: "12px", textTransform: "uppercase" }}>
                                    ID Produk
                                </label>
                                <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>{product.id}</p>
                            </div>

                            {/* Kode Produk */}
                            <div>
                                <label style={{ fontWeight: 600, color: "#999", fontSize: "12px", textTransform: "uppercase" }}>
                                    Kode Produk
                                </label>
                                <p style={{ margin: "8px 0 0 0", fontSize: "16px", fontFamily: "monospace" }}>
                                    {product.code}
                                </p>
                            </div>

                            {/* Kategori Produk */}
                            <div>
                                <label style={{ fontWeight: 600, color: "#999", fontSize: "12px", textTransform: "uppercase" }}>
                                    Kategori
                                </label>
                                <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>
                                    <span style={{
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        padding: "4px 12px",
                                        borderRadius: "4px",
                                        display: "inline-block",
                                    }}>
                                        {product.category}
                                    </span>
                                </p>
                            </div>

                            {/* Brand Produk */}
                            <div>
                                <label style={{ fontWeight: 600, color: "#999", fontSize: "12px", textTransform: "uppercase" }}>
                                    Merek
                                </label>
                                <p style={{ margin: "8px 0 0 0", fontSize: "16px", fontWeight: 500 }}>
                                    {product.brand}
                                </p>
                            </div>

                            {/* Harga Produk */}
                            <div>
                                <label style={{ fontWeight: 600, color: "#999", fontSize: "12px", textTransform: "uppercase" }}>
                                    Harga
                                </label>
                                <p style={{ 
                                    margin: "8px 0 0 0", 
                                    fontSize: "24px", 
                                    fontWeight: 700,
                                    color: "#10b981"
                                }}>
                                    {formatRupiah(product.price)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Ringkasan Informasi Stok dan Spesifikasi */}
                    <div style={{ 
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}>
                        {/* Card Stok */}
                        <div style={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.08)", 
                            padding: "20px", 
                            borderRadius: "8px",
                            border: `2px solid ${stockStatus.color}`,
                        }}>
                            <p style={{ margin: 0, color: "#999", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Status Stok
                            </p>
                            <p style={{ margin: "12px 0 0 0", fontSize: "20px", fontWeight: 600, color: stockStatus.color }}>
                                {product.stock} Unit
                            </p>
                            <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#bbb" }}>
                                {stockStatus.label}
                            </p>
                        </div>

                        {/* Card Ringkasan Harga */}
                        <div style={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.08)", 
                            padding: "20px", 
                            borderRadius: "8px",
                        }}>
                            <p style={{ margin: 0, color: "#999", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Harga Satuan
                            </p>
                            <p style={{ margin: "12px 0 0 0", fontSize: "20px", fontWeight: 700, color: "#10b981" }}>
                                {formatRupiah(product.price)}
                            </p>
                        </div>

                        {/* Card Info Tambahan */}
                        <div style={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.08)", 
                            padding: "20px", 
                            borderRadius: "8px",
                        }}>
                            <p style={{ margin: 0, color: "#999", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Detail Produk
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#999" }}>Merek:</span>
                                    <span style={{ fontWeight: 500 }}>{product.brand}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#999" }}>Kategori:</span>
                                    <span style={{ fontWeight: 500 }}>{product.category}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#999" }}>Kode:</span>
                                    <span style={{ fontWeight: 500, fontFamily: "monospace" }}>{product.code}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
