import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

/**
 * AdminDebug — Halaman diagnosa masalah role dan koneksi Supabase.
 * Akses: /admin/debug
 * Hapus setelah production.
 */
export default function AdminDebug() {
    const { user, role, profile, loading } = useAuth();
    const [dbProfile, setDbProfile]   = useState(null);
    const [dbError, setDbError]       = useState(null);
    const [allProfiles, setAllProfiles] = useState([]);
    const [checking, setChecking]     = useState(false);

    async function checkDatabase() {
        setChecking(true);
        setDbError(null);

        // 1. Cek profile user ini
        const { data: p, error: e } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user?.id)
            .single();

        setDbProfile(p);
        setDbError(e?.message ?? null);

        // 2. Cek semua profiles (hanya berhasil kalau RLS mengizinkan)
        const { data: all } = await supabase
            .from("profiles")
            .select("id, full_name, role, tier, points")
            .limit(20);

        setAllProfiles(all ?? []);
        setChecking(false);
    }

    async function fixAdminRole() {
        if (!user?.id) return;
        const { error } = await supabase
            .from("profiles")
            .update({ role: "admin", full_name: user.email?.split("@")[0] || "Admin" })
            .eq("id", user.id);

        if (error) {
            alert("Gagal update role: " + error.message);
        } else {
            alert("✅ Role berhasil di-set ke admin! Silakan logout lalu login ulang.");
            checkDatabase();
        }
    }

    useEffect(() => {
        if (user?.id) checkDatabase();
    }, [user?.id]);

    const row = (label, value, color) => (
        <div key={label} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ minWidth: "180px", fontSize: "12px", color: "#888", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: "13px", color: color || "#fff", fontFamily: "monospace", wordBreak: "break-all" }}>
                {value === null ? <em style={{ color: "#ef4444" }}>null</em> : String(value)}
            </span>
        </div>
    );

    return (
        <div id="dashboard-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "14px 18px" }}>
                <div style={{ fontSize: "13px", color: "#ef4444", fontWeight: 700, marginBottom: "4px" }}>⚠️ Halaman Debug</div>
                <div style={{ fontSize: "12px", color: "#888" }}>Halaman ini hanya untuk diagnosa. Hapus route /admin/debug setelah selesai.</div>
            </div>

            {/* Auth Context State */}
            <div className="panel-card">
                <div className="panel-title">🔑 Auth Context (dari React state)</div>
                {loading ? (
                    <div style={{ color: "#888" }}>Loading...</div>
                ) : (
                    <div>
                        {row("user.id",    user?.id,    "#3b82f6")}
                        {row("user.email", user?.email, "#3b82f6")}
                        {row("role (context)", role, role === "admin" ? "#10b981" : "#ef4444")}
                        {row("profile.role",   profile?.role, profile?.role === "admin" ? "#10b981" : "#ef4444")}
                        {row("profile.full_name", profile?.full_name)}
                        {row("isAdmin", String(role === "admin"), role === "admin" ? "#10b981" : "#ef4444")}
                    </div>
                )}
            </div>

            {/* Direct DB Query */}
            <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div className="panel-title" style={{ margin: 0 }}>🗄️ Database Query Langsung</div>
                    <button type="button" onClick={checkDatabase} disabled={checking}
                        style={{ padding: "7px 16px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
                        {checking ? "Checking..." : "Refresh"}
                    </button>
                </div>

                {dbError ? (
                    <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#ef4444" }}>
                        ❌ Error: {dbError}
                        <br />
                        <small style={{ color: "#888", marginTop: "6px", display: "block" }}>
                            Kemungkinan: tabel profiles belum dibuat, atau RLS memblokir akses.
                            Jalankan schema_final.sql di Supabase SQL Editor.
                        </small>
                    </div>
                ) : dbProfile ? (
                    <div>
                        {row("id",        dbProfile.id,        "#3b82f6")}
                        {row("full_name", dbProfile.full_name)}
                        {row("role",      dbProfile.role,      dbProfile.role === "admin" ? "#10b981" : "#ef4444")}
                        {row("tier",      dbProfile.tier,      "#f59e0b")}
                        {row("points",    dbProfile.points,    "#8b5cf6")}
                        {row("created_at",dbProfile.created_at)}
                    </div>
                ) : (
                    <div style={{ color: "#888", fontSize: "13px" }}>Belum ada data atau sedang loading...</div>
                )}
            </div>

            {/* Fix Role Button */}
            {dbProfile && dbProfile.role !== "admin" && (
                <div className="panel-card" style={{ border: "1px solid rgba(255,107,53,0.3)" }}>
                    <div className="panel-title">🔧 Perbaiki Role</div>
                    <p style={{ fontSize: "13px", color: "#888", margin: "0 0 16px" }}>
                        Role akun ini adalah <strong style={{ color: "#ef4444" }}>{dbProfile.role}</strong>, bukan admin.
                        Klik tombol di bawah untuk mengubahnya menjadi admin.
                    </p>
                    <button type="button" onClick={fixAdminRole}
                        style={{ padding: "10px 24px", backgroundColor: "#ff6b35", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                        🔧 Set Role ke "admin" Sekarang
                    </button>
                </div>
            )}

            {dbProfile?.role === "admin" && (
                <div style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "14px 18px" }}>
                    <div style={{ fontSize: "14px", color: "#10b981", fontWeight: 700 }}>
                        ✅ Role sudah benar: admin
                    </div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                        Kalau masih diarahkan ke /member, coba logout dan login ulang.
                    </div>
                </div>
            )}

            {/* Semua profiles */}
            {allProfiles.length > 0 && (
                <div className="panel-card">
                    <div className="panel-title">👥 Semua Profiles di Database</div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2d2d3d" }}>
                                    {["ID", "Nama", "Role", "Tier", "Poin"].map(h => (
                                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#aaa" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allProfiles.map(p => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid #2d2d3d" }}>
                                        <td style={{ padding: "10px 12px", fontSize: "11px", color: "#666", fontFamily: "monospace" }}>{p.id?.slice(0, 8)}...</td>
                                        <td style={{ padding: "10px 12px", fontSize: "13px" }}>{p.full_name || "-"}</td>
                                        <td style={{ padding: "10px 12px" }}>
                                            <span style={{ backgroundColor: p.role === "admin" ? "#10b98120" : "#6b728020", color: p.role === "admin" ? "#10b981" : "#9ca3af", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                                                {p.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: "10px 12px", fontSize: "12px", color: "#f59e0b" }}>{p.tier}</td>
                                        <td style={{ padding: "10px 12px", fontSize: "12px" }}>{p.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
