import React, { useState } from 'react';
import { Mail, Plus, Search, Filter, FileText, Download, ExternalLink, Send, Calendar, Building2, Shield } from 'lucide-react';
import { SuratMasuk, Klasifikasi, Pegawai, Disposisi } from '../types';

interface SuratMasukViewProps {
  suratMasukList: SuratMasuk[];
  klasifikasiList: Klasifikasi[];
  pegawaiList: Pegawai[];
  onAddSuratMasuk: (surat: Omit<SuratMasuk, 'id' | 'noAgenda' | 'createdAt' | 'statusDisposisi'>, fileObj?: any) => void;
  onCreateDisposisi: (disposisi: Omit<Disposisi, 'id' | 'createdAt' | 'statusWhatsApp' | 'waMessageId'>) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  suratMasukList,
  klasifikasiList,
  pegawaiList,
  onAddSuratMasuk,
  onCreateDisposisi,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState('ALL');
  const [filterKeamanan, setFilterKeamanan] = useState('ALL');

  // New surat form state
  const [noSuratAsal, setNoSuratAsal] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalTerima, setTanggalTerima] = useState(new Date().toISOString().split('T')[0]);
  const [pengirim, setPengirim] = useState('');
  const [perihal, setPerihal] = useState('');
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(klasifikasiList[0]?.kode || '005');
  const [tingkatKeamanan, setTingkatKeamanan] = useState<'Biasa' | 'Penting' | 'Rahasia'>('Biasa');
  const [fileData, setFileData] = useState<{ fileName: string; mimeType: string; base64Data: string } | null>(null);

  // Disposition modal state
  const [selectedSuratForDisposisi, setSelectedSuratForDisposisi] = useState<SuratMasuk | null>(null);
  const [pegawaiTujuanId, setPegawaiTujuanId] = useState(pegawaiList[1]?.id || pegawaiList[0]?.id || '');
  const [instruksi, setInstruksi] = useState('Tindak lanjuti');
  const [catatanPimpinan, setCatatanPimpinan] = useState('');
  const [batasWaktu, setBatasWaktu] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

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

  const handleSaveSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSuratAsal || !pengirim || !perihal) {
      alert('Mohon lengkapi nomor surat asal, pengirim, dan perihal.');
      return;
    }

    onAddSuratMasuk(
      {
        noSuratAsal,
        tanggalSurat,
        tanggalTerima,
        pengirim,
        perihal,
        kodeKlasifikasi,
        tingkatKeamanan,
        fileUrl: fileData ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: fileData ? fileData.fileName : 'Arsip_Surat_Masuk.pdf',
        createdBy: 'Dewi Lestari, S.E. (Admin TU)',
      },
      fileData || undefined
    );

    setIsModalOpen(false);
    // reset form
    setNoSuratAsal('');
    setPengirim('');
    setPerihal('');
    setFileData(null);
  };

  const handleSaveDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuratForDisposisi) return;

    const pegawai = pegawaiList.find(p => p.id === pegawaiTujuanId);
    if (!pegawai) {
      alert('Pilih pegawai tujuan disposisi.');
      return;
    }

    onCreateDisposisi({
      idSuratMasuk: selectedSuratForDisposisi.id,
      noSuratAsal: selectedSuratForDisposisi.noSuratAsal,
      perihal: selectedSuratForDisposisi.perihal,
      tanggalDisposisi: new Date().toISOString().split('T')[0],
      batasWaktu,
      instruksi,
      catatanPimpinan,
      idPegawaiTujuan: pegawai.id,
      namaPegawaiTujuan: pegawai.namaLengkap,
      noWaTujuan: pegawai.noWhatsApp,
      statusTindakLanjut: 'Pending',
    });

    setSelectedSuratForDisposisi(null);
    alert('Lembar disposisi berhasil dibuat dan notifikasi WhatsApp Sidobe dikirim ke ' + pegawai.namaLengkap);
  };

  const filteredSurat = suratMasukList.filter(s => {
    const matchesSearch =
      s.noSuratAsal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesKlasifikasi = filterKlasifikasi === 'ALL' || s.kodeKlasifikasi === filterKlasifikasi;
    const matchesKeamanan = filterKeamanan === 'ALL' || s.tingkatKeamanan === filterKeamanan;

    return matchesSearch && matchesKlasifikasi && matchesKeamanan;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pencatatan Surat Masuk</h2>
          <p className="text-xs text-slate-500">Kelola agenda surat masuk, klasifikasi, dan unggah berkas fisik digital.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Surat Masuk
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat, pengirim, atau perihal..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterKlasifikasi}
          onChange={(e) => setFilterKlasifikasi(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Semua Klasifikasi</option>
          {klasifikasiList.map(k => (
            <option key={k.kode} value={k.kode}>{k.kode} - {k.namaKlasifikasi}</option>
          ))}
        </select>

        <select
          value={filterKeamanan}
          onChange={(e) => setFilterKeamanan(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Semua Tingkat Keamanan</option>
          <option value="Biasa">Biasa</option>
          <option value="Penting">Penting</option>
          <option value="Rahasia">Rahasia</option>
        </select>
      </div>

      {/* Surat Masuk Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Agenda / ID</th>
                <th className="py-3.5 px-4">No. Surat Asal</th>
                <th className="py-3.5 px-4">Tanggal & Pengirim</th>
                <th className="py-3.5 px-4">Perihal</th>
                <th className="py-3.5 px-4">Klasifikasi</th>
                <th className="py-3.5 px-4">Status Disposisi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSurat.length > 0 ? (
                filteredSurat.map(surat => (
                  <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">#{surat.noAgenda}</div>
                      <div className="text-slate-400 text-[11px]">{surat.id}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                      {surat.noSuratAsal}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{surat.pengirim}</div>
                      <div className="text-slate-400 text-[11px]">Terima: {surat.tanggalTerima}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-2">{surat.perihal}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded font-semibold ${
                        surat.tingkatKeamanan === 'Rahasia' ? 'bg-rose-50 text-rose-700' :
                        surat.tingkatKeamanan === 'Penting' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {surat.tingkatKeamanan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800 font-medium">
                        {surat.kodeKlasifikasi}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        surat.statusDisposisi === 'Sudah' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {surat.statusDisposisi === 'Sudah' ? 'Terdisposisi' : 'Belum Disposisi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <a
                        href={surat.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        title="Unduh / Lihat Berkas"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Berkas
                      </a>
                      <button
                        onClick={() => setSelectedSuratForDisposisi(surat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Disposisi
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data surat masuk yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Surat Masuk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Pencatatan Surat Masuk Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSaveSurat} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Surat Asal *</label>
                  <input
                    type="text"
                    required
                    value={noSuratAsal}
                    onChange={(e) => setNoSuratAsal(e.target.value)}
                    placeholder="Contoh: 421/1234/DISDIK/2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asal Pengirim *</label>
                  <input
                    type="text"
                    required
                    value={pengirim}
                    onChange={(e) => setPengirim(e.target.value)}
                    placeholder="Contoh: Dinas Pendidikan Provinsi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Terima *</label>
                  <input
                    type="date"
                    required
                    value={tanggalTerima}
                    onChange={(e) => setTanggalTerima(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perihal / Isi Ringkas *</label>
                <textarea
                  required
                  rows={3}
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  placeholder="Tuliskan perihal surat secara lengkap..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Klasifikasi Surat</label>
                  <select
                    value={kodeKlasifikasi}
                    onChange={(e) => setKodeKlasifikasi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {klasifikasiList.map(k => (
                      <option key={k.kode} value={k.kode}>{k.kode} - {k.namaKlasifikasi}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Keamanan</label>
                  <select
                    value={tingkatKeamanan}
                    onChange={(e) => setTingkatKeamanan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unggah Berkas Fisik (PDF / Scan)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {fileData && (
                  <p className="text-emerald-600 mt-1 font-medium">File terpilih: {fileData.fileName}</p>
                )}
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
                  Simpan Surat Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Buat Disposisi */}
      {selectedSuratForDisposisi && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Buat Lembar Disposisi Digital</h3>
                <p className="text-xs text-slate-500 font-mono">Surat: {selectedSuratForDisposisi.noSuratAsal}</p>
              </div>
              <button onClick={() => setSelectedSuratForDisposisi(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs text-slate-700 border border-slate-200">
              <div className="font-semibold text-slate-900 mb-1">{selectedSuratForDisposisi.perihal}</div>
              <div className="text-slate-500">Pengirim: {selectedSuratForDisposisi.pengirim}</div>
            </div>

            <form onSubmit={handleSaveDisposisi} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pegawai / Guru Tujuan Disposisi *</label>
                <select
                  value={pegawaiTujuanId}
                  onChange={(e) => setPegawaiTujuanId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  {pegawaiList.map(p => (
                    <option key={p.id} value={p.id}>{p.namaLengkap} — ({p.jabatan})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruksi Pimpinan *</label>
                <select
                  value={instruksi}
                  onChange={(e) => setInstruksi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tindak lanjuti">Tindak lanjuti</option>
                  <option value="Tanggapi">Tanggapi</option>
                  <option value="Hadiri">Hadiri</option>
                  <option value="Siapkan Bahan">Siapkan Bahan</option>
                  <option value="Arsip">Arsip</option>
                  <option value="Untuk Diketahui">Untuk Diketahui</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batas Waktu (Deadline) *</label>
                <input
                  type="date"
                  required
                  value={batasWaktu}
                  onChange={(e) => setBatasWaktu(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan Pimpinan</label>
                <textarea
                  rows={3}
                  value={catatanPimpinan}
                  onChange={(e) => setCatatanPimpinan(e.target.value)}
                  placeholder="Catatan khusus arahan pimpinan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-[11px] flex items-start gap-2">
                <Send className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Notifikasi WhatsApp Sidobe akan otomatis dikirimkan ke nomor WhatsApp pegawai tujuan saat disposisi disimpan.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSuratForDisposisi(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-md shadow-emerald-600/20 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Kirim Disposisi & WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
