import { useState } from "react";

const PACKAGES = [
    {
        id: "silver",
        name: "Paket Silver",
        price: 25000,
        priceLabel: "/ porsi",
        minPax: 20,
        color: "#9ca3af",
        icon: "🥈",
        popular: false,
        features: [
            "Min. 20 porsi",
            "Menu standar (10 pilihan)",
            "Peralatan makan basic",
            "Pengiriman area Bandung",
            "1 crew serving",
            "Free air mineral",
        ],
        notIncluded: ["Dekorasi meja", "Chef on-site", "Menu premium"],
    },
    {
        id: "gold",
        name: "Paket Gold",
        price: 45000,
        priceLabel: "/ porsi",
        minPax: 50,
        color: "#f59e0b",
        icon: "🥇",
        popular: true,
        features: [
            "Min. 50 porsi",
            "Menu premium (20 pilihan)",
            "Peralatan makan lengkap",
            "Pengiriman se-Jawa Barat",
            "3 crew serving",
            "Free minuman pilihan",
            "Dekorasi meja standar",
            "1 Chef on-site",
        ],
        notIncluded: ["Dekorasi premium", "Live cooking station"],
    },
    {
        id: "platinum",
        name: "Paket Platinum",
        price: 75000,
        priceLabel: "/ porsi",
        minPax: 100,
        color: "#8b5cf6",
        icon: "💎",
        popular: false,
        features: [
            "Min. 100 porsi",
            "Menu eksklusif (35+ pilihan)",
            "Peralatan premium & elegant",
            "Pengiriman seluruh Indonesia",
            "5+ crew serving",
            "Free bar minuman lengkap",
            "Dekorasi meja premium",
            "2 Chef on-site",
            "Live cooking station",
            "Dokumentasi foto",
        ],
        notIncluded: [],
    },
    {
        id: "wedding",
        name: "Paket Wedding",
        price: null,
        priceLabel: "Custom",
        minPax: null,
        color: "#ff6b35",
        icon: "💍",
        popular: false,
        features: [
            "Porsi sesuai kebutuhan",
            "Menu kustom pilihan",
            "Full setup & decoration",
            "Nationwide delivery",
            "Full crew profesional",
            "Koordinator acara dedicated",
            "Free food tasting",
            "Konsultasi menu gratis",
            "Dokumentasi lengkap",
            "Garansi kepuasan 100%",
        ],
        notIncluded: [],
    },
];

const formatRp = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

export default function MemberPackages() {
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", date: "", pax: "", notes: "" });
    const [submitted, setSubmitted] = useState(false);

    function handleBook(pkg) {
        setSelected(pkg);
        setShowForm(true);
        setSubmitted(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.phone || !form.date || !form.pax) {
            alert("Lengkapi semua field yang wajib!"); return;
        }
        setSubmitted(true);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Paket cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
                {PACKAGES.map((pkg) => (
                    <div key={pkg.id} style={{
                        backgroundColor: "#1e1e2e", borderRadius: "16px",
                        border: `2px solid ${pkg.popular ? pkg.color : "rgba(255,255,255,0.06)"}`,
                        overflow: "hidden", position: "relative",
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>

                        {pkg.popular && (
                            <div style={{ backgroundColor: pkg.color, color: "white", textAlign: "center", padding: "6px", fontSize: "12px", fontWeight: 700 }}>
                                ⭐ PALING POPULER
                            </div>
                        )}

                        <div style={{ padding: "24px" }}>
                            {/* Header */}
                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                <div style={{ fontSize: "40px", marginBottom: "8px" }}>{pkg.icon}</div>
                                <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 800, color: "#fff" }}>{pkg.name}</h3>
                                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
                                    {pkg.price ? (
                                        <>
                                            <span style={{ fontSize: "28px", fontWeight: 800, color: pkg.color }}>{formatRp(pkg.price)}</span>
                                            <span style={{ fontSize: "13px", color: "#888" }}>{pkg.priceLabel}</span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: "22px", fontWeight: 800, color: pkg.color }}>Custom</span>
                                    )}
                                </div>
                                {pkg.minPax && (
                                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Min. {pkg.minPax} orang</div>
                                )}
                            </div>

                            {/* Features */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                                {pkg.features.map((f) => (
                                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#ccc" }}>
                                        <span style={{ color: pkg.color, flexShrink: 0 }}>✓</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                                {pkg.notIncluded.map((f) => (
                                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555" }}>
                                        <span style={{ flexShrink: 0 }}>✗</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleBook(pkg)}
                                style={{
                                    width: "100%", padding: "12px", border: "none",
                                    borderRadius: "10px", fontWeight: 700, fontSize: "14px",
                                    cursor: "pointer", transition: "background 0.2s",
                                    backgroundColor: pkg.popular ? pkg.color : "transparent",
                                    color: pkg.popular ? "white" : pkg.color,
                                    border: `2px solid ${pkg.color}`,
                                }}>
                                Pesan Sekarang →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking form */}
            {showForm && selected && (
                <div className="panel-card">
                    {submitted ? (
                        <div style={{ textAlign: "center", padding: "32px" }}>
                            <div style={{ fontSize: "56px", marginBottom: "12px" }}>🎉</div>
                            <h3 style={{ color: "#10b981", margin: "0 0 8px", fontSize: "20px", fontWeight: 800 }}>Booking Terkirim!</h3>
                            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 20px" }}>
                                Tim kami akan menghubungi kamu dalam 1×24 jam untuk konfirmasi <strong style={{ color: "#ff6b35" }}>{selected.name}</strong>.
                            </p>
                            <button type="button" onClick={() => { setShowForm(false); setSubmitted(false); }}
                                style={{ backgroundColor: "#ff6b35", color: "white", border: "none", padding: "10px 28px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
                                Tutup
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="panel-title">📋 Form Pemesanan — {selected.name}</div>
                            <form onSubmit={handleSubmit} noValidate>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                                    {[
                                        { label: "Nama Pemesan *",  key: "name",  type: "text",   placeholder: "Nama lengkap" },
                                        { label: "Nomor WhatsApp *", key: "phone", type: "tel",    placeholder: "08xx-xxxx-xxxx" },
                                        { label: "Tanggal Acara *", key: "date",  type: "date",   placeholder: "" },
                                        { label: `Jumlah Pax *${selected.minPax ? ` (min. ${selected.minPax})` : ""}`, key: "pax", type: "number", placeholder: selected.minPax || "Jumlah orang" },
                                    ].map((f) => (
                                        <div key={f.key}>
                                            <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px", fontWeight: 600 }}>{f.label}</label>
                                            <input type={f.type} value={form[f.key]} onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                                placeholder={f.placeholder}
                                                style={{ width: "100%", padding: "10px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px", fontWeight: 600 }}>Catatan Tambahan</label>
                                    <textarea value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
                                        placeholder="Lokasi acara, permintaan khusus, dll..."
                                        rows={3}
                                        style={{ width: "100%", padding: "10px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button type="submit"
                                        style={{ flex: 1, padding: "12px", backgroundColor: "#ff6b35", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                                        Kirim Pemesanan →
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)}
                                        style={{ padding: "12px 20px", backgroundColor: "transparent", color: "#888", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
