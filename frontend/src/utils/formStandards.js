// Centralized form standards for PIPP forms
export const KONDISI_OPTIONS = [
  "Kondisi Baik Belum Berfungsi",
  "Kondisi Rusak",
  "Sudah Berfungsi Dalam Keadaan Baik",
  "Sudah Berfungsi Dalam Keadaan Rusak",
  "Tahap Pembangunan",
  "Tidak Ada",
];

export const KETERANGAN_KONSTRUKSI_TIP =
  "Tuliskan keterangan konstruksi secara bebas (material, metode, catatan teknis).";

export const KONDISI_TIP =
  "Pilih kondisi sesuai standar: Baik/Belum Berfungsi, Rusak, Sudah Berfungsi (Baik/Rusak), Tahap Pembangunan, atau Tidak Ada.";

// Tip umum untuk Jenis Fasilitas lintas halaman
export const JENIS_FASILITAS_TIP =
  "Pilih jenis fasilitas pada halaman ini sesuai kategori yang tersedia.";

// Daftar pelabuhan standar lintas form
export const PELABUHAN_OPTIONS = [
  "PPS Nizam Zachman Jakarta",
  "PPS Kendari",
  "PPN Pekalongan",
  "PPN Kejawanan Cirebon",
  "PPP Pondokdadap Malang",
  "PPP Brondong Lamongan",
]

// Daftar Sumber Dana standar lintas form
export const SUMBER_DANA_OPTIONS = [
  "APBN",
  "APBD",
  "Hibah",
  "Lainnya",
]

// Daftar standar untuk Jenis Ikan lintas form
export const JENIS_IKAN_OPTIONS = [
  'Tongkol', 'Cakalang', 'Tuna', 'Kembung', 'Bandeng', 'Lele', 'Gurame'
]

// Daftar standar untuk Transportasi lintas form
export const TRANSPORTASI_OPTIONS = [
  'Kapal Angkut', 'Truk Pendingin', 'Pickup', 'Perahu', 'Lainnya'
]

// Daftar standar untuk Kategori pemasaran lintas form
export const KATEGORI_OPTIONS = [
  'Lokal', 'Domestik', 'Antar Pulau', 'Ekspor', 'Lainnya'
]

// Daftar standar untuk Tujuan pemasaran lintas form
export const TUJUAN_OPTIONS = [
  'Pasar Lokal', 'Antar Kota', 'Antar Provinsi', 'Ekspor', 'Lainnya'
]

// Daftar standar untuk Tipe Dokumen pelabuhan perikanan
export const TIPE_DOKUMEN_OPTIONS = [
  'Peraturan',
  'Keputusan',
  'Surat Edaran',
  'Pedoman',
  'SOP',
  'Nota Dinas',
  'Lainnya',
]

// Standar field wajib lintas form untuk masa depan
// Gunakan ini agar semua form baru otomatis mewajibkan:
// - Kondisi (text)
// - Rencana Pengembangan Panjang (numeric)
// - Rencana Pengembangan Lebar (numeric)
export const STANDARD_REQUIRED_KEYS = {
  textKeys: ['kondisi', 'jenisFasilitas'],
  numericKeys: ['rencanaPengembanganPanjang', 'rencanaPengembanganLebar'],
}

// Helper untuk menggabungkan required keys halaman dengan standar global
export const mergeWithStandardRequired = (local) => {
  const textKeys = Array.from(new Set([...(local?.textKeys || []), ...STANDARD_REQUIRED_KEYS.textKeys]))
  const numericKeys = Array.from(new Set([...(local?.numericKeys || []), ...STANDARD_REQUIRED_KEYS.numericKeys]))
  return { textKeys, numericKeys }
}