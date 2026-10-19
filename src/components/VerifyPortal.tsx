import React, { useState, useEffect } from 'react';
import { SuratKeluar, Konfigurasi } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Calendar, Building2, UserCheck, ArrowLeft, Printer } from 'lucide-react';

interface VerifyPortalProps {
  verifyCode: string;
  suratKeluarList: SuratKeluar[];
  config: Konfigurasi;
  onBackToApp: () => void;
}

export const VerifyPortal: React.FC<VerifyPortalProps> = ({ verifyCode, suratKeluarList, config, onBackToApp }) => {
  const [searchCode, setSearchCode] = useState(verifyCode || '');
  const foundSurat = suratKeluarList.find(s => s.qrVerifyCode.toLowerCase() === searchCode.trim().toLowerCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchCode.trim();
    window.history.pushState({}, '', `?page=verify&code=${encodeURIComponent(clean)}`);
    // trigger state re-render
    setSearchCode(clean);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">PORTAL E-VERIFIKASI RESMI</h1>
            <p className="text-xs text-slate-400">{config.namaSekolah}</p>
          </div>
        </div>
        <button
          onClick={onBackToApp}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Aplikasi SIMAS
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Verifikasi Keaslian Dokumen Surat Sekolah</h2>
          <p className="text-sm text-slate-400">
            Masukkan atau pindai kode token QR dokumen surat keluar untuk memastikan keabsahan dan keaslian yang diterbitkan oleh {config.namaSekolah}.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Masukkan Kode Verifikasi (Contoh: SIMAS-SK-8839201)"
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors text-sm shadow-lg shadow-emerald-900/30"
          >
            Verifikasi
          </button>
        </form>

        {/* Result Card */}
        {searchCode && (
          <div>
            {foundSurat ? (
              <div className="bg-slate-800/80 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500/10 px-4 py-1.5 rounded-bl-xl border-l border-b border-emerald-500/30 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  DOKUMEN RESMI & TERVERIFIKASI
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono px-2 py-0.5 bg-slate-700 text-emerald-300 rounded border border-emerald-500/30">
                      {foundSurat.noSuratResmi}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{foundSurat.perihal}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6 border-y border-slate-700/60 py-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400">Tanggal Terbit</div>
                      <div className="font-medium">{foundSurat.tanggalSurat}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400">Tujuan / Penerima</div>
                      <div className="font-medium">{foundSurat.tujuanPenerima}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400">Pejabat Penandatangan</div>
                      <div className="font-medium">{foundSurat.penandatangan} ({config.namaKepalaSekolah})</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400">Instansi Penerbit</div>
                      <div className="font-medium">{config.namaSekolah}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400 font-mono">
                    Token: {foundSurat.qrVerifyCode}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Cetak Bukti Verifikasi
                    </button>
                    <a
                      href={foundSurat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Unduh Berkas Asli
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/80 border border-rose-500/40 rounded-2xl p-8 text-center shadow-xl">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dokumen Tidak Ditemukan</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Kode verifikasi <span className="font-mono text-rose-300">{searchCode}</span> tidak terdaftar di pangkalan data resmi {config.namaSekolah}. Mohon periksa kembali kode QR atau nomor surat.
                </p>
                <div className="text-xs text-slate-500">
                  Pastikan pemindaian QR code dilakukan langsung dari surat resmi yang diterbitkan.
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {config.namaSekolah}. Sistem Verifikasi Dokumen Terintegrasi.
      </footer>
    </div>
  );
};
