import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Format tanggal login
  const loginTime = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "-";

  const createdTime = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "-";

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Header */}
        <header className="dash-header">
          <div className="dash-brand">
            <span className="brand-dot" />
            OAuth Demo
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </header>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="profile-avatar"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.displayName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="verified-badge" title="Terverifikasi Google">✓</span>
          </div>

          <h2 className="profile-name">{user?.displayName ?? "Pengguna"}</h2>
          <p className="profile-email">{user?.email}</p>

          <div className="badge-row">
            <span className="badge badge-google">
              <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login via Google OAuth
            </span>
            <span className="badge badge-active">● Aktif</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🪪</div>
            <div className="info-content">
              <span className="info-label">User ID (UID)</span>
              <span className="info-value uid">{user?.uid}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✅</div>
            <div className="info-content">
              <span className="info-label">Email Terverifikasi</span>
              <span className={`info-value ${user?.emailVerified ? "text-green" : "text-red"}`}>
                {user?.emailVerified ? "Ya, terverifikasi" : "Belum terverifikasi"}
              </span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🕐</div>
            <div className="info-content">
              <span className="info-label">Login Terakhir</span>
              <span className="info-value">{loginTime}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📅</div>
            <div className="info-content">
              <span className="info-label">Akun Dibuat</span>
              <span className="info-value">{createdTime}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🔑</div>
            <div className="info-content">
              <span className="info-label">Provider</span>
              <span className="info-value">
                {user?.providerData?.[0]?.providerId ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* OAuth Flow Explanation */}
        <div className="oauth-explain">
          <h3>📖 Cara Kerja Google OAuth 2.0</h3>
          <div className="flow-steps">
            <div className="flow-step">
              <span className="step-num">1</span>
              <div>
                <strong>User klik "Login dengan Google"</strong>
                <p>Browser membuka popup Google Sign-In</p>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="step-num">2</span>
              <div>
                <strong>User memilih akun Google</strong>
                <p>Google memverifikasi identitas pengguna</p>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="step-num">3</span>
              <div>
                <strong>Google mengirim Authorization Code</strong>
                <p>Firebase Auth menukar code dengan Access Token</p>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="step-num">4</span>
              <div>
                <strong>App menerima user data</strong>
                <p>Nama, email, foto profil tersedia tanpa password</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="dash-footer">
          OAuth 2.0 Demo · React + Vite + Firebase · Deploy di Vercel
        </footer>
      </div>
    </div>
  );
}
