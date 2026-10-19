import React, { useState } from 'react';
import { Users, Plus, Smartphone, Search, UserCheck } from 'lucide-react';
import { Pegawai } from '../types';

interface PegawaiViewProps {
  pegawaiList: Pegawai[];
  onAddPegawai: (pegawai: Omit<Pegawai, 'id'>) => void;
}

export const PegawaiView: React.FC<PegawaiViewProps> = ({ pegawaiList, onAddPegawai }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nipNuptk, setNipNuptk] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jabatan, setJabatan] = useState('Guru Mapel');
  const [noWhatsApp, setNoWhatsApp] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap || !noWhatsApp) {
      alert('Nama lengkap dan nomor WhatsApp wajib diisi.');
      return;
    }

    onAddPegawai({
      nipNuptk: nipNuptk || '-',
      namaLengkap,
      jabatan,
      noWhatsApp: noWhatsApp.replace(/[^0-9]/g, ''),
      status,
    });

    setIsModalOpen(false);
    setNipNuptk('');
    setNamaLengkap('');
    setNoWhatsApp('');
  };

  const filtered = pegawaiList.filter(p =>
    p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nipNuptk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.noWhatsApp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Data Pegawai & Guru (Penerima Disposisi)</h2>
          <p className="text-xs text-slate-500">Manajemen daftar guru dan staf tata usaha yang terintegrasi dengan WhatsApp.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Pegawai / Guru
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
            placeholder="Cari nama pegawai, NIP/NUPTK, jabatan, atau nomor WhatsApp..."
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
                <th className="py-3.5 px-4">ID & Nama Lengkap</th>
                <th className="py-3.5 px-4">NIP / NUPTK</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4">Nomor WhatsApp</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.length > 0 ? (
                filtered.map(pegawai => (
                  <tr key={pegawai.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{pegawai.namaLengkap}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{pegawai.id}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{pegawai.nipNuptk}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                        {pegawai.jabatan}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        +{pegawai.noWhatsApp}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {pegawai.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada data pegawai yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Pegawai */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Tambah Pegawai / Guru Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Dra. Hj. Nurul Hidayah, M.Pd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP / NUPTK</label>
                <input
                  type="text"
                  value={nipNuptk}
                  onChange={(e) => setNipNuptk(e.target.value)}
                  placeholder="Contoh: 197205121998032001"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan *</label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Waka Kurikulum / Guru Matematika / Staf TU"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp (Format: 628...) *</label>
                <input
                  type="text"
                  required
                  value={noWhatsApp}
                  onChange={(e) => setNoWhatsApp(e.target.value)}
                  placeholder="Contoh: 6281234567890"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
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
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
