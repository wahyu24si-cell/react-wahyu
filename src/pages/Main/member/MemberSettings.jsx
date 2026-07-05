import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function MemberSettings({ user, onLogout }) {
    const { resetPassword } = useAuth();

    const [profileForm, setProfileForm] = useState({
        fullName: user?.user_metadata?.full_name || "",
        phone: "",
        city: "",
        birthDate: "",
    });

    const [notif, setNotif] = useState({
        orderUpdate: true,
        promoEmail: true,
        newsletter: false,
        sms: false,
    });

    const [pwForm, setPwForm]     = useState({ current: "", newPw: "", confirm: "" });
    const [pwSuccess, setPwSuccess] = useState("");
    const [pwError, setPwError]   = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [savedProfile, setSavedProfile] = useState(false);

    function handleProfileSave(e) {
        e.preventDefault();
        setSavedProfile(true);
        setTimeout(() => setSavedProfile(false), 2500);
    }

    async function handleResetPassword() {
        if (!user?.email) return;
        const { error } = await resetPassword(user.email);
        if (error) { setPwError(error.message); }
        else { setResetSent(true); }
    }

    function handlePwSubmit(e) {
        e.preventDefault();
        setPwError(""); setPwSuccess("");
        if (pwForm.newPw.length < 6) { setPwError("Password baru minimal 6 karakter"); return; }
        if (pwForm.newPw !== pwForm.confirm) { setPwError("Konfirmasi password tidak cocok"); return; }
        // Simulasi — di production pakai supabase.auth.updateUser
        setPwSuccess("Password berhasil diperbarui!");
        setPwForm({ current: "", newPw: "", confirm: "" });
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── Edit Profil ── */}
            <div className="panel-card">
                <div className="panel-title">👤 Edit Profil</div>
                <form onSubmit={handleProfileSave} noValidate>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        {[
                            { label: "Nama Lengkap", key: "fullName", type: "text",  placeholder: "Nama kamu" },
                            { label: "Nomor HP",      key: "phone",    type: "tel",   placeholder: "08xx-xxxx-xxxx" },
                            { label: "Kota",          key: "city",     type: "text",  placeholder: "Bandung" },
                            { label: "Tanggal Lahir", key: "birthDate",type: "date",  placeholder: "" },
                        ].map((f) => (
                            <div key={f.key}>
                                <label style={labelStyle}>{f.label}</label>
                                <input type={f.type} value={profileForm[f.key]}
                                    onChange={(e) => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder} style={inputStyle} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={labelStyle}>Email (tidak bisa diubah)</label>
                        <input type="email" value={user?.email || ""} disabled
                            style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
                    </div>
                    <button type="submit" style={btnPrimary}>
                        {savedProfile ? "✓ Tersimpan!" : "Simpan Perubahan"}
                    </button>
                </form>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                {/* ── Ganti Password ── */}
                <div className="panel-card">
                    <div className="panel-title">🔒 Keamanan Akun</div>

                    {resetSent ? (
                        <div style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "14px", marginBottom: "16px", fontSize: "13px", color: "#10b981" }}>
                            📧 Link reset password telah dikirim ke <strong>{user?.email}</strong>
                        </div>
                    ) : (
                        <button type="button" onClick={handleResetPassword}
                            style={{ ...btnSecondary, marginBottom: "20px" }}>
                            📧 Kirim Link Reset Password
                        </button>
                    )}

                    {pwError && <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", fontSize: "13px", color: "#ef4444" }}>{pwError}</div>}
                    {pwSuccess && <div style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", fontSize: "13px", color: "#10b981" }}>{pwSuccess}</div>}

                    <form onSubmit={handlePwSubmit} noValidate>
                        {[
                            { label: "Password Saat Ini", key: "current",  placeholder: "••••••••" },
                            { label: "Password Baru",      key: "newPw",    placeholder: "Min. 6 karakter" },
                            { label: "Konfirmasi Baru",    key: "confirm",  placeholder: "Ulangi password baru" },
                        ].map((f) => (
                            <div key={f.key} style={{ marginBottom: "14px" }}>
                                <label style={labelStyle}>{f.label}</label>
                                <input type="password" value={pwForm[f.key]}
                                    onChange={(e) => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder} style={inputStyle} />
                            </div>
                        ))}
                        <button type="submit" style={btnPrimary}>Perbarui Password</button>
                    </form>
                </div>

                {/* ── Notifikasi ── */}
                <div className="panel-card">
                    <div className="panel-title">🔔 Pengaturan Notifikasi</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {[
                            { key: "orderUpdate", label: "Update Status Order",    desc: "Notifikasi saat status pesanan berubah" },
                            { key: "promoEmail",  label: "Email Promo",            desc: "Penawaran dan diskon eksklusif member" },
                            { key: "newsletter",  label: "Newsletter",             desc: "Berita dan update terbaru dari Gacor" },
                            { key: "sms",         label: "Notifikasi SMS",         desc: "Pengingat via SMS untuk order penting" },
                        ].map((n) => (
                            <label key={n.key} style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", padding: "12px", backgroundColor: "#2d2d3d", borderRadius: "10px" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{n.label}</div>
                                    <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{n.desc}</div>
                                </div>
                                {/* Toggle switch */}
                                <div
                                    onClick={() => setNotif(p => ({ ...p, [n.key]: !p[n.key] }))}
                                    style={{
                                        width: "44px", height: "24px", borderRadius: "12px", flexShrink: 0,
                                        backgroundColor: notif[n.key] ? "#ff6b35" : "#374151",
                                        position: "relative", cursor: "pointer", transition: "background 0.2s",
                                    }}>
                                    <div style={{
                                        position: "absolute", top: "3px",
                                        left: notif[n.key] ? "23px" : "3px",
                                        width: "18px", height: "18px", borderRadius: "50%",
                                        backgroundColor: "white", transition: "left 0.2s",
                                    }} />
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Danger zone */}
                    <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "rgba(239,68,68,0.06)", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "8px" }}>⚠️ Danger Zone</div>
                        <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px" }}>
                            Logout dari semua perangkat atau hapus akun secara permanen.
                        </p>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button type="button" onClick={onLogout}
                                style={{ flex: 1, padding: "8px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
                                🚪 Logout
                            </button>
                            <button type="button" onClick={() => alert("Fitur hapus akun dalam pengembangan")}
                                style={{ flex: 1, padding: "8px", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
                                🗑️ Hapus Akun
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: "#aaa", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 14px", backgroundColor: "#2d2d3d", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" };
const btnPrimary = { padding: "11px 24px", backgroundColor: "#ff6b35", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer" };
const btnSecondary = { width: "100%", padding: "10px", backgroundColor: "transparent", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer" };
