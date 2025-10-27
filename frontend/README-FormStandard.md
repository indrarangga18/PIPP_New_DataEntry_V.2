# Standarisasi Form PIPP

Halaman `Fasilitas Pokok - Jalan` (http://localhost:5173/fasilitas/pokok/jalan) menjadi referensi standar. Gunakan pedoman ini untuk semua form yang akan dibuat agar konsisten.

## Typography
- Font family: system-ui stack (`system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif`).
- Ukuran dasar kontrol form: `14px` (`.form-input`, `.form-select`, label `14px`).
- Title: `.section-title`, description: `.section-desc`.

## Warna & Theme
- Variabel CSS global didefinisikan di `src/styles/theme.css`:
  - `--brand-1: #0052A3`, `--brand-2: #00AEEF`, `--primary-strong: #08114B`, `--accent: #F4D03F`.
  - `--text: #111827`, `--muted: #6b7280`, `--bg: #f9fafb`.
- Header/tombol utama gunakan gradient `brand-1 → brand-2`.
- Breadcrumb aktif: `--primary-strong`.

## Layout
- Kartu: `.section-card` (background putih, radius 12px, shadow lembut, padding 16px).
- Grid form: `.form-grid` (auto-fit, minmax 300px, gap 20px).
- Group: `.form-group` dengan `.form-label`, kontrol `.form-input`/`.form-select`.
- Header form standar tersedia di `components/FormHeader.jsx` (title, deskripsi, slot kanan, info terpilih di bawah judul).

## Breadcrumb
- Komponen: `src/components/Breadcrumb.jsx`, separator '`>`', crumb aktif `#08114B`.

## Mandatory & Validasi
- Required mark: `.required-mark` merah `#ef4444`.
- Error state: `.form-group.error` (label merah, border merah, background `red-50`).
- Animasi salah isi: `.form-group.error.shake`.
- Utilitas validasi: `src/utils/formValidation.js` – gunakan `createIsRequiredEmpty` dan `createIsSaveDisabled`.

## Tooltip "? Informasi"
- Trigger: `.tooltip-trigger` (warna `--accent` saat hover).
- Konten tooltip diletakkan absolut di dalam `.form-group`.

## Preview & Simpan
- Modal preview: judul "Preview Hasil Input" dan subheader "Pelabuhan: {nama}".
- Grid preview mengikuti struktur form, field wajib diberi kelas `error` bila kosong.
- Tombol `Simpan` membuka modal konfirmasi dengan tombol "Ya, Simpan" dan "Edit Kembali".

## Contoh Penggunaan Validasi
```js
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'

const isRequiredEmpty = createIsRequiredEmpty(formData, {
  textKeys: ['tahunPembuatan','jenisKonstruksi','pelabuhan','sumberDana'],
  numericKeys: ['bebanGandar','panjang','lebar'],
})

const isSaveDisabled = createIsSaveDisabled(isRequiredEmpty, ['tahunPembuatan','bebanGandar','jenisKonstruksi','pelabuhan','panjang','lebar','sumberDana'])
```

Dengan pedoman ini, semua form baru dapat mengikuti tampilan dan perilaku yang sudah FIX di halaman referensi tanpa mengubah halaman tersebut.