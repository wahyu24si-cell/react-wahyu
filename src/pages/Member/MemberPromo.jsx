import { useState } from "react";

const MY_PROMOS = [
    { code: "MEMBER15",  desc: "Diskon 15% untuk semua menu",          type: "Persentase", value: "15%",      expiry: "30 Jun 2026", used: false },
    { code: "FREESHIP",  desc: "Gratis ongkir untuk 1x order",         type: "Ongkir",     value: "Gratis",   expiry: "Hari ini",    used: false },
    { code: "BDAY20",    desc: "Diskon 20% khusus ulang tahun",        type: "Persentase", value: "20%",      expiry: "31 Des 2026", used: false },
    { code: "GOLD10K",   desc: "Potongan Rp 10.000 tier Gold",         type: "Nominal",    value: "Rp 10.000",expiry: "31 Jul 2026", used: false },
    { code: "NEWUSER",   desc: "Diskon pendaftaran member baru",        type: "Persentase", value: "10%",      expiry: "1 Jan 2026",  used: true },
];

const TYPE_COLOR = { Persentase: "#3b82f6", Ongkir: "#10b981", Nominal: "#f59e0b" };

export default function MemberPromo() {
    const [code, setCode] = useState("");
    const [redeemed, setRedeemed] = useState([]);
    const [msg, setMsg] = useState(null);

    function handleRedeem(e) {
        e.preventDefault();
        const upper = code.trim().toUpperCase();
        if (!upper) return;
        if (MY_PROMOS.find(p => p.code === upper)) {
            setMsg({ type: "error", text: "Kode promo ini sudah ada di akunmu." });
        } else {
            setRedeemed(prev => [...prev, upper]);
            setMsg({ type: "success", text: `Kode "${upper}" berhasil ditambahkan!` });
        }
        setCode("");
        setTimeout(() => setMsg(null), 3000);
    }

    const activeList  = MY_PROMOS.filter(p => !p.used);
    const usedList    = MY_PROMOS.filter(p => p.used);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Header */}
            <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, color: "#fff" }}>🏷️ Promo & Voucher</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                    {activeList.length} promo aktif · {usedList.length} sudah digunakan
                </p>
            </div>

            {/* Input kode promo */}
            <div style={{ backgroundColor: "#13131f", borderRadius: "14px", padding: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
                    🎁 Punya kode promo?
                </div>
                <form onSubmit={handleRedeem} style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode promo..."
                        style={{
                            flex: 1, padding: "10px 14px", backgroundColor: "#1e1e2e",
                            color: "#fff", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px", fontSize: "14px", outline: "none",
                            fontFamily: "monospace", letterSpacing: "1px",
                        }}
                    />
                    <button type="submit" style={{
                        padding: "10px 20px", backgroundColor: "#ff6b35", color: "#fff",
                        border: "none", borderRadius: "8px", fontWeight: 700,
                        fontSize: "13px", cursor: "pointer",
                    }}>
                        Tukar
                    </button>
                </form>
                {msg && (
                    <div style={{
                        marginTop: "10px", padding: "10px 14px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: 600,
                        backgroundColor: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        color: msg.type === "success" ? "#10b981" : "#ef4444",
                        border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                    }}>
                        {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
                    </div>
                )}
            </div>

            {/* Promo aktif */}
            <div>
                <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Promo Aktif ({activeList.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeList.map((p) => (
                        <PromoCard key={p.code} promo={p} />
                    ))}
                    {/* Newly redeemed */}
                    {redeemed.map((c) => (
                        <div key={c} style={{
                            padding: "16px", backgroundColor: "#13131f", borderRadius: "12px",
                            border: "1px dashed rgba(16,185,129,0.4)",
                        }}>
                            <div style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 800, color: "#10b981", letterSpacing: "2px" }}>{c}</div>
                            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Baru ditambahkan</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Promo sudah dipakai */}
            {usedList.length > 0 && (
                <div>
                    <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Sudah Digunakan ({usedList.length})
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {usedList.map((p) => (
                            <PromoCard key={p.code} promo={p} dimmed />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function PromoCard({ promo, dimmed }) {
    const typeColor = TYPE_COLOR[promo.type] || "#666";
    return (
        <div style={{
            padding: "16px 18px", backgroundColor: "#13131f", borderRadius: "12px",
            border: dimmed ? "1px solid rgba(255,255,255,0.04)" : "1px dashed rgba(255,107,53,0.25)",
            display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
            opacity: dimmed ? 0.5 : 1,
        }}>
            {/* Code */}
            <div style={{ minWidth: "110px" }}>
                <div style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 800, color: dimmed ? "#555" : "#f59e0b", letterSpacing: "1px" }}>
                    {promo.code}
                </div>
                <span style={{
                    fontSize: "10px", fontWeight: 700, color: typeColor,
                    backgroundColor: typeColor + "18", padding: "1px 6px", borderRadius: "4px",
                }}>
                    {promo.type}
                </span>
            </div>

            <div style={{ flex: 1, minWidth: "140px" }}>
                <div style={{ fontSize: "13px", color: dimmed ? "#666" : "#ddd" }}>{promo.desc}</div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Berlaku s/d: {promo.expiry}</div>
            </div>

            <div style={{ fontSize: "18px", fontWeight: 800, color: dimmed ? "#555" : "#ff6b35" }}>
                {promo.value}
            </div>

            {dimmed && (
                <span style={{ fontSize: "11px", color: "#555", backgroundColor: "#1e1e2e", padding: "3px 8px", borderRadius: "50px", fontWeight: 600 }}>
                    Terpakai
                </span>
            )}
        </div>
    );
}
