# 🌐 URL Validator Pro - Teori Bahasa dan Automata (TBO)

Proyek ini adalah tugas mata kuliah **Teori Bahasa dan Automata (TBO)** yang dikerjakan oleh **Kelompok 7**. Aplikasi ini merupakan simulasi mesin Automata (DFA) yang bertugas untuk memvalidasi kebenaran struktur sebuah URL web secara sekuensial.

---

## 🚀 Live Demo (Akses Langsung)
Ibu tidak perlu mengunduh atau menjalankan proyek ini secara lokal. Aplikasi sudah di-*deploy* dan dapat diuji coba secara langsung melalui tautan berikut:

👉 **[https://url-validator-tbo-kel7.vercel.app/](https://url-validator-tbo-kel7.vercel.app/)**

---

## 📂 Lokasi Kode Utama (Penting untuk Penilaian)

Proyek ini dibangun menggunakan framework Next.js. Untuk memudahkan proses penilaian, **seluruh logika mesin Automata dan antarmuka pengguna (UI)** kami satukan di dalam satu file utama. 

Ibu dapat langsung memeriksa implementasi kodenya pada direktori berikut:
> **`app/page.js`**

Di dalam file tersebut, proses validasi dibagi menjadi 4 tahapan ala kompilator:
1. **Lexical Analysis:** Pengecekan identifier awalan protokol (`http://` atau `https://`).
2. **Syntax Analysis (Regex):** Pengecekan tata bahasa dasar menggunakan *Regular Expression*.
3. **Syntax Analysis (DFA):** Simulasi *Deterministic Finite Automaton* dengan *looping* state untuk mendeteksi karakter ilegal (seperti spasi, `<`, `>`, dll).
4. **Semantic Analysis:** Pengecekan logika makna struktur URL (mendeteksi cacat hirarki seperti titik ganda `..`).

---

## 💻 Cara Menjalankan Secara Lokal (Opsional)

Jika Ibu ingin mengunduh dan menjalankan proyek ini di komputer lokal, silakan ikuti langkah-langkah standar Next.js berikut:

1. Buka terminal di dalam folder proyek ini.
2. Pastikan dependencies sudah terinstal dengan menjalankan perintah `npm install`.
3. Jalankan *development server*:

```bash
npm run dev
