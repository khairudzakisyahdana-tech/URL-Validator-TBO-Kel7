'use client'; // Wajib di Next.js karena kita pakai state interaktif

import { useState } from 'react';

// =======================================================
// BAGIAN 1: LOGIKA MESIN TBO (Terpisah dari urusan UI)
// =======================================================
const jalankanMesinAutomata = (inputUrl) => {
  let logs = [];
  let isLolos = true;
  let alasanGagal = ""; // Variabel baru untuk menyimpan alasan spesifik

  // 1. TAHAP LEXICAL ANALYSIS (Pengecekan Awal)
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    logs.push("❌ Lexical: GAGAL. URL harus diawali dengan 'http://' atau 'https://'");
    isLolos = false;
    alasanGagal = "Format awal (identifier protokol) tidak dikenali oleh sistem leksikal.";
  } else {
    logs.push("✅ Lexical: LULUS. Protokol format (http/https) ditemukan.");
  }

  // 2. TAHAP SYNTAX (Regex)
  const regexPola = /^(https?):\/\/([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/.*)?$/;
  if (isLolos) {
    if (!regexPola.test(inputUrl)) {
      logs.push("❌ Syntax (Regex): GAGAL. Pola dasar string tidak sesuai standar URL.");
      isLolos = false;
      alasanGagal = "Struktur string tidak cocok dengan pola grammar URL (misal: format domain atau ekstensi tidak valid).";
    } else {
      logs.push("✅ Syntax (Regex): LULUS. Pola string dikenali oleh mesin Regex.");
    }
  }

  // 3. TAHAP SYNTAX (Simulasi Transisi DFA)
  if (isLolos) {
    let isDfaError = false;

    for (let i = 0; i < inputUrl.length; i++) {
      let char = inputUrl[i];

      // Simulasi aturan DFA: Jika bertemu karakter ilegal, masuk Dead State
      if (char === ' ' || char === '<' || char === '>' || char === '{' || char === '}') {
        logs.push(`❌ Syntax (DFA): GAGAL. Mesin berhenti di State Error (terdapat karakter ilegal '${char}' di indeks ke-${i}).`);
        isDfaError = true;
        isLolos = false;
        alasanGagal = `Mesin DFA mendeteksi karakter ilegal ('${char}') yang menyebabkan transisi berhenti (masuk ke dead state).`;
        break; 
      }
    }

    if (!isDfaError) {
      logs.push("✅ Syntax (DFA): LULUS. Seluruh karakter berhasil dibaca hingga Final State.");
    }
  }

  // 4. TAHAP SEMANTIC ANALYSIS (Pengecekan Logika Makna)
  if (isLolos) {
    if (inputUrl.includes('..')) {
      logs.push("❌ Semantic: GAGAL. Terdapat titik ganda '..' yang merusak logika hirarki domain.");
      isLolos = false;
      alasanGagal = "Ditemukan kesalahan logika pada komponen URL (penggunaan titik ganda yang merusak struktur path/domain).";
    } else {
      logs.push("✅ Semantic: LULUS. Logika komponen (domain/path) valid secara makna.");
    }
  }

  // MEMBUAT TEKS KESIMPULAN
  let teksKesimpulan = isLolos
    ? "URL dinyatakan VALID karena seluruh tahapan verifikasi berhasil dilalui. String memenuhi standar bahasa formal URL dan siap digunakan."
    : `URL TIDAK VALID karena gagal pada tahapan verifikasi. Alasan utama: ${alasanGagal}`;

  // Mengembalikan hasil
  return {
    statusAkhir: isLolos,
    riwayatLog: logs,
    kesimpulan: teksKesimpulan // Mengirim kesimpulan ke UI
  };
};


// =======================================================
// BAGIAN 2: TAMPILAN WEB (User Interface)
// =======================================================
export default function Home() {
  const [url, setUrl] = useState('');
  const [hasilLog, setHasilLog] = useState([]);
  const [statusValid, setStatusValid] = useState(null);
  const [teksKesimpulan, setTeksKesimpulan] = useState('');

  const handleValidasi = () => {
    if (!url) {
      alert("Tolong masukkan URL terlebih dahulu!");
      return;
    }

    const hasil = jalankanMesinAutomata(url);
    
    setStatusValid(hasil.statusAkhir);
    setHasilLog(hasil.riwayatLog);
    setTeksKesimpulan(hasil.kesimpulan); // Menyimpan teks kesimpulan
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full border border-gray-100">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2 tracking-tight">URL Validator Pro</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Automata-Based Verification System (Kelompok 7)</p>

        {/* Form Input */}
        <div className="flex flex-col gap-4 mb-8">
          <label className="font-semibold text-gray-700">Masukkan URL yang ingin diuji:</label>
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-mono text-sm"
            placeholder="Contoh: https://unsri.ac.id"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleValidasi}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Jalankan Pengecekan Automata
          </button>
        </div>

        {/* Kotak Hasil Validasi */}
        {statusValid !== null && (
          <div className={`p-6 rounded-xl border ${statusValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h2 className={`text-2xl font-black mb-4 flex items-center gap-2 ${statusValid ? 'text-green-700' : 'text-red-700'}`}>
              {statusValid ? '✔️ URL DINYATAKAN VALID' : '❌ URL TIDAK VALID'}
            </h2>
            
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 border-b pb-2">Detail Log Pemeriksaan Mesin:</h3>
              <ul className="list-none space-y-2 text-sm text-gray-700">
                {hasilLog.map((log, index) => (
                  <li key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    {log}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kotak Khusus Kesimpulan */}
            <div className="mt-6 p-4 bg-white/80 rounded-lg border border-gray-200 shadow-inner">
              <p className="text-sm text-gray-800 leading-relaxed">
                <strong className="text-gray-900 block mb-1">Kesimpulan Akhir:</strong>
                {teksKesimpulan}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}