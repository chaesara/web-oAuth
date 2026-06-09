import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ─── Helpers ────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function fileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "🖼️";
  if (["pdf"].includes(ext)) return "📄";
  if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
  if (["mp4", "mov", "avi"].includes(ext)) return "🎬";
  if (["mp3", "wav", "ogg"].includes(ext)) return "🎵";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  return "📁";
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
  if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
  return new Date(date).toLocaleDateString("id-ID");
}

// ─── Component ──────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Upload state
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef(null);

  // Comment state
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Admin",
      avatar: null,
      initials: "A",
      text: "Selamat datang! Silakan gunakan dashboard ini untuk mencoba fitur OAuth 2.0.",
      time: Date.now() - 1000 * 60 * 5,
    },
  ]);
  const [commentText, setCommentText] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

  // ── Upload handlers ──────────────────────────────────────
  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...picked]);
    setUploadDone(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
    setUploadDone(false);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setUploadDone(false);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    // Simulasi upload (ganti dengan Firebase Storage / API call sesuai kebutuhan)
    await new Promise((r) => setTimeout(r, 1400));
    setUploading(false);
    setUploadDone(true);
    setFiles([]);
  };

  // ── Comment handlers ─────────────────────────────────────
  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: user?.displayName ?? "Kamu",
        avatar: user?.photoURL ?? null,
        initials: user?.displayName?.[0]?.toUpperCase() ?? "?",
        text,
        time: Date.now(),
      },
    ]);
    setCommentText("");
  };

  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* ── Header ─────────────────────────────────────── */}
        <header className="dash-header">
          <div className="dash-brand">
            <span className="brand-dot" />
            OAuth Demo
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </header>

        {/* ── Profile Card ────────────────────────────────── */}
        <div className="profile-card glass">
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
              <svg viewBox="0 0 24 24" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
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

        {/* ── Info Grid ───────────────────────────────────── */}
        <p className="section-title">Informasi Akun</p>
        <div className="info-grid">
          {[
            { icon: "🪪", label: "User ID (UID)", value: user?.uid, cls: "uid" },
            { icon: "✉️", label: "Email", value: user?.email },
            {
              icon: "✅",
              label: "Email Terverifikasi",
              value: user?.emailVerified ? "Ya, terverifikasi" : "Belum terverifikasi",
              cls: user?.emailVerified ? "text-green" : "text-red",
            },
            { icon: "🕐", label: "Login Terakhir", value: loginTime },
            { icon: "📅", label: "Akun Dibuat", value: createdTime },
            { icon: "🔑", label: "Provider", value: user?.providerData?.[0]?.providerId ?? "-" },
          ].map((item, i) => (
            <div className="info-card glass" key={i}>
              <div className="info-icon">{item.icon}</div>
              <div className="info-content">
                <span className="info-label">{item.label}</span>
                <span className={`info-value ${item.cls ?? ""}`}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Upload Section ──────────────────────────────── */}
        <p className="section-title">Upload File</p>
        <div className="upload-section glass">
          <div
            className={`upload-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="upload-icon">☁️</div>
            <p className="upload-label">Klik atau seret file ke sini</p>
            <p className="upload-sub">Semua jenis file didukung</p>
          </div>

          {files.length > 0 && (
            <div className="file-list">
              {files.map((f, i) => (
                <div className="file-item" key={i}>
                  <span className="file-item-icon">{fileIcon(f.name)}</span>
                  <div className="file-item-info">
                    <div className="file-item-name">{f.name}</div>
                    <div className="file-item-size">{formatBytes(f.size)}</div>
                  </div>
                  <button
                    className="file-item-remove"
                    onClick={() => removeFile(i)}
                    title="Hapus"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "⏳ Mengunggah..." : `⬆️ Upload ${files.length} file`}
              </button>
            </div>
          )}

          {uploadDone && (
            <div className="upload-success">
              ✅ File berhasil diunggah!
            </div>
          )}
        </div>

        {/* ── Comment Section ─────────────────────────────── */}
        <p className="section-title">Komentar</p>
        <div className="comment-section glass">

          {/* Input */}
          <div className="comment-input-wrap">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="comment-avatar-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="comment-avatar-placeholder-sm">
                {user?.displayName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="comment-field-wrap">
              <textarea
                className="comment-textarea"
                rows={2}
                placeholder="Tulis komentar... (Enter untuk kirim)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="comment-submit-btn"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                Kirim ↗
              </button>
            </div>
          </div>

          {/* List */}
          <div className="comment-list">
            {comments.length === 0 ? (
              <div className="comment-empty">Belum ada komentar. Jadilah yang pertama!</div>
            ) : (
              comments.map((c) => (
                <div className="comment-item" key={c.id}>
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="comment-avatar-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="comment-avatar-placeholder-sm">{c.initials}</div>
                  )}
                  <div className="comment-body">
                    <div className="comment-meta">
                      <span className="comment-author">{c.author}</span>
                      <span className="comment-time">{timeAgo(c.time)}</span>
                      {(c.author === (user?.displayName ?? "Kamu") ||
                        c.author === "Kamu") && (
                        <button
                          className="comment-delete"
                          onClick={() => handleDeleteComment(c.id)}
                          title="Hapus komentar"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── OAuth Flow ──────────────────────────────────── */}
        <p className="section-title">Cara Kerja OAuth</p>
        <div className="oauth-explain glass">
          <div className="flow-steps">
            {[
              { title: "User klik "Login dengan Google"", desc: "Browser membuka popup Google Sign-In" },
              { title: "User memilih akun Google", desc: "Google memverifikasi identitas pengguna" },
              { title: "Google mengirim Authorization Code", desc: "Firebase Auth menukar code dengan Access Token" },
              { title: "App menerima user data", desc: "Nama, email, foto profil tersedia tanpa password" },
            ].map((step, i, arr) => (
              <div key={i}>
                <div className="flow-step">
                  <span className="step-num">{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="flow-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>

        <footer className="dash-footer">
          OAuth 2.0 Demo · React + Vite + Firebase · Deploy di Vercel
        </footer>
      </div>
    </div>
  );
}
