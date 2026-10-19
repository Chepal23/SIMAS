import React, { useState } from 'react';
import { Send, Plus, Search, FileText, QrCode, Printer, Building2, Calendar, UserCheck } from 'lucide-react';
import { SuratKeluar, Klasifikasi, Konfigurasi } from '../types';
import { getRomanMonth } from '../mockData';

interface SuratKeluarViewProps {
  suratKeluarList: SuratKeluar[];
  klasifikasiList: Klasifikasi[];
  config: Konfigurasi;
  onAddSuratKeluar: (surat: Omit<SuratKeluar, 'id' | 'noAgendaKeluar' | 'noSuratResmi' | 'qrVerifyCode' | 'createdAt'>, fileObj?: any) => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  suratKeluarList,
  klasifikasiList,
  config,
  onAddSuratKeluar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForQR, setSelectedForQR] = useState<SuratKeluar | null>(null);

  // Form state
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  const [tujuanPenerima, setTujuanPenerima] = useState('');
  const [perihal, setPerihal] = useState('');
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(klasifikasiList[0]?.kode || '421.1');
  const [penandatangan, setPenandatangan] = useState('Kepala Sekolah');
  const [fileData, setFileData] = useState<{ fileName: string; mimeType: string; base64Data: string } | null>(null);

  // Preview auto-numbering calculation
  const nextNoUrut = suratKeluarList.length + 1;
  const nextNoUrutStr = String(nextNoUrut).padStart(3, '0');
  const currentMonthNum = new Date().getMonth() + 1;
  const romanMon = getRomanMonth(currentMonthNum);
  const currentYear = new Date().getFullYear();
  const previewNoResmi = `${kodeKlasifikasi}/${nextNoUrutStr}/${config.kodeSekolahSurat}/${romanMon}/${currentYear}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFileData({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          base64Data: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSuratKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tujuanPenerima || !perihal) {
      alert('Mohon lengkapi tujuan penerima dan perihal surat.');
      return;
    }

    onAddSuratKeluar(
      {
        tanggalSurat,
        tujuanPenerima,
        perihal,
        kodeKlasifikasi,
        penandatangan,
        fileUrl: fileData ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: fileData ? fileData.fileName : 'Surat_Keluar_Resmi.pdf',
        statusArsip: 'Terkirim',
        createdBy: 'Dewi Lestari, S.E. (Admin TU)',
      },
      fileData || undefined
    );

    setIsModalOpen(false);
    setTujuanPenerima('');
    setPerihal('');
    setFileData(null);
  };

  const filtered = suratKeluarList.filter(s =>
    s.noSuratResmi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tujuanPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pencatatan Surat Keluar & Auto-Numbering</h2>
          <p className="text-xs text-slate-500">Generator nomor surat resmi dinas sekolah dan verifikasi QR Code keaslian dokumen.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Terbitkan Surat Keluar
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat resmi, tujuan penerima, atau perihal..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Surat Keluar Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Agenda / No. Surat Resmi</th>
                <th className="py-3.5 px-4">Tanggal & Tujuan</th>
                <th className="py-3.5 px-4">Perihal</th>
                <th className="py-3.5 px-4">Penandatangan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi QR & Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.length > 0 ? (
                filtered.map(surat => (
                  <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">#{surat.noAgendaKeluar}</div>
                      <div className="text-amber-700 text-xs font-semibold">{surat.noSuratResmi}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{surat.tujuanPenerima}</div>
                      <div className="text-slate-400 text-[11px]">{surat.tanggalSurat}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-2">{surat.perihal}</div>
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 mt-1 inline-block">
                        {surat.kodeKlasifikasi}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{surat.penandatangan}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {surat.statusArsip}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedForQR(surat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors"
                        title="Generator QR Code Verifikasi"
                      >
                        <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                        QR Verifikasi
                      </button>
                      <a
                        href={surat.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Berkas
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada surat keluar yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Terbitkan Surat Keluar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Terbitkan Surat Keluar & Auto-Numbering</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            {/* Auto-Numbering Preview Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-xs">
              <div className="font-semibold text-amber-900 mb-1">Pratinjau Nomor Surat Resmi Otomatis:</div>
              <div className="font-mono text-sm font-extrabold text-amber-800 bg-white p-2 rounded border border-amber-300">
                {previewNoResmi}
              </div>
              <div className="text-[11px] text-amber-700 mt-1">
                Format: Klasifikasi / No. Urut / Kode Sekolah / Bulan Romawi / Tahun (LockService Active)
              </div>
            </div>

            <form onSubmit={handleSaveSuratKeluar} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Klasifikasi *</label>
                  <select
                    value={kodeKlasifikasi}
                    onChange={(e) => setKodeKlasifikasi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  >
                    {klasifikasiList.map(k => (
                      <option key={k.kode} value={k.kode}>{k.kode} - {k.namaKlasifikasi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Surat *</label>
                  <input
                    type="date"
                    required
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan / Penerima Surat *</label>
                <input
                  type="text"
                  required
                  value={tujuanPenerima}
                  onChange={(e) => setTujuanPenerima(e.target.value)}
                  placeholder="Contoh: Orang Tua Murid Kelas XII / Dinas Pendidikan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perihal Surat *</label>
                <textarea
                  required
                  rows={3}
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  placeholder="Tuliskan perihal surat keluar secara lengkap..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penandatangan Surat</label>
                  <select
                    value={penandatangan}
                    onChange={(e) => setPenandatangan(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Waka Kurikulum">Waka Kurikulum</option>
                    <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unggah Draft / Scan Berkas</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="w-full text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-md shadow-emerald-600/20 transition-colors"
                >
                  Terbitkan & Generate Nomor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QR Verification & Print Preview */}
      {selectedForQR && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-900">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">QR Code Verifikasi Keaslian Surat</h3>
                <p className="text-xs font-mono text-emerald-700">{selectedForQR.noSuratResmi}</p>
              </div>
              <button onClick={() => setSelectedForQR(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="text-center space-y-4 py-4">
              {/* Simulated QR Code Render box */}
              <div className="w-48 h-48 mx-auto bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-white shadow-lg relative">
                <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center p-2 text-slate-900 font-mono text-center">
                  <div className="text-[10px] space-y-1">
                    <div className="font-bold text-emerald-700">QR VERIFY</div>
                    <div className="break-all font-mono text-[9px] text-slate-600">{selectedForQR.qrVerifyCode}</div>
                    <div className="text-[8px] text-slate-400">Scan untuk validasi portal resmi sekolah</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1">
                <div><strong className="text-slate-700">Perihal:</strong> {selectedForQR.perihal}</div>
                <div><strong className="text-slate-700">Tujuan:</strong> {selectedForQR.tujuanPenerima}</div>
                <div><strong className="text-slate-700">Token Verifikasi:</strong> <span className="font-mono text-emerald-700">{selectedForQR.qrVerifyCode}</span></div>
                <div className="text-[11px] text-slate-500 pt-1">
                  URL Validasi: <code className="text-indigo-600">/?page=verify&code={selectedForQR.qrVerifyCode}</code>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
              >
                <Printer className="w-4 h-4" />
                Cetak Surat & QR
              </button>
              <button
                onClick={() => setSelectedForQR(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
