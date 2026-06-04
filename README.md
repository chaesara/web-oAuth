# 🔐 Google OAuth 2.0 Demo

Aplikasi web demo implementasi **Google OAuth 2.0** menggunakan React + Vite + Firebase Authentication, siap deploy ke Vercel.

## 🚀 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| React 18 + Vite | Frontend framework |
| Firebase Auth | Google OAuth provider |
| React Router v6 | Client-side routing |
| Vercel | Hosting & deployment |

## 📁 Struktur Proyek

```
src/
├── firebase/
│   └── config.js          # Firebase initialization
├── context/
│   └── AuthContext.jsx    # Global auth state (React Context)
├── components/
│   └── ProtectedRoute.jsx # Guard untuk halaman private
└── pages/
    ├── Login.jsx / .css   # Halaman login dengan tombol Google
    └── Dashboard.jsx / .css # Halaman setelah login berhasil
```

## Cara Kerja OAuth 2.0

1. User klik "Login dengan Google"
2. Firebase buka popup Google Sign-In
3. User pilih akun Google
4. Google kirim Authorization Code → Firebase tukar jadi Token
5. App terima: nama, email, foto profil
6. Redirect ke /dashboard

## Setup & Jalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Deploy ke Vercel

### Via GitHub (Rekomendasi)
1. Push project ke GitHub
2. Buka vercel.com → Add New Project
3. Import repository dari GitHub
4. Klik Deploy

### Via Vercel CLI
```bash
npm install -g vercel
vercel
```

## Konfigurasi Firebase

Tambahkan domain Vercel ke Authorized Domains:
1. Firebase Console → Authentication → Settings → Authorized domains
2. Tambahkan: nama-project.vercel.app
