import { SuratMasuk, Disposisi, SuratKeluar, Pegawai, Klasifikasi, Konfigurasi } from './types';

export const initialConfig: Konfigurasi = {
  namaSekolah: 'SMA Negeri 1 Pontianak',
  kodeSekolahSurat: 'SMAN1-PTK',
  alamatSekolah: 'Jl. W.R. Supratman No. 1, Pontianak, Kalimantan Barat',
  emailSekolah: 'info@sman1pontianak.sch.id',
  namaKepalaSekolah: 'Drs. H. Ahmad Fauzi, M.Pd.',
  nipKepalaSekolah: '196812151994031005',
  sidobeApiUrl: 'https://api.sidobe.com/wa/v1',
  sidobeSecretKey: 'sdb_live_sec_9988776655443322',
  waSenderNumber: '628115678901',
};

export const initialKlasifikasi: Klasifikasi[] = [
  { kode: '005', namaKlasifikasi: 'Undangan / Rapat', keterangan: 'Surat undangan kedinasan, rapat internal, atau sosialisasi' },
  { kode: '421.1', namaKlasifikasi: 'Kurikulum & Pembelajaran', keterangan: 'Kalender akademik, silabus, KOSP, dan kegiatan KBM' },
  { kode: '421.2', namaKlasifikasi: 'Kesiswaan & Ekstrakurikuler', keterangan: 'OSIS, lomba, PPDB, mutasi siswa, dan prestasi' },
  { kode: '421.3', namaKlasifikasi: 'Sarana & Prasarana', keterangan: 'Inventaris sekolah, pemeliharaan gedung, pengadaan alat' },
  { kode: '800', namaKlasifikasi: 'Kepegawaian', keterangan: 'SK PNS/PPPK, kenaikan pangkat, cuti, dan mutasi guru/tendik' },
  { kode: '900', namaKlasifikasi: 'Keuangan & BOS', keterangan: 'RKAS, laporan penggunaan dana BOS, SPJ, dan audit' },
];

export const initialPegawai: Pegawai[] = [
  { id: 'PEG-001', nipNuptk: '196812151994031005', namaLengkap: 'Drs. H. Ahmad Fauzi, M.Pd.', jabatan: 'Kepala Sekolah', noWhatsApp: '6281234567890', status: 'Aktif' },
  { id: 'PEG-002', nipNuptk: '197503202000122001', namaLengkap: 'Siti Rahmawati, S.Pd.', jabatan: 'Waka Kurikulum', noWhatsApp: '6281355667788', status: 'Aktif' },
  { id: 'PEG-003', nipNuptk: '198205102008011002', namaLengkap: 'Budi Santoso, S.Kom.', jabatan: 'Waka Kesiswaan', noWhatsApp: '6281299887766', status: 'Aktif' },
  { id: 'PEG-004', nipNuptk: '198511122010012003', namaLengkap: 'Dewi Lestari, S.E.', jabatan: 'Kepala Tata Usaha (KTU)', noWhatsApp: '6281344556677', status: 'Aktif' },
  { id: 'PEG-005', nipNuptk: '199002152014021004', namaLengkap: 'Eko Prasetyo, S.Pd.', jabatan: 'Pembina OSIS', noWhatsApp: '6285211223344', status: 'Aktif' },
];

export const initialSuratMasuk: SuratMasuk[] = [
  {
    id: 'SM-20261010-0001',
    noAgenda: 1,
    noSuratAsal: '421/1234/DISDIK/2026',
    tanggalSurat: '2026-10-08',
    tanggalTerima: '2026-10-10',
    pengirim: 'Dinas Pendidikan Provinsi Kalbar',
    perihal: 'Undangan Sosialisasi Kurikulum Merdeka Revisi dan Asesmen Nasional',
    kodeKlasifikasi: '421.1',
    tingkatKeamanan: 'Penting',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Undangan_Sosialisasi_Kurikulum_2026.pdf',
    statusDisposisi: 'Sudah',
    createdAt: '2026-10-10 09:30:00',
    createdBy: 'Dewi Lestari, S.E.',
  },
  {
    id: 'SM-20261012-0002',
    noAgenda: 2,
    noSuratAsal: '005/892/BPMD/2026',
    tanggalSurat: '2026-10-11',
    tanggalTerima: '2026-10-12',
    pengirim: 'Badan Pemberdayaan Masyarakat',
    perihal: 'Permohonan Partisipasi Lomba Kebersihan Lingkungan Sekolah Tingkat Provinsi',
    kodeKlasifikasi: '421.2',
    tingkatKeamanan: 'Biasa',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Lomba_Kebersihan_2026.pdf',
    statusDisposisi: 'Sudah',
    createdAt: '2026-10-12 10:15:00',
    createdBy: 'Dewi Lestari, S.E.',
  },
  {
    id: 'SM-20261015-0003',
    noAgenda: 3,
    noSuratAsal: '900/451/BOS-PROV/2026',
    tanggalSurat: '2026-10-14',
    tanggalTerima: '2026-10-15',
    pengirim: 'Tim Manajemen BOS Dinas Pendidikan',
    perihal: 'Rekonsiliasi Penggunaan Dana BOS Triwulan III Tahun 2026',
    kodeKlasifikasi: '900',
    tingkatKeamanan: 'Rahasia',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Rekonsiliasi_BOS_TW3.pdf',
    statusDisposisi: 'Belum',
    createdAt: '2026-10-15 13:45:00',
    createdBy: 'Dewi Lestari, S.E.',
  },
];

export const initialDisposisi: Disposisi[] = [
  {
    id: 'DSP-20261010-0001',
    idSuratMasuk: 'SM-20261010-0001',
    noSuratAsal: '421/1234/DISDIK/2026',
    perihal: 'Undangan Sosialisasi Kurikulum Merdeka Revisi dan Asesmen Nasional',
    tanggalDisposisi: '2026-10-10',
    batasWaktu: '2026-10-14',
    instruksi: 'Hadiri dan Siapkan Bahan',
    catatanPimpinan: 'Mohon Waka Kurikulum hadir tepat waktu dan buatkan ringkasan materi untuk rapat dewan guru.',
    idPegawaiTujuan: 'PEG-002',
    namaPegawaiTujuan: 'Siti Rahmawati, S.Pd.',
    noWaTujuan: '6281355667788',
    statusWhatsApp: 'SUCCESS',
    waMessageId: 'sdb_msg_xyz987654321',
    statusTindakLanjut: 'Selesai',
    createdAt: '2026-10-10 11:00:00',
  },
  {
    id: 'DSP-20261012-0002',
    idSuratMasuk: 'SM-20261012-0002',
    noSuratAsal: '005/892/BPMD/2026',
    perihal: 'Permohonan Partisipasi Lomba Kebersihan Lingkungan Sekolah Tingkat Provinsi',
    tanggalDisposisi: '2026-10-12',
    batasWaktu: '2026-10-20',
    instruksi: 'Tindak lanjuti',
    catatanPimpinan: 'Koordinasikan dengan Pembina OSIS dan tim Adiwiyata sekolah untuk pendaftaran dan persiapan.',
    idPegawaiTujuan: 'PEG-003',
    namaPegawaiTujuan: 'Budi Santoso, S.Kom.',
    noWaTujuan: '6281299887766',
    statusWhatsApp: 'SUCCESS',
    waMessageId: 'sdb_msg_abc123456789',
    statusTindakLanjut: 'Pending',
    createdAt: '2026-10-12 14:20:00',
  },
];

export const initialSuratKeluar: SuratKeluar[] = [
  {
    id: 'SK-20261005-0001',
    noAgendaKeluar: 1,
    noSuratResmi: '421.1/001/SMAN1-PTK/X/2026',
    tanggalSurat: '2026-10-05',
    tujuanPenerima: 'Orang Tua / Wali Murid Kelas XII',
    perihal: 'Pemberitahuan Jadwal Try Out Ujian Sekolah dan Bimbingan Belajar',
    kodeKlasifikasi: '421.1',
    penandatangan: 'Kepala Sekolah',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Edaran_Tryout_Kelas_12.pdf',
    qrVerifyCode: 'SIMAS-SK-8839201',
    statusArsip: 'Terkirim',
    createdAt: '2026-10-05 08:00:00',
    createdBy: 'Dewi Lestari, S.E.',
  },
  {
    id: 'SK-20261014-0002',
    noAgendaKeluar: 2,
    noSuratResmi: '005/002/SMAN1-PTK/X/2026',
    tanggalSurat: '2026-10-14',
    tujuanPenerima: 'Seluruh Bapak/Ibu Guru dan Staff',
    perihal: 'Undangan Rapat Koordinasi Bulanan dan Evaluasi Semester',
    kodeKlasifikasi: '005',
    penandatangan: 'Kepala Sekolah',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Undangan_Rapat_Bulanan_Okt.pdf',
    qrVerifyCode: 'SIMAS-SK-4491028',
    statusArsip: 'Terkirim',
    createdAt: '2026-10-14 09:00:00',
    createdBy: 'Dewi Lestari, S.E.',
  },
];

export function getRomanMonth(monthNum: number): string {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romans[monthNum - 1] || 'X';
}
