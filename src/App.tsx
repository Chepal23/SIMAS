import React, { useState, useEffect } from 'react';
import {
  initialConfig,
  initialKlasifikasi,
  initialPegawai,
  initialSuratMasuk,
  initialDisposisi,
  initialSuratKeluar,
  getRomanMonth,
} from './mockData';
import { SuratMasuk, Disposisi, SuratKeluar, Pegawai, Klasifikasi, Konfigurasi } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SuratMasukView } from './components/SuratMasukView';
import { DisposisiView } from './components/DisposisiView';
import { SuratKeluarView } from './components/SuratKeluarView';
import { PegawaiView } from './components/PegawaiView';
import { KlasifikasiView } from './components/KlasifikasiView';
import { PengaturanView } from './components/PengaturanView';
import { VerifyPortal } from './components/VerifyPortal';
import { AppsScriptExportModal } from './components/AppsScriptExportModal';

export default function App() {
  // Load state from localStorage or defaults
  const [config, setConfig] = useState<Konfigurasi>(() => {
    const saved = localStorage.getItem('simas_config');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const [klasifikasiList, setKlasifikasiList] = useState<Klasifikasi[]>(() => {
    const saved = localStorage.getItem('simas_klasifikasi');
    return saved ? JSON.parse(saved) : initialKlasifikasi;
  });

  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(() => {
    const saved = localStorage.getItem('simas_pegawai');
    return saved ? JSON.parse(saved) : initialPegawai;
  });

  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => {
    const saved = localStorage.getItem('simas_surat_masuk');
    return saved ? JSON.parse(saved) : initialSuratMasuk;
  });

  const [disposisiList, setDisposisiList] = useState<Disposisi[]>(() => {
    const saved = localStorage.getItem('simas_disposisi');
    return saved ? JSON.parse(saved) : initialDisposisi;
  });

  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => {
    const saved = localStorage.getItem('simas_surat_keluar');
    return saved ? JSON.parse(saved) : initialSuratKeluar;
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);
  const [isSuratMasukModalOpen, setIsSuratMasukModalOpen] = useState(false);

  // Check URL query for verification portal (?page=verify&code=...)
  const [verifyCodeQuery, setVerifyCodeQuery] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const code = params.get('code');
    if (page === 'verify') {
      setActiveTab('verify');
      if (code) setVerifyCodeQuery(code);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('simas_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('simas_klasifikasi', JSON.stringify(klasifikasiList));
  }, [klasifikasiList]);

  useEffect(() => {
    localStorage.setItem('simas_pegawai', JSON.stringify(pegawaiList));
  }, [pegawaiList]);

  useEffect(() => {
    localStorage.setItem('simas_surat_masuk', JSON.stringify(suratMasukList));
  }, [suratMasukList]);

  useEffect(() => {
    localStorage.setItem('simas_disposisi', JSON.stringify(disposisiList));
  }, [disposisiList]);

  useEffect(() => {
    localStorage.setItem('simas_surat_keluar', JSON.stringify(suratKeluarList));
  }, [suratKeluarList]);

  // Handlers
  const handleAddSuratMasuk = (suratData: Omit<SuratMasuk, 'id' | 'noAgenda' | 'createdAt' | 'statusDisposisi'>) => {
    const idNum = suratMasukList.length + 1;
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const newId = `SM-${dateStr}-${String(idNum).padStart(4, '0')}`;
    const newAgenda = suratMasukList.length > 0 ? Math.max(...suratMasukList.map(s => s.noAgenda)) + 1 : 1;

    const newSurat: SuratMasuk = {
      ...suratData,
      id: newId,
      noAgenda: newAgenda,
      statusDisposisi: 'Belum',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setSuratMasukList([newSurat, ...suratMasukList]);
  };

  const handleCreateDisposisi = (disposisiData: Omit<Disposisi, 'id' | 'createdAt' | 'statusWhatsApp' | 'waMessageId'>) => {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const idNum = disposisiList.length + 1;
    const newId = `DSP-${dateStr}-${String(idNum).padStart(4, '0')}`;
    const messageId = `sdb_msg_${Math.random().toString(36).substring(2, 15)}`;

    const newDisposisi: Disposisi = {
      ...disposisiData,
      id: newId,
      statusWhatsApp: 'SUCCESS',
      waMessageId: messageId,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    // Update surat masuk status disposisi
    setSuratMasukList(prev =>
      prev.map(s => (s.id === disposisiData.idSuratMasuk ? { ...s, statusDisposisi: 'Sudah' } : s))
    );

    setDisposisiList([newDisposisi, ...disposisiList]);
  };

  const handleUpdateTindakLanjut = (id: string, status: 'Pending' | 'Selesai') => {
    setDisposisiList(prev =>
      prev.map(d => (d.id === id ? { ...d, statusTindakLanjut: status } : d))
    );
  };

  const handleResendWhatsApp = (disposisi: Disposisi) => {
    alert(`Berhasil mengirim ulang notifikasi WhatsApp Sidobe ke +${disposisi.noWaTujuan} untuk Disposisi ${disposisi.id}`);
  };

  const handleAddSuratKeluar = (suratData: Omit<SuratKeluar, 'id' | 'noAgendaKeluar' | 'noSuratResmi' | 'qrVerifyCode' | 'createdAt'>) => {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const idNum = suratKeluarList.length + 1;
    const newId = `SK-${dateStr}-${String(idNum).padStart(4, '0')}`;
    const noAgendaKeluar = suratKeluarList.length > 0 ? Math.max(...suratKeluarList.map(s => s.noAgendaKeluar)) + 1 : 1;
    const noUrutStr = String(noAgendaKeluar).padStart(3, '0');
    
    const romanMon = getRomanMonth(new Date().getMonth() + 1);
    const currentYear = new Date().getFullYear();
    const noResmi = `${suratData.kodeKlasifikasi}/${noUrutStr}/${config.kodeSekolahSurat}/${romanMon}/${currentYear}`;
    const verifyCode = `SIMAS-SK-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newSurat: SuratKeluar = {
      ...suratData,
      id: newId,
      noAgendaKeluar,
      noSuratResmi: noResmi,
      qrVerifyCode: verifyCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setSuratKeluarList([newSurat, ...suratKeluarList]);
  };

  const handleAddPegawai = (pegawaiData: Omit<Pegawai, 'id'>) => {
    const idNum = pegawaiList.length + 1;
    const newPegawai: Pegawai = {
      ...pegawaiData,
      id: `PEG-${String(idNum).padStart(3, '0')}`,
    };
    setPegawaiList([...pegawaiList, newPegawai]);
  };

  const handleAddKlasifikasi = (klasifikasiData: Klasifikasi) => {
    setKlasifikasiList([...klasifikasiList, klasifikasiData]);
  };

  // If verify portal route
  if (activeTab === 'verify') {
    return (
      <VerifyPortal
        verifyCode={verifyCodeQuery}
        suratKeluarList={suratKeluarList}
        config={config}
        onBackToApp={() => {
          setActiveTab('dashboard');
          window.history.pushState({}, '', window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenAppsScriptModal={() => setIsAppsScriptModalOpen(true)}
        onOpenVerifyPortal={() => setActiveTab('verify')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            suratMasukList={suratMasukList}
            disposisiList={disposisiList}
            suratKeluarList={suratKeluarList}
            config={config}
            setActiveTab={setActiveTab}
            onOpenNewSuratMasuk={() => setIsSuratMasukModalOpen(true)}
            onOpenNewSuratKeluar={() => setActiveTab('surat_keluar')}
          />
        )}

        {activeTab === 'surat_masuk' && (
          <SuratMasukView
            suratMasukList={suratMasukList}
            klasifikasiList={klasifikasiList}
            pegawaiList={pegawaiList}
            onAddSuratMasuk={handleAddSuratMasuk}
            onCreateDisposisi={handleCreateDisposisi}
            isModalOpen={isSuratMasukModalOpen}
            setIsModalOpen={setIsSuratMasukModalOpen}
          />
        )}

        {activeTab === 'disposisi' && (
          <DisposisiView
            disposisiList={disposisiList}
            config={config}
            onUpdateTindakLanjut={handleUpdateTindakLanjut}
            onResendWhatsApp={handleResendWhatsApp}
          />
        )}

        {activeTab === 'surat_keluar' && (
          <SuratKeluarView
            suratKeluarList={suratKeluarList}
            klasifikasiList={klasifikasiList}
            config={config}
            onAddSuratKeluar={handleAddSuratKeluar}
          />
        )}

        {activeTab === 'pegawai' && (
          <PegawaiView
            pegawaiList={pegawaiList}
            onAddPegawai={handleAddPegawai}
          />
        )}

        {activeTab === 'klasifikasi' && (
          <KlasifikasiView
            klasifikasiList={klasifikasiList}
            onAddKlasifikasi={handleAddKlasifikasi}
          />
        )}

        {activeTab === 'pengaturan' && (
          <PengaturanView
            config={config}
            onUpdateConfig={setConfig}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {config.namaSekolah}. SIMAS (Sistem Informasi Manajemen Surat & Disposisi Digital). Powered by Google Apps Script & WhatsApp Sidobe.
      </footer>

      {/* Apps Script Code Modal */}
      {isAppsScriptModalOpen && (
        <AppsScriptExportModal
          config={config}
          onClose={() => setIsAppsScriptModalOpen(false)}
        />
      )}
    </div>
  );
}
