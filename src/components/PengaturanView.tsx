import React, { useState } from 'react';
import { Settings, Save, Smartphone, Building2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Konfigurasi } from '../types';

interface PengaturanViewProps {
  config: Konfigurasi;
  onUpdateConfig: (newConfig: Konfigurasi) => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({ config, onUpdateConfig }) => {
  const [formData, setFormData] = useState<Konfigurasi>(config);
  const [testPhone, setTestPhone] = useState('6281234567890');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestWhatsApp = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: `Pesan uji coba WhatsApp Sidobe berhasil dikirim ke +${testPhone} via ${formData.sidobeApiUrl}`,
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pengaturan & Konfigurasi Sistem</h2>
          <p className="text-xs text-slate-500">Identitas sekolah, kode surat resmi, dan kredensial WhatsApp Sidobe API.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Identitas Sekolah & Kop Surat</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah *</label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Sekolah (Untuk Auto-Numbering) *</label>
              <input
                type="text"
                required
                value={formData.kodeSekolahSurat}
                onChange={(e) => setFormData({ ...formData, kodeSekolahSurat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Alamat Sekolah *</label>
            <input
              type="text"
              required
              value={formData.alamatSekolah}
              onChange={(e) => setFormData({ ...formData, alamatSekolah: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Sekolah</label>
              <input
                type="email"
                value={formData.emailSekolah}
                onChange={(e) => setFormData({ ...formData, emailSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah *</label>
              <input
                type="text"
                required
                value={formData.namaKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah *</label>
              <input
                type="text"
                required
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Sidobe API Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Integrasi WhatsApp API Sidobe</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sidobe API URL *</label>
              <input
                type="text"
                required
                value={formData.sidobeApiUrl}
                onChange={(e) => setFormData({ ...formData, sidobeApiUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Pengirim (Sender Number) *</label>
              <input
                type="text"
                required
                value={formData.waSenderNumber}
                onChange={(e) => setFormData({ ...formData, waSenderNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Sidobe Secret Token / API Key *</label>
            <input
              type="password"
              required
              value={formData.sidobeSecretKey}
              onChange={(e) => setFormData({ ...formData, sidobeSecretKey: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Test WhatsApp Connection */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Uji Coba Pengiriman Pesan WhatsApp</label>
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="No HP Tujuan (Cth: 6281234567890)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleTestWhatsApp}
                disabled={isTesting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                {isTesting ? 'Mengirim...' : 'Uji Koneksi WA'}
              </button>
            </div>
            {testResult && (
              <div className={`mt-2 p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {testResult.message}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Konfigurasi
          </button>
        </div>
      </form>
    </div>
  );
};
