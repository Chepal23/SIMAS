export interface SuratMasuk {
  id: string; // SM-YYYYMMDD-XXXX
  noAgenda: number;
  noSuratAsal: string;
  tanggalSurat: string;
  tanggalTerima: string;
  pengirim: string;
  perihal: string;
  kodeKlasifikasi: string;
  tingkatKeamanan: 'Biasa' | 'Penting' | 'Rahasia';
  fileUrl: string;
  fileName: string;
  statusDisposisi: 'Belum' | 'Sudah';
  createdAt: string;
  createdBy: string;
}

export interface Disposisi {
  id: string; // DSP-YYYYMMDD-XXXX
  idSuratMasuk: string;
  noSuratAsal: string;
  perihal: string;
  tanggalDisposisi: string;
  batasWaktu: string;
  instruksi: string;
  catatanPimpinan: string;
  idPegawaiTujuan: string;
  namaPegawaiTujuan: string;
  noWaTujuan: string;
  statusWhatsApp: 'SUCCESS' | 'PENDING' | 'FAILED' | 'Tidak Ada Nomor';
  waMessageId: string;
  statusTindakLanjut: 'Pending' | 'Selesai';
  createdAt: string;
}

export interface SuratKeluar {
  id: string; // SK-YYYYMMDD-XXXX
  noAgendaKeluar: number;
  noSuratResmi: string; // e.g. 421.2/045/SMAN1-PTK/X/2026
  tanggalSurat: string;
  tujuanPenerima: string;
  perihal: string;
  kodeKlasifikasi: string;
  penandatangan: string;
  fileUrl: string;
  fileName: string;
  qrVerifyCode: string;
  statusArsip: 'Draft' | 'Disetujui' | 'Terkirim' | 'Diarsipkan';
  createdAt: string;
  createdBy: string;
}

export interface Pegawai {
  id: string;
  nipNuptk: string;
  namaLengkap: string;
  jabatan: string;
  noWhatsApp: string; // normalized e.g. 628123456789
  status: 'Aktif' | 'Nonaktif';
}

export interface Klasifikasi {
  kode: string;
  namaKlasifikasi: string;
  keterangan: string;
}

export interface Konfigurasi {
  namaSekolah: string;
  kodeSekolahSurat: string;
  alamatSekolah: string;
  emailSekolah: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  sidobeApiUrl: string;
  sidobeSecretKey: string;
  waSenderNumber: string;
}
