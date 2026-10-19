import React from 'react';
import { Mail, Send, FileText, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Smartphone, Plus, RefreshCw, BarChart3 } from 'lucide-react';
import { SuratMasuk, Disposisi, SuratKeluar, Konfigurasi } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface DashboardProps {
  suratMasukList: SuratMasuk[];
  disposisiList: Disposisi[];
  suratKeluarList: SuratKeluar[];
  config: Konfigurasi;
  setActiveTab: (tab: string) => void;
  onOpenNewSuratMasuk: () => void;
  onOpenNewSuratKeluar: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  suratMasukList,
  disposisiList,
  suratKeluarList,
  config,
  setActiveTab,
  onOpenNewSuratMasuk,
  onOpenNewSuratKeluar,
}) => {
  const suratMasukBelumDisposisi = suratMasukList.filter(s => s.statusDisposisi === 'Belum').length;
  const disposisiPending = disposisiList.filter(d => d.statusTindakLanjut === 'Pending').length;
  const waSuccessCount = disposisiList.filter(d => d.statusWhatsApp === 'SUCCESS').length;

  // Prepare monthly aggregated data for Recharts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyStatsMap: { [key: string]: { month: string; suratMasuk: number; suratKeluar: number } } = {};

  // Initialize all 12 months
  monthNames.forEach((m, idx) => {
    const key = String(idx + 1).padStart(2, '0');
    monthlyStatsMap[key] = { month: m, suratMasuk: 0, suratKeluar: 0 };
  });

  suratMasukList.forEach(s => {
    const parts = s.tanggalTerima.split('-');
    if (parts.length >= 2) {
      const mKey = parts[1];
      if (monthlyStatsMap[mKey]) {
        monthlyStatsMap[mKey].suratMasuk += 1;
      }
    }
  });

  suratKeluarList.forEach(s => {
    const parts = s.tanggalSurat.split('-');
    if (parts.length >= 2) {
      const mKey = parts[1];
      if (monthlyStatsMap[mKey]) {
        monthlyStatsMap[mKey].suratKeluar += 1;
      }
    }
  });

  const chartData = Object.values(monthlyStatsMap);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Informasi Tata Usaha & Kearsipan Digital</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Selamat Datang di SIMAS, {config.namaSekolah}
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mb-6">
            Kelola surat masuk, surat keluar dengan auto-numbering resmi dinas, lembar disposisi digital, dan pengiriman notifikasi WhatsApp Sidobe otomatis secara terpusat.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewSuratMasuk}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Catat Surat Masuk Baru
            </button>
            <button
              onClick={onOpenNewSuratKeluar}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <Send className="w-4 h-4" />
              Terbitkan Surat Keluar
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => setActiveTab('surat_masuk')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              {suratMasukBelumDisposisi} Belum Disposisi
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{suratMasukList.length}</div>
          <div className="text-xs text-slate-500 mt-1">Total Surat Masuk Tercatat</div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => setActiveTab('disposisi')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
              {disposisiPending} Pending Tindak Lanjut
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{disposisiList.length}</div>
          <div className="text-xs text-slate-500 mt-1">Lembar Disposisi Digital</div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => setActiveTab('surat_keluar')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              Auto-Numbering
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{suratKeluarList.length}</div>
          <div className="text-xs text-slate-500 mt-1">Surat Keluar Terbit</div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => setActiveTab('pengaturan')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              Sidobe API
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{waSuccessCount} / {disposisiList.length}</div>
          <div className="text-xs text-slate-500 mt-1">Notifikasi WhatsApp Sukses</div>
        </div>
      </div>

      {/* Recharts Bar Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Grafik Tren Surat Masuk & Surat Keluar Bulanan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Perbandingan volume arsip surat masuk dan surat keluar setiap bulan pada tahun berjalan.</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', border: 'none', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="suratMasuk" name="Surat Masuk" fill="#059669" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="suratKeluar" name="Surat Keluar" fill="#d97706" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Surat Masuk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Surat Masuk Terbaru</h3>
            <button
              onClick={() => setActiveTab('surat_masuk')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {suratMasukList.slice(0, 4).map(surat => (
              <div key={surat.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-medium text-emerald-700">{surat.noSuratAsal}</div>
                  <div className="text-sm font-semibold text-slate-900 line-clamp-1">{surat.perihal}</div>
                  <div className="text-xs text-slate-500">{surat.pengirim} · Terima: {surat.tanggalTerima}</div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${
                  surat.statusDisposisi === 'Sudah' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {surat.statusDisposisi === 'Sudah' ? 'Terdisposisi' : 'Belum Disposisi'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Surat Keluar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Surat Keluar Terbaru</h3>
            <button
              onClick={() => setActiveTab('surat_keluar')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {suratKeluarList.slice(0, 4).map(surat => (
              <div key={surat.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-medium text-amber-700">{surat.noSuratResmi}</div>
                  <div className="text-sm font-semibold text-slate-900 line-clamp-1">{surat.perihal}</div>
                  <div className="text-xs text-slate-500">Tujuan: {surat.tujuanPenerima} · {surat.tanggalSurat}</div>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 shrink-0">
                  {surat.statusArsip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
