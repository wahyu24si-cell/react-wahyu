import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — Guard akses berdasarkan login & role.
 *
 * role="member" → semua user yang sudah login
 * role="admin"  → hanya role admin
 *
 * PENTING: Tunggu loading selesai dulu sebelum membuat keputusan redirect.
 * Ini mencegah race condition antara profile load dan render pertama.
 */
export default function ProtectedRoute({ children, role = "member" }) {
    const { user, loading, role: userRole } = useAuth();
    const location = useLocation();

    // Masih loading session / profile → tampilkan spinner, JANGAN redirect dulu
    if (loading) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex",
                alignItems: "center", justifyContent: "center",
                backgroundColor: "#0d0d1a",
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: "40px", height: "40px",
                        border: "3px solid rgba(255,107,53,0.2)",
                        borderTopColor: "#ff6b35", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                        margin: "0 auto 12px",
                    }} />
                    <p style={{ color: "#555", fontSize: "13px" }}>Memverifikasi akses...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    // Belum login → redirect ke landing page (bukan /login agar bisa pakai modal)
    if (!user) {
        return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }

    // Sudah login tapi bukan admin, coba akses area admin → ke member
    if (role === "admin" && userRole !== "admin") {
        // Jika role masih null (profile belum load), tunggu — sudah ditangani loading di atas
        // Jika memang bukan admin, redirect ke member
        return <Navigate to="/member" replace />;
    }

    return children;
}
