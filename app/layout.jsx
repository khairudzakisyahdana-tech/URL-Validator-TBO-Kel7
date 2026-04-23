import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Judul tab web kamu aku ubah di sini biar lebih profesional!
export const metadata = {
  title: "URL Validator Pro - TBO",
  description: "Sistem Pengecekan Kelayakan URL menggunakan Teori Bahasa dan Otomata",
};

// Sudah bersih dari kode TypeScript yang bikin error
export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}