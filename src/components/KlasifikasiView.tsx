import React, { useState } from 'react';
import { Tag, Plus, Search } from 'lucide-react';
import { Klasifikasi } from '../types';

interface KlasifikasiViewProps {
  klasifikasiList: Klasifikasi[];
  onAddKlasifikasi: (klasifikasi: Klasifikasi) => void;
}

export const KlasifikasiView: React.FC<KlasifikasiViewProps> = ({ klasifikasiList, onAddKlasifikasi }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [kode, setKode] = useState('');
  const [namaKlasifikasi, setNamaKlasifikasi] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode || !namaKlasifikasi) {
      alert('Kode dan nama klasifikasi wajib diisi.');
      return;
    }

    onAddKlasifikasi({ kode, namaKlasifikasi, keterangan });
    setIsModalOpen(false);
    setKode('');
    setNamaKlasifikasi('');
    setKeterangan('');
  };

  const filtered = klasifikasiList.filter(k =>
    k.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.namaKlasifikasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Data Klasifikasi Surat</h2>
          <p className="text-xs text-slate-500">Pengaturan kode klasifikasi arsip surat sekolah berdasarkan standar administrasi.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Klasifikasi Baru
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
            placeholder="Cari kode klasifikasi atau nama..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Kode Klasifikasi</th>
                <th className="py-3.5 px-4">Nama Klasifikasi</th>
                <th className="py-3.5 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <tr key={item.kode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{item.kode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.namaKlasifikasi}</td>
                    <td className="py-3 px-4 text-slate-500">{item.keterangan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    Tidak ada klasifikasi surat yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Klasifikasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Tambah Kode Klasifikasi</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Klasifikasi *</label>
                <input
                  type="text"
                  required
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: 421.4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Klasifikasi *</label>
                <input
                  type="text"
                  required
                  value={namaKlasifikasi}
                  onChange={(e) => setNamaKlasifikasi(e.target.value)}
                  placeholder="Contoh: Hubungan Masyarakat & Alumni"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Deskripsi</label>
                <textarea
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan singkat perihal klasifikasi surat ini..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                />
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
                  Simpan Klasifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
