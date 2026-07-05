import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function MemberProfil() {
    const { user } = useAuth();

    const displayName =
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "Member";

    const [form, setForm] = useState({
        fullName: displayName,
        phone: "",
        city: "",
        birthDate: "",
    });
    const [saved, setSaved] = useState(false);
    const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });
    const [pwMsg, setPwMsg] = useState(null);

    function handleSave(e) {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    function handlePw(e) {
        e.preventDefault();
        if (pwForm.newPw.length < 6) { setPwMsg({ type: "error", text: "Password minimal 6 karakter" }); return; }
        if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: "error", text: "Password tidak cocok" }); return; }
        setPwMsg({ type: "success", text: "Password berhasil diperbarui!" });
        setPwForm({ newPw: "", confirm: "" });
        setTimeout(() => setPwMsg(null), 3000);
    }

    const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Header */}
            <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, color: "#fff" }}>👤 Profil Saya</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>Kelola informasi akun dan keamanan</p>
            </div>

            {/* Avatar + info singkat */}
            <div style={{
                backgroundColor: "#13131f", borderRadius: "14px", padding: "24px",
                display: "flex", alignItems: "center", gap: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
            }}>
                <div style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    backgroundColor: "#ff6b35", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", fontWeight: 800, flexShrink: 0,
                    border: "3px solid rgba(255,107,53,0.3)",
                }}>
                    {initials}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{displayName}</div>
                    <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{user?.email}</div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.12)", padding: "3px 10px", borderRadius: "50px" }}>
                            🥇 Gold Member
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#888", backgroundColor: "#1e1e2e", padding: "3px 10px", borderRadius: "50px" }}>
                            840 poin
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* Edit profil */}
                <div style={{ backgroundColor: "#13131f", borderRadius: "14px", padding: "22px" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: "#fff" }}>✏️ Edit Informasi</h3>
                    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            { label: "Nama Lengkap", key: "fullName",  type: "text",  placeholder: "Nama kamu" },
                            { label: "Nomor HP",      key: "phone",     type: "tel",   placeholder: "08xx-xxxx" },
                            { label: "Kota",          key: "city",      type: "text",  placeholder: "Bandung" },
                            { label: "Tanggal Lahir", key: "birthDate", type: "date",  placeholder: "" },
                        ].map((f) => (
                            <div key={f.key}>
                                <label style={{ display: "block", fontSize: "11px", color: "#888", marginBottom: "5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    {f.label}
                                </label>
                                <input
                                    type={f.type} value={form[f.key]}
                                    onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    style={inputStyle}
                                />
                            </div>
                        ))}

                        {/* Email readonly */}
                        <div>
                            <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Email (tidak bisa diubah)
                            </label>
                            <input type="email" value={user?.email || ""} disabled
                                style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }} />
                        </div>

                        <button type="submit" style={{
                            padding: "10px", backgroundColor: saved ? "#10b981" : "#ff6b35",
                            color: "#fff", border: "none", borderRadius: "8px",
                            fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "background 0.2s",
                        }}>
                            {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
                        </button>
                    </form>
                </div>

                {/* Ganti password */}
                <div style={{ backgroundColor: "#13131f", borderRadius: "14px", padding: "22px" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: "#fff" }}>🔒 Ganti Password</h3>
                    <form onSubmit={handlePw} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                            <label style={labelStyle}>Password Baru</label>
                            <input type="password" value={pwForm.newPw}
                                onChange={(e) => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                                placeholder="Min. 6 karakter" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Konfirmasi Password</label>
                            <input type="password" value={pwForm.confirm}
                                onChange={(e) => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                                placeholder="Ulangi password" style={inputStyle} />
                        </div>

                        {pwMsg && (
                            <div style={{
                                padding: "10px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                                backgroundColor: pwMsg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                color: pwMsg.type === "success" ? "#10b981" : "#ef4444",
                            }}>
                                {pwMsg.text}
                            </div>
                        )}

                        <button type="submit" style={{
                            padding: "10px", backgroundColor: "#ff6b35",
                            color: "#fff", border: "none", borderRadius: "8px",
                            fontWeight: 700, fontSize: "14px", cursor: "pointer",
                        }}>
                            Perbarui Password
                        </button>
                    </form>

                    {/* Notifikasi toggle sederhana */}
                    <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
                            🔔 Notifikasi
                        </div>
                        {[
                            { label: "Update status pesanan", default: true },
                            { label: "Promo & diskon",        default: true },
                            { label: "Newsletter",            default: false },
                        ].map((n) => (
                            <NotifRow key={n.label} label={n.label} defaultOn={n.default} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotifRow({ label, defaultOn }) {
    const [on, setOn] = useState(defaultOn);
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
            <span style={{ fontSize: "13px", color: "#bbb" }}>{label}</span>
            <div onClick={() => setOn(v => !v)} style={{
                width: "40px", height: "22px", borderRadius: "11px",
                backgroundColor: on ? "#ff6b35" : "#374151",
                position: "relative", cursor: "pointer", transition: "background 0.2s",
            }}>
                <div style={{
                    position: "absolute", top: "3px", left: on ? "21px" : "3px",
                    width: "16px", height: "16px", borderRadius: "50%",
                    backgroundColor: "#fff", transition: "left 0.2s",
                }} />
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%", padding: "9px 12px",
    backgroundColor: "#1e1e2e", color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
};

const labelStyle = {
    display: "block", fontSize: "11px", color: "#888",
    marginBottom: "5px", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.5px",
};
