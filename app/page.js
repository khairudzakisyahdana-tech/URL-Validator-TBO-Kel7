'use client';

import { useState } from 'react';

// =======================================================
// CORE ENGINE: LOGIKA MESIN AUTOMATA (TBO)
// =======================================================
const jalankanMesinAutomata = (inputUrl) => {
  let logs = [];
  let isLolos = true;
  let alasanGagal = "";

  // 1. TAHAP LEXICAL ANALYSIS
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    isLolos = false;
    alasanGagal = "Format protokol di awal URL tidak dikenali.";
    logs.push({
      judul: "Lexical Analysis",
      status: "GAGAL",
      pesan: "Mesin menolak input pada tahap pembacaan awal.",
      analisis: "URL tidak diawali dengan identifier protokol wajib ('http://' atau 'https://').",
      jejak: [
        "[q0] Start",
        " ⬇  (baca awalan salah)",
        "[q_error] DEAD STATE ❌"
      ]
    });
  } else {
    let protokol = inputUrl.startsWith('https://') ? "https" : "http";
    logs.push({
      judul: "Lexical Analysis",
      status: "LULUS",
      pesan: "Protokol format ditemukan.",
      analisis: `URL diawali dengan '${protokol}://', sesuai dengan aturan awalan.`,
      jejak: [
        "[q0] Start",
        ` ⬇  (baca '${protokol}')`,
        "[q1] State Protokol"
      ]
    });
  }

  // 2. TAHAP SYNTAX ANALYSIS (Regex)
  const regexPola = /^(https?):\/\/([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/.*)?$/; 
  if (isLolos) {
    if (!regexPola.test(inputUrl)) {
      isLolos = false;
      
      // Mesin Diagnosis Regex (Mencari tahu ALASAN spesifik Regex gagal)
      let analisisRegex = "Struktur domain atau path tidak sesuai standar grammar URL.";
      let regexTrace = ["[Regex Diagnostic Engine]"];
      
      // Ambil bagian domain saja (buang 'http://')
      let domainStr = inputUrl.replace(/^(https?):\/\//, '').split('/')[0];

      if (!domainStr.includes('.')) {
        analisisRegex = "Tidak ditemukan titik (.) pembatas antara nama domain dan ekstensi.";
        regexTrace.push(` ❌ Syarat '\\.' gagal: String '${domainStr}' tidak memiliki titik.`);
      } else {
        // Pecah berdasarkan titik (misal: unsri.ac>id menjadi 'unsri' dan 'ac>id')
        let parts = domainStr.split('.');
        let ext = parts.pop();
        let mainDom = parts.join('.');

        // 1. Cek validitas Domain Utama
        if (!/^[a-zA-Z0-9.-]+$/.test(mainDom)) {
          let charAneh = mainDom.match(/[^a-zA-Z0-9.-]/)[0]; // Tangkap karakter ilegalnya
          analisisRegex = `Terdapat karakter ilegal '${charAneh}' pada bagian nama domain.`;
          regexTrace.push(` ❌ Syarat '([a-zA-Z0-9.-]+)' gagal menelan karakter '${charAneh}'.`);
        } else {
          regexTrace.push(" ✔️ Syarat Domain utama terpenuhi.");
        }

        // 2. Cek validitas Ekstensi (misal: .id, .com)
        if (ext.length < 2 || !/^[a-zA-Z]+$/.test(ext)) {
          let charAnehExt = ext.match(/[^a-zA-Z]/) ? ext.match(/[^a-zA-Z]/)[0] : "terlalu pendek";
          analisisRegex = `Ekstensi ".${ext}" tidak valid (penyebab: ${charAnehExt}).`;
          regexTrace.push(` ❌ Syarat '\\.([a-zA-Z]{2,})' gagal memvalidasi '.${ext}'.`);
        } else {
          if (/^[a-zA-Z0-9.-]+$/.test(mainDom)) {
             regexTrace.push(" ✔️ Syarat Ekstensi terpenuhi.");
          }
        }
      }

      alasanGagal = `Ditolak oleh tahap Regex: ${analisisRegex}`;
      logs.push({
        judul: "Syntax (Regex)",
        status: "GAGAL",
        pesan: "Pola string ditolak oleh mesin Regex.",
        analisis: analisisRegex,
        jejak: regexTrace // <--- Sekarang kalau gagal, Trace-nya tetap muncul!
      });
    } else {
      logs.push({
        judul: "Syntax (Regex)",
        status: "LULUS",
        pesan: "Pola grammar URL dikenali secara umum.",
        analisis: "Mesin Regex berhasil memvalidasi pola dasar: Protokol, Pemisah, Domain Utama, dan Ekstensi Minimum.",
        jejak: [
          "[Regex Pattern Match Breakdown]",
          " ✔️ ^(https?)       ➔ Protokol valid",
          " ✔️ :\\/\\/            ➔ Pemisah valid",
          " ✔️ ([a-zA-Z0-9.-]+) ➔ String domain dikenali",
          " ✔️ \\.([a-zA-Z]{2,}) ➔ Ekstensi min 2 huruf valid",
          " ✔️ (\\/.*)?$        ➔ Path (opsional) valid"
        ]
      });
    }
  }

  // 3. TAHAP SYNTAX ANALYSIS (Simulasi DFA)
  if (isLolos) {
    let isDfaError = false;
    let charError = "";
    
    let protokolLen = inputUrl.startsWith("https://") ? 8 : 7;
    let protokolTeks = inputUrl.startsWith("https://") ? "https" : "http";
    
    let traceSteps = [
      "[q0] Start",
      ` ⬇  (baca '${protokolTeks}')`,
      "[q1] State Protokol",
      ` ⬇  (baca '://')`,
      "[q2] State Pemisah"
    ];
    
    for (let i = protokolLen; i < inputUrl.length; i++) {
      let char = inputUrl[i];
      const sigmaDiizinkan = /^[a-zA-Z0-9.\-/?=&_]+$/;

      if (!sigmaDiizinkan.test(char)) {
        isDfaError = true;
        isLolos = false;
        charError = char;
        
        traceSteps.push(` ⬇  (baca karakter ilegal '${char}')`);
        traceSteps.push("[q_error] DEAD STATE ❌");
        
        alasanGagal = `Mesin mendeteksi karakter terlarang/di luar alfabet ("${char}").`;
        break; 
      } else {
        traceSteps.push(` ⬇  (baca '${char}')`);
        traceSteps.push("[q3] Looping Domain/Path");
      }
    }

    if (isDfaError) {
      logs.push({
        judul: "Syntax (DFA)",
        status: "GAGAL",
        pesan: `Masuk ke Dead State (q_error) pada karakter '${charError}'.`,
        analisis: `Karakter '${charError}' tidak termasuk dalam himpunan Alphabet (Sigma) yang diizinkan oleh mesin TBO.`,
        jejak: traceSteps
      });
    } else {
      traceSteps.push(` ⬇  (string selesai)`);
      traceSteps.push("[q4] FINAL STATE ✅");
      logs.push({
        judul: "Syntax (DFA)",
        status: "LULUS",
        pesan: "Pembacaan karakter selesai tanpa error.",
        analisis: "Seluruh karakter (domain dan path) merupakan anggota valid dari himpunan Alphabet (Sigma).",
        jejak: traceSteps
      });
    }
  }

  // 4. TAHAP SEMANTIC ANALYSIS
  if (isLolos) {
    if (inputUrl.includes('..')) {
      isLolos = false;
      alasanGagal = "Kesalahan semantik, terdapat titik ganda yang merusak pembacaan hirarki DNS.";
      logs.push({
        judul: "Semantic Analysis",
        status: "GAGAL",
        pesan: "Logika hirarki domain cacat.",
        analisis: "Ditemukan titik ganda '..' yang secara makna tidak logis untuk sebuah alamat web.",
        jejak: "Pengecekan Constraint: GAGAL"
      });
    } else {
      logs.push({
        judul: "Semantic Analysis",
        status: "LULUS",
        pesan: "Logika URL valid secara makna.",
        analisis: "Tidak ada pelanggaran makna seperti penggunaan titik ganda beruntun.",
        jejak: "Pengecekan Constraint: LULUS"
      });
    }
  }

  let teksKesimpulan = isLolos
    ? "URL dinyatakan VALID. String memenuhi standar bahasa formal dan berhasil mencapai Final State (q4)."
    : `URL TIDAK VALID. ${alasanGagal}`;

  return {
    statusAkhir: isLolos,
    riwayatLog: logs,
    kesimpulan: teksKesimpulan
  };
};

// =======================================================
// USER INTERFACE (Next.js Component)
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
    setTeksKesimpulan(hasil.kesimpulan);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleValidasi();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full border border-gray-100">
        
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-2 tracking-tight">URL Validator Pro</h1>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">Automata-Based Verification System (Kelompok 7)</p>

        <div className="flex flex-col gap-4 mb-8">
          <label className="font-semibold text-gray-700">Masukkan URL yang ingin diuji:</label>
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-mono text-sm shadow-inner"
            placeholder="Contoh: https://unsri.ac.id/teknik"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleValidasi}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md active:scale-[0.99]"
          >
            Jalankan Pengecekan Automata
          </button>
        </div>  

        {statusValid !== null && (
          <div className={`p-6 rounded-xl border-2 shadow-sm transition-all duration-500 ${statusValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h2 className={`text-2xl font-black mb-6 flex items-center gap-2 border-b pb-4 ${statusValid ? 'text-green-700 border-green-200' : 'text-red-700 border-red-200'}`}>
              {statusValid ? '✔️ URL DINYATAKAN VALID' : '❌ URL TIDAK VALID'}
            </h2>
            
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Detail Log Pemeriksaan Mesin:</h3>
              
              <div className="flex flex-col gap-4">
                {hasilLog.map((log, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center font-bold text-[15px] mb-2 text-gray-800">
                      <span className="mr-2 text-lg">{log.status === 'LULUS' ? '✅' : '❌'}</span> 
                      {log.judul}: <span className={`ml-1 ${log.status === 'LULUS' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 ml-7">{log.pesan}</p>

                    <div className="ml-7 bg-blue-50/50 border-l-4 border-blue-400 p-3 rounded-r-lg text-sm text-gray-700 mb-3">
                      <span className="font-bold text-blue-700 flex items-center gap-1 mb-1">
                        🔍 Analisis Logika:
                      </span>
                      {log.analisis}
                    </div>

                    {log.jejak && Array.isArray(log.jejak) ? (
                      <div className="ml-7 mt-2 bg-gray-900 text-green-400 font-mono text-[13px] p-4 rounded-md shadow-inner flex flex-col overflow-x-auto max-h-64 overflow-y-auto">
                        <span className="text-gray-400 select-none mb-3 border-b border-gray-700 pb-1">$ Trace Path Execution:</span>
                        {log.jejak.map((step, idx) => (
                          <div key={idx} className={`pl-2 py-[2px] ${step.includes('❌') ? 'text-red-400 font-bold' : step.includes('✅') ? 'text-green-300 font-bold' : step.includes('⬇') ? 'text-gray-500' : ''}`}>
                            {step}
                          </div>
                        ))}
                      </div>
                    ) : (
                      log.jejak && (
                        <div className="ml-7 mt-2 bg-gray-900 text-green-400 font-mono text-[13px] p-3 rounded-md shadow-inner">
                           <span className="text-gray-400">$</span> {log.jejak}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-8 p-5 rounded-lg border shadow-sm ${statusValid ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
              <p className="text-[15px] text-gray-800 leading-relaxed">
                <strong className="text-gray-900 block mb-2 text-lg">📝 Kesimpulan Akhir:</strong>
                {teksKesimpulan}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}