import React from 'react';
import { Mail, Send, FileText, Users, Tag, Settings, LayoutDashboard, ShieldCheck, Code, Smartphone } from 'lucide-react';
import { Konfigurasi } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config: Konfigurasi;
  onOpenAppsScriptModal: () => void;
  onOpenVerifyPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenAppsScriptModal,
  onOpenVerifyPortal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'surat_masuk', label: 'Surat Masuk', icon: Mail },
    { id: 'disposisi', label: 'Lembar Disposisi', icon: FileText },
    { id: 'surat_keluar', label: 'Surat Keluar', icon: Send },
    { id: 'pegawai', label: 'Data Pegawai', icon: Users },
    { id: 'klasifikasi', label: 'Klasifikasi', icon: Tag },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 tracking-tight leading-tight">
                SIMAS <span className="text-xs font-normal text-slate-500 hidden sm:inline">| {config.namaSekolah}</span>
              </h1>
              <p className="text-xs text-slate-500">Manajemen Surat & Disposisi Digital</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenVerifyPortal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="Portal Publik Verifikasi Surat QR"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cek QR Surat</span>
            </button>

            <button
              onClick={onOpenAppsScriptModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
              title="Google Apps Script Source Code"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Export Code.gs</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="flex xl:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
