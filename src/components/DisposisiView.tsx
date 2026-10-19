import React, { useState } from 'react';
import { FileText, Send, CheckCircle2, AlertCircle, Printer, Smartphone, Search, Clock, UserCheck } from 'lucide-react';
import { Disposisi, Konfigurasi } from '../types';

interface DisposisiViewProps {
  disposisiList: Disposisi[];
  config: Konfigurasi;
  onUpdateTindakLanjut: (id: string, status: 'Pending' | 'Selesai') => void;
  onResendWhatsApp: (disposisi: Disposisi) => void;
}

export const DisposisiView: React.FC<DisposisiViewProps> = ({
  disposisiList,
  config,
  onUpdateTindakLanjut,
  onResendWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForPrint, setSelectedForPrint] = useState<Disposisi | null>(null);

  const filtered = disposisiList.filter(d =>
    d.noSuratAsal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.namaPegawaiTujuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.instruksi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lembar Disposisi Digital</h2>
          <p className="text-xs text-slate-500">Monitoring instruksi pimpinan dan status pengiriman notifikasi WhatsApp Sidobe.</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan no surat, pegawai tujuan, instruksi, atau perihal..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Disposisi Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">ID / No. Surat Asal</th>
                <th className="py-3.5 px-4">Pegawai Tujuan</th>
                <th className="py-3.5 px-4">Instruksi & Catatan</th>
                <th className="py-3.5 px-4">Batas Waktu</th>
                <th className="py-3.5 px-4">Status WhatsApp</th>
                <th className="py-3.5 px-4">Tindak Lanjut</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">{item.id}</div>
                      <div className="text-emerald-700 text-[11px]">{item.noSuratAsal}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.namaPegawaiTujuan}</div>
                      <div className="text-slate-400 text-[11px] font-mono">WA: {item.noWaTujuan}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded mr-1.5">
                        {item.instruksi}
                      </span>
                      <div className="text-slate-600 text-[11px] mt-1 line-clamp-2">{item.catatanPimpinan || '-'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-900">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {item.batasWaktu}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        item.statusWhatsApp === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        <Smartphone className="w-3 h-3" />
                        {item.statusWhatsApp}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.waMessageId || 'Gagal terkirim'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.statusTindakLanjut}
                        onChange={(e) => onUpdateTindakLanjut(item.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none ${
                          item.statusTindakLanjut === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedForPrint(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        title="Cetak Lembar Disposisi"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        Cetak
                      </button>
                      <button
                        onClick={() => onResendWhatsApp(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-xs"
                        title="Kirim Ulang WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                        WA
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data lembar disposisi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT / PREVIEW MODAL LEMBAR DISPOSISI */}
      {selectedForPrint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[95vh] text-slate-900 print:shadow-none print:p-0">
            
            {/* Print Header Action Buttons (Hidden when printing) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
              <h3 className="font-bold text-lg text-slate-900">Pratinjau Lembar Disposisi Resmi</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Lembar Disposisi
                </button>
                <button
                  onClick={() => setSelectedForPrint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Official Sheet Layout */}
            <div className="border-2 border-slate-900 p-6 space-y-4 font-sans text-xs bg-white">
              {/* Header Institution */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="font-bold text-sm uppercase tracking-wider">{config.namaSekolah}</div>
                <div className="text-slate-600 text-[11px]">{config.alamatSch || config.alamatSekolah}</div>
                <div className="text-base font-extrabold uppercase tracking-widest mt-2">LEMBAR DISPOSISI DIGITAL</div>
              </div>

              {/* Meta Surat Info */}
              <table className="w-full border-collapse border border-slate-800 text-xs">
                <tbody>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold bg-slate-100 w-1/3">No. Agenda / ID Disposisi</td>
                    <td className="border border-slate-800 p-2 font-mono">{selectedForPrint.id}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold bg-slate-100">Surat Dari (Pengirim)</td>
                    <td className="border border-slate-800 p-2">{selectedForPrint.perihal}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold bg-slate-100">Nomor & Tanggal Surat Asal</td>
                    <td className="border border-slate-800 p-2 font-mono">{selectedForPrint.noSuratAsal}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold bg-slate-100">Tanggal Diterima</td>
                    <td className="border border-slate-800 p-2">{selectedForPrint.tanggalDisposisi}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-semibold bg-slate-100">Perihal</td>
                    <td className="border border-slate-800 p-2 font-semibold">{selectedForPrint.perihal}</td>
                  </tr>
                </tbody>
              </table>

              {/* Disposition Details */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-800 p-3">
                  <div className="font-bold mb-1 border-b border-slate-800 pb-1">Diteruskan Kepada:</div>
                  <div className="text-sm font-semibold text-emerald-800 mt-2">{selectedForPrint.namaPegawaiTujuan}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">WhatsApp: {selectedForPrint.noWaTujuan}</div>
                </div>

                <div className="border border-slate-800 p-3">
                  <div className="font-bold mb-1 border-b border-slate-800 pb-1">Batas Waktu (Deadline):</div>
                  <div className="text-sm font-bold text-rose-600 mt-2">{selectedForPrint.batasWaktu}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">Status: {selectedForPrint.statusTindakLanjut}</div>
                </div>
              </div>

              <div className="border border-slate-800 p-3">
                <div className="font-bold mb-1 border-b border-slate-800 pb-1">Instruksi Pimpinan:</div>
                <div className="text-sm font-bold text-slate-900 bg-slate-100 p-2 rounded mt-1">
                  👉 {selectedForPrint.instruksi}
                </div>
              </div>

              <div className="border border-slate-800 p-3">
                <div className="font-bold mb-1 border-b border-slate-800 pb-1">Catatan Tambahan Pimpinan:</div>
                <div className="text-slate-800 min-h-[50px] italic mt-1">
                  "{selectedForPrint.catatanPimpinan || 'Tidak ada catatan tambahan.'}"
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-6 text-center">
                <div>
                  <div className="text-slate-600">Paraf Staf / Agenda</div>
                  <div className="h-16"></div>
                  <div className="font-semibold underline">Staf Tata Usaha</div>
                </div>
                <div>
                  <div className="text-slate-600">Kepala Sekolah</div>
                  <div className="h-16"></div>
                  <div className="font-semibold underline">{config.namaKepalaSekolah}</div>
                  <div className="text-[10px] text-slate-500 font-mono">NIP. {config.nipKepalaSekolah}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
