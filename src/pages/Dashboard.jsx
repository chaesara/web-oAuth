import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ─── Helpers ────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
  if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
  return new Date(date).toLocaleDateString("id-ID");
}

// ─── Data Wisata Wonosobo ────────────────────────────────────
const wisataList = [
  {
    id: 1,
    nama: "Dieng Plateau",
    kategori: "Alam & Budaya",
    lokasi: "Dieng, Wonosobo",
    deskripsi:
      "Dataran tinggi vulkanik yang memukau dengan candi-candi Hindu kuno, kawah belerang, dan pemandangan awan yang menakjubkan. Destinasi ikonik Wonosobo.",
    emoji: "🏔️",
    rating: 4.9,
    harga: "Rp 15.000",
    jam: "06.00 – 17.00",
    color: "#6d28d9",
  },
  {
    id: 2,
    nama: "Telaga Warna",
    kategori: "Danau",
    lokasi: "Dieng, Wonosobo",
    deskripsi:
      "Danau vulkanik ajaib yang airnya bisa berubah warna menjadi hijau, biru, dan kuning akibat kandungan belerang. Salah satu fenomena alam paling unik di Indonesia.",
    emoji: "🌈",
    rating: 4.8,
    harga: "Rp 10.000",
    jam: "07.00 – 17.00",
    color: "#0891b2",
  },
  {
    id: 3,
    nama: "Bukit Sikunir",
    kategori: "Pendakian",
    lokasi: "Sembungan, Wonosobo",
    deskripsi:
      "Bukit dengan sunrise terbaik di Jawa. Dari puncaknya bisa melihat Golden Sunrise yang menakjubkan dengan latar Gunung Sindoro, Sumbing, dan Merapi.",
    emoji: "🌅",
    rating: 4.9,
    harga: "Rp 10.000",
    jam: "04.00 – 10.00",
    color: "#d97706",
  },
  {
    id: 4,
    nama: "Waduk Wadaslintang",
    kategori: "Danau Buatan",
    lokasi: "Wadaslintang, Wonosobo",
    deskripsi:
      "Danau buatan terbesar di Jawa Tengah dengan pemandangan hijau yang asri. Cocok untuk wisata keluarga, memancing, dan menikmati suasana tenang.",
    emoji: "⛵",
    rating: 4.5,
    harga: "Rp 5.000",
    jam: "08.00 – 17.00",
    color: "#059669",
  },
  {
    id: 5,
    nama: "Curug Sikarim",
    kategori: "Air Terjun",
    lokasi: "Mojotengah, Wonosobo",
    deskripsi:
      "Air terjun bertingkat setinggi 70 meter dikelilingi hutan pinus yang lebat. Udara sejuk dan suara gemericik air membuat suasana sangat menenangkan.",
    emoji: "💧",
    rating: 4.6,
    harga: "Rp 10.000",
    jam: "07.00 – 16.00",
    color: "#0369a1",
  },
  {
    id: 6,
    nama: "Candi Arjuna",
    kategori: "Situs Bersejarah",
    lokasi: "Dieng, Wonosobo",
    deskripsi:
      "Kompleks candi Hindu abad ke-7 yang merupakan candi tertua di Pulau Jawa. Arsitektur megah yang masih terawat indah di tengah kabut Dieng.",
    emoji: "🏛️",
    rating: 4.7,
    harga: "Termasuk tiket Dieng",
    jam: "06.00 – 17.00",
    color: "#92400e",
  },
];

const kulinerList = [
  { nama: "Mie Ongklok", desc: "Mie khas Wonosobo kuah kental dengan tempe kemul", emoji: "🍜" },
  { nama: "Soto Wonosobo", desc: "Soto khas dengan kaldu bening gurih dan taoge", emoji: "🍲" },
  { nama: "Tempe Kemul", desc: "Gorengan tempe berbumbu khas yang renyah dan gurih", emoji: "🫓" },
  { nama: "Carica", desc: "Buah khas Dieng dalam sirup manis yang menyegarkan", emoji: "🍑" },
];

// ─── Component ──────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── localStorage keys ────────────────────────────────────
  const STORAGE_KEY_COMMENTS = "wonosobo_comments";
  const STORAGE_KEY_VISITED = "wonosobo_visited";
  const STORAGE_KEY_WISHLIST = "wonosobo_wishlist";

  // ── State ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("wisata");
  const [visitedIds, setVisitedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_VISITED)) || []; }
    catch { return []; }
  });
  const [wishlistIds, setWishlistIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_WISHLIST)) || []; }
    catch { return []; }
  });
  const [comments, setComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_COMMENTS)) || [
        {
          id: 1,
          author: "Admin",
          avatar: null,
          initials: "A",
          text: "Selamat datang di Wonosobo Tourism! Bagikan pengalaman wisata Wonosobemu di sini 🏔️",
          time: Date.now() - 1000 * 60 * 10,
        },
      ];
    } catch { return []; }
  });
  const [commentText, setCommentText] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Sync to localStorage ─────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VISITED, JSON.stringify(visitedIds));
  }, [visitedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // ── Handlers ─────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleVisited = (id) => {
    setVisitedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleWishlist = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: user?.displayName ?? "Wisatawan",
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

  // ── Filter & Search ──────────────────────────────────────
  const kategoriList = ["Semua", ...new Set(wisataList.map((w) => w.kategori))];
  const filteredWisata = wisataList.filter((w) => {
    const matchKat = filterKategori === "Semua" || w.kategori === filterKategori;
    const matchSearch =
      !searchQuery ||
      w.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKat && matchSearch;
  });

  const loginTime = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "-";

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* ── Header ──────────────────────────────────────── */}
        <header className="dash-header">
          <div className="dash-brand">
            <span className="brand-dot" />
            🏔️ Wonosobo Tourism
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

        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className="hero-banner glass">
          <div className="hero-content">
            <div className="hero-emoji">🌄</div>
            <div>
              <h1 className="hero-title">Jelajahi Wonosobo</h1>
              <p className="hero-subtitle">
                Negeri di atas awan — Dieng, danau vulkanik, & pesona alam Jawa Tengah
              </p>
              <div className="hero-stats">
                <span className="stat-pill">🗺️ {wisataList.length} Destinasi</span>
                <span className="stat-pill">✅ {visitedIds.length} Dikunjungi</span>
                <span className="stat-pill">❤️ {wishlistIds.length} Wishlist</span>
              </div>
            </div>
          </div>
          <div className="user-chip">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="chip-avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="chip-avatar-placeholder">{user?.displayName?.[0]?.toUpperCase() ?? "?"}</div>
            )}
            <div>
              <div className="chip-name">{user?.displayName ?? "Wisatawan"}</div>
              <div className="chip-sub">Login · {loginTime}</div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ──────────────────────────────── */}
        <div className="tab-nav glass">
          {[
            { key: "wisata", label: "🏔️ Destinasi" },
            { key: "kuliner", label: "🍜 Kuliner" },
            { key: "komentar", label: "💬 Diskusi" },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "tab-active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: DESTINASI ══════════════════════════════════ */}
        {activeTab === "wisata" && (
          <>
            {/* Filter & Search */}
            <div className="filter-bar glass">
              <input
                className="search-input"
                type="text"
                placeholder="🔍 Cari destinasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="kategori-pills">
                {kategoriList.map((k) => (
                  <button
                    key={k}
                    className={`pill-btn ${filterKategori === k ? "pill-active" : ""}`}
                    onClick={() => setFilterKategori(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Wisata Cards */}
            <div className="wisata-grid">
              {filteredWisata.map((w) => (
                <div className="wisata-card glass" key={w.id}>
                  <div className="wisata-header" style={{ background: `${w.color}18`, borderBottom: `2px solid ${w.color}30` }}>
                    <span className="wisata-emoji">{w.emoji}</span>
                    <div className="wisata-badges">
                      <span className="badge-kategori" style={{ color: w.color, background: `${w.color}15`, border: `1px solid ${w.color}30` }}>
                        {w.kategori}
                      </span>
                      <span className="badge-rating">⭐ {w.rating}</span>
                    </div>
                  </div>
                  <div className="wisata-body">
                    <h3 className="wisata-nama">{w.nama}</h3>
                    <p className="wisata-lokasi">📍 {w.lokasi}</p>
                    <p className="wisata-desc">{w.deskripsi}</p>
                    <div className="wisata-meta">
                      <span>🎫 {w.harga}</span>
                      <span>🕐 {w.jam}</span>
                    </div>
                    <div className="wisata-actions">
                      <button
                        className={`action-btn ${visitedIds.includes(w.id) ? "btn-visited" : "btn-outline"}`}
                        onClick={() => toggleVisited(w.id)}
                      >
                        {visitedIds.includes(w.id) ? "✅ Sudah Dikunjungi" : "☐ Tandai Dikunjungi"}
                      </button>
                      <button
                        className={`action-btn-icon ${wishlistIds.includes(w.id) ? "btn-wishlist-active" : "btn-outline-icon"}`}
                        onClick={() => toggleWishlist(w.id)}
                        title={wishlistIds.includes(w.id) ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                      >
                        {wishlistIds.includes(w.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredWisata.length === 0 && (
              <div className="empty-state glass">
                <div style={{ fontSize: 40 }}>🔍</div>
                <p>Tidak ada destinasi yang cocok dengan pencarianmu.</p>
              </div>
            )}
          </>
        )}

        {/* ══ TAB: KULINER ════════════════════════════════════ */}
        {activeTab === "kuliner" && (
          <>
            <p className="section-title">Kuliner Khas Wonosobo</p>
            <div className="kuliner-grid">
              {kulinerList.map((k, i) => (
                <div className="kuliner-card glass" key={i}>
                  <div className="kuliner-emoji">{k.emoji}</div>
                  <h3 className="kuliner-nama">{k.nama}</h3>
                  <p className="kuliner-desc">{k.desc}</p>
                </div>
              ))}
            </div>

            <p className="section-title" style={{ marginTop: 20 }}>Tips Wisata Wonosobo</p>
            <div className="tips-section glass">
              {[
                { icon: "🧥", tip: "Bawa jaket tebal — suhu Dieng bisa turun hingga 0°C di malam hari" },
                { icon: "🌅", tip: "Datang pagi untuk sunrise Sikunir, berangkat dari penginapan pukul 03.30" },
                { icon: "🏨", tip: "Menginap di homestay desa untuk pengalaman autentik dan lebih hemat" },
                { icon: "🗓️", tip: "Hindari musim hujan (Nov–Mar) untuk pendakian dan cuaca lebih bersih" },
                { icon: "🛵", tip: "Sewa motor untuk keliling Dieng lebih fleksibel dan hemat" },
                { icon: "💰", tip: "Beli tiket terusan Dieng Rp 35.000 untuk masuk semua objek wisata" },
              ].map((t, i) => (
                <div className="tip-item" key={i}>
                  <span className="tip-icon">{t.icon}</span>
                  <span className="tip-text">{t.tip}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ TAB: KOMENTAR ═══════════════════════════════════ */}
        {activeTab === "komentar" && (
          <>
            <p className="section-title">Diskusi & Pengalaman Wisata</p>
            <div className="comment-section glass">
              {/* Input */}
              <div className="comment-input-wrap">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="comment-avatar-sm" referrerPolicy="no-referrer" />
                ) : (
                  <div className="comment-avatar-placeholder-sm">
                    {user?.displayName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="comment-field-wrap">
                  <textarea
                    className="comment-textarea"
                    rows={2}
                    placeholder="Bagikan pengalaman wisatamu di Wonosobo... (Enter untuk kirim)"
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
                  <div className="comment-empty">Belum ada diskusi. Jadilah yang pertama berbagi!</div>
                ) : (
                  comments.map((c) => (
                    <div className="comment-item" key={c.id}>
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.author} className="comment-avatar-sm" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="comment-avatar-placeholder-sm">{c.initials}</div>
                      )}
                      <div className="comment-body">
                        <div className="comment-meta">
                          <span className="comment-author">{c.author}</span>
                          <span className="comment-time">{timeAgo(c.time)}</span>
                          {(c.author === (user?.displayName ?? "Wisatawan") || c.author === "Wisatawan") && (
                            <button className="comment-delete" onClick={() => handleDeleteComment(c.id)} title="Hapus">🗑</button>
                          )}
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        <footer className="dash-footer">
          🏔️ Wonosobo Tourism · React + Vite + Firebase · Data tersimpan di localStorage
        </footer>
      </div>
    </div>
  );
}
