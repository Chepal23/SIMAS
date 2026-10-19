import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal, HelpCircle } from 'lucide-react';
import { Konfigurasi } from '../types';

interface AppsScriptExportModalProps {
  config: Konfigurasi;
  onClose: () => void;
}

export const AppsScriptExportModal: React.FC<AppsScriptExportModalProps> = ({ config, onClose }) => {
  const [activeTab, setActiveTab] = useState<'code_gs' | 'index_html' | 'guide'>('code_gs');
  const [copied, setCopied] = useState(false);

  const codeGsContent = `/**
 * @license
 * SIMAS - Sistem Informasi Manajemen Surat Masuk, Surat Keluar, & Disposisi Sekolah
 * Backend Google Apps Script (V8 Runtime)
 * Terintegrasi dengan Google Drive (Container-Bound Folder) & WhatsApp Sidobe API
 */

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (params.page === 'verify') {
    // Return HTML or template for public verification
    const template = HtmlService.createTemplateFromFile('Index');
    template.verifyCode = params.code || '';
    return template.evaluate()
      .setTitle('Verifikasi Dokumen Resmi - ' + getSpreadsheetConfig().namaSekolah)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('SIMAS - ' + getSpreadsheetConfig().namaSekolah)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Spreadsheet aktif tidak ditemukan. Pastikan Apps Script dibuat via Extensions -> Apps Script.');
  }
  return ss;
}

function getSpreadsheetConfig() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Konfigurasi');
  if (!sheet) {
    initializeDatabase();
    sheet = ss.getSheetByName('Konfigurasi');
  }
  const data = sheet.getDataRange().getValues();
  const config = {
    namaSekolah: '${config.namaSekolah}',
    kodeSekolahSurat: '${config.kodeSekolahSurat}',
    alamatSekolah: '${config.alamatSekolah}',
    emailSekolah: '${config.emailSekolah}',
    namaKepalaSekolah: '${config.namaKepalaSekolah}',
    nipKepalaSekolah: '${config.nipKepalaSekolah}',
    sidobeApiUrl: '${config.sidobeApiUrl}',
    sidobeSecretKey: '${config.sidobeSecretKey}',
    waSenderNumber: '${config.waSenderNumber}'
  };
  return config;
}

function getAppStorageFolder(subFolderName) {
  const ss = getSpreadsheet();
  const ssFile = DriveApp.getFileById(ss.getId());
  const parents = ssFile.getParents();
  
  let targetParentFolder;
  if (parents.hasNext()) {
    targetParentFolder = parents.next();
  } else {
    targetParentFolder = DriveApp.getRootFolder();
  }
  
  const existingFolders = targetParentFolder.getFoldersByName(subFolderName);
  if (existingFolders.hasNext()) {
    return existingFolders.next();
  }
  return targetParentFolder.createFolder(subFolderName);
}

function initializeDatabase() {
  const ss = getSpreadsheet();
  const sheetsDef = [
    { name: 'Data_Surat_Masuk', headers: ['ID_Surat', 'No_Agenda', 'No_Surat_Asal', 'Tanggal_Surat', 'Tanggal_Terima', 'Pengirim', 'Perihal', 'Kode_Klasifikasi', 'Tingkat_Keamanan', 'File_URL', 'File_ID', 'Status_Disposisi', 'Created_At', 'Created_By'] },
    { name: 'Data_Disposisi', headers: ['ID_Disposisi', 'ID_Surat_Masuk', 'No_Surat_Asal', 'Perihal', 'Tanggal_Disposisi', 'Batas_Waktu', 'Instruksi', 'Catatan_Pimpinan', 'ID_Pegawai_Tujuan', 'Nama_Pegawai_Tujuan', 'No_WA_Tujuan', 'Status_WhatsApp', 'WA_Message_ID', 'Status_Tindak_Lanjut', 'Created_At'] },
    { name: 'Data_Surat_Keluar', headers: ['ID_Surat_Keluar', 'No_Agenda_Keluar', 'No_Surat_Resmi', 'Tanggal_Surat', 'Tujuan_Penerima', 'Perihal', 'Kode_Klasifikasi', 'Penandatangan', 'File_URL', 'File_ID', 'QR_Verify_Code', 'Status_Arsip', 'Created_At', 'Created_By'] },
    { name: 'Data_Pegawai_Guru', headers: ['ID_Pegawai', 'NIP_NUPTK', 'Nama_Lengkap', 'Jabatan', 'No_WhatsApp', 'Status'] },
    { name: 'Data_Klasifikasi', headers: ['Kode', 'Nama_Klasifikasi', 'Keterangan'] },
    { name: 'Konfigurasi', headers: ['Key', 'Value', 'Keterangan'] }
  ];

  sheetsDef.forEach(def => {
    let sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
      sheet.appendRow(def.headers);
      sheet.getRange(1, 1, 1, def.headers.length).setFontWeight('bold').setBackground('#f3f4f6');
    }
  });
  
  return 'Database berhasil diinisialisasi secara idempotent!';
}

function saveIncomingLetterWithFile(data, fileObj) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Data_Surat_Masuk');
  if (!sheet) {
    initializeDatabase();
    sheet = ss.getSheetByName('Data_Surat_Masuk');
  }

  let fileUrl = '';
  let fileId = '';
  if (fileObj && fileObj.base64Data) {
    const decodedBlob = Utilities.newBlob(Utilities.base64Decode(fileObj.base64Data), fileObj.mimeType, fileObj.fileName);
    const targetFolder = getAppStorageFolder('Berkas_Surat_Masuk');
    const file = targetFolder.createFile(decodedBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    fileUrl = file.getUrl();
    fileId = file.getId();
  }

  const idSurat = 'SM-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
  const lastRow = sheet.getLastRow();
  const noAgenda = lastRow > 1 ? sheet.getRange(lastRow, 2).getValue() + 1 : 1;
  const createdAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  const rowData = [
    idSurat,
    noAgenda,
    data.noSuratAsal,
    data.tanggalSurat,
    data.tanggalTerima,
    data.pengirim,
    data.perihal,
    data.kodeKlasifikasi,
    data.tingkatKeamanan,
    fileUrl,
    fileId,
    'Belum',
    createdAt,
    data.createdBy || 'Admin TU'
  ];

  sheet.appendRow(rowData);
  return { success: true, idSurat: idSurat };
}

function sendWhatsAppNotification(targetPhone, messageText) {
  const config = getSpreadsheetConfig();
  const normalizedPhone = targetPhone.replace(/[^0-9]/g, '');
  
  try {
    const payload = {
      phone: normalizedPhone,
      message: messageText,
      sender: config.waSenderNumber
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + config.sidobeSecretKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(config.sidobeApiUrl + '/send', options);
    const resText = response.getContentText();
    const resJson = JSON.parse(resText);

    if (response.getResponseCode() === 200 && resJson.status) {
      return { status: 'SUCCESS', messageId: resJson.message_id || 'sdb_' + Date.now() };
    } else {
      return { status: 'FAILED', messageId: '' };
    }
  } catch (error) {
    console.error('WA Error: ' + error.toString());
    return { status: 'FAILED', messageId: '' };
  }
}

function generateNextLetterNumber(kodeKlasifikasi) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('Data_Surat_Keluar');
    if (!sheet) {
      initializeDatabase();
      sheet = ss.getSheetByName('Data_Surat_Keluar');
    }
    const lastRow = sheet.getLastRow();
    const noUrut = lastRow > 1 ? lastRow - 1 + 1 : 1;
    const noUrutStr = String(noUrut).padStart(3, '0');
    
    const config = getSpreadsheetConfig();
    const date = new Date();
    const year = date.getFullYear();
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[date.getMonth()];

    const resmi = \`\${kodeKlasifikasi}/\${noUrutStr}/\${config.kodeSekolahSurat}/\${romanMonth}/\${year}\`;
    return { noUrut: noUrut, noResmi: resmi };
  } finally {
    lock.releaseLock();
  }
}
`;

  const indexHtmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIMAS - Sistem Informasi Manajemen Surat Sekolah</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900">
  <div id="app" class="p-8 max-w-4xl mx-auto">
    <div class="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
      <h1 class="text-2xl font-bold mb-4">SIMAS Web App (Google Apps Script)</h1>
      <p class="text-slate-600 mb-6">Aplikasi terhubung dengan Active Spreadsheet dan Google Drive.</p>
      <div id="status" class="p-4 bg-emerald-50 text-emerald-800 rounded-xl font-medium">
        Sistem siap digunakan. Hubungkan front-end React atau gunakan antarmuka terintegrasi.
      </div>
    </div>
  </div>
</body>
</html>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              GAS
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Google Apps Script Source Code & Deployment</h2>
              <p className="text-xs text-slate-400">Salin kode backend dan frontend untuk di-deploy ke Google Apps Script.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2">
          <button
            onClick={() => setActiveTab('code_gs')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'code_gs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Code.gs (Backend)
          </button>
          <button
            onClick={() => setActiveTab('index_html')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'index_html' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Index.html (Frontend)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Panduan Instalasi
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs">
          {activeTab === 'code_gs' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(codeGsContent)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 shadow transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Salin Code.gs'}
              </button>
              <pre className="text-slate-300 overflow-x-auto p-4 bg-slate-900 rounded-xl border border-slate-800 leading-relaxed">
                {codeGsContent}
              </pre>
            </div>
          )}

          {activeTab === 'index_html' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(indexHtmlContent)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 shadow transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Salin Index.html'}
              </button>
              <pre className="text-slate-300 overflow-x-auto p-4 bg-slate-900 rounded-xl border border-slate-800 leading-relaxed">
                {indexHtmlContent}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="font-sans text-sm text-slate-300 space-y-4 leading-relaxed">
              <h3 className="text-lg font-bold text-white mb-2">Panduan Deploy ke Google Apps Script & Google Drive</h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-300">
                <li>Buka Google Drive dan buat Spreadsheet baru dengan nama <strong className="text-white">"SIMAS - {config.namaSekolah}"</strong>.</li>
                <li>Di dalam folder tempat Spreadsheet tersebut berada, sistem akan otomatis membuat subfolder <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">Berkas_Surat_Masuk</code> dan <code className="text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded">Berkas_Surat_Keluar</code>.</li>
                <li>Pada menu atas Spreadsheet, klik <strong className="text-white">Extensions &gt; Apps Script</strong>.</li>
                <li>Hapus kode default di <code className="text-indigo-300">Code.gs</code>, lalu salin dan tempel (paste) kode dari tab <strong className="text-indigo-400">Code.gs (Backend)</strong> di atas.</li>
                <li>Buat file HTML baru bernama <code className="text-indigo-300">Index</code>, lalu salin dan tempel kode dari tab <strong className="text-indigo-400">Index.html</strong>.</li>
                <li>Jalankan fungsi <code className="text-indigo-300">initializeDatabase()</code> sekali untuk otomatis membuat seluruh lembar database (<code className="text-indigo-300">Data_Surat_Masuk</code>, <code className="text-indigo-300">Data_Disposisi</code>, <code className="text-indigo-300">Data_Surat_Keluar</code>, <code className="text-indigo-300">Data_Pegawai_Guru</code>, <code className="text-indigo-300">Data_Klasifikasi</code>, <code className="text-indigo-300">Konfigurasi</code>).</li>
                <li>Klik <strong className="text-white">Deploy &gt; New deployment</strong>, pilih type <strong className="text-white">Web app</strong>, atur akses ke <strong className="text-white">Anyone</strong>, lalu salin URL Web App yang dihasilkan.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
