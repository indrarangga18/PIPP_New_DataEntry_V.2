import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import { isEmpty, createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { KONDISI_OPTIONS, KETERANGAN_KONSTRUKSI_TIP, KONDISI_TIP, PELABUHAN_OPTIONS, SUMBER_DANA_OPTIONS } from '../utils/formStandards'
import StandardFooterFields from '../components/StandardFooterFields'

const FasilitasPokokGroin = () => {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tahunPembuatan: '',
    keteranganRehab: '',
    jenisKonstruksi: '',
    panjang: '',
    rencanaPengembanganPanjang: '',
    lebar: '',
    rencanaPengembanganLebar: '',
    elevasi: '',
    jumlahGroin: '',
    jarakGroin: '',
    keteranganKonstruksi: '',
    kondisi: '',
    sumberDana: '',
    nilai: '',
    nilaiDisplay: '',
    keteranganSumberDana: '',
    gambar: null,
    aktif: true,
  })

  const [showPreview, setShowPreview] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [doShake, setDoShake] = useState(false)
  const [openTip, setOpenTip] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [fileInfo, setFileInfo] = useState('')

  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const CURRENT_YEAR = new Date().getFullYear()
  const MIN_YEAR = 1950
  const yearOptions = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => String(CURRENT_YEAR - i))

  const TIPS = {
    pelabuhan: 'Pelabuhan tempat fasilitas berada. Pilih dari daftar. Contoh: PPS Nizam Zachman Jakarta',
    tahunPembuatan: 'Pilih tahun pembuatan (tahun saja). Contoh: 2025',
    keteranganRehab: 'Uraikan kegiatan rehab/pekerjaan jika ada.',
    jenisKonstruksi: 'Pilih material utama konstruksi groin. Contoh: Beton, Batu',
    panjang: 'Panjang groin dalam meter (angka). Contoh: 50',
    rencanaPengembanganPanjang: 'Perkiraan penambahan panjang dalam meter. Contoh: 10',
    lebar: 'Lebar groin dalam meter (angka). Contoh: 3',
    rencanaPengembanganLebar: 'Perkiraan penambahan lebar dalam meter. Contoh: 1',
    elevasi: 'Elevasi puncak groin terhadap muka air (meter).',
    jumlahGroin: 'Jumlah groin yang ada (angka).',
    jarakGroin: 'Jarak antar groin (meter).',
    keteranganKonstruksi: KETERANGAN_KONSTRUKSI_TIP,
    kondisi: KONDISI_TIP,
    sumberDana: 'Asal pendanaan (APBN, APBD, Hibah, dsb).',
    nilai: 'Nilai anggaran/pengeluaran (format Rupiah).',
    keteranganSumberDana: 'Detail tambahan terkait sumber dana jika diperlukan.',
    gambar: 'Unggah foto atau PDF terkait. Format: JPG/PNG/PDF. Maks 10MB.',
    aktif: 'Tandai aktif jika fasilitas masih digunakan/berlaku.'
  }

  const toggleTip = (key) => setOpenTip(prev => (prev === key ? null : key))

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','tahunPembuatan','jenisKonstruksi','sumberDana','nilai','kondisi'],
    numericKeys: ['panjang','lebar','elevasi','jumlahGroin','jarakGroin','rencanaPengembanganPanjang','rencanaPengembanganLebar']
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','tahunPembuatan','jenisKonstruksi','panjang','lebar','elevasi','jumlahGroin','jarakGroin','sumberDana','nilai','kondisi','rencanaPengembanganPanjang','rencanaPengembanganLebar'])

  const formatThousands = (value) => {
    const digits = String(value).replace(/\D/g, '')
    if (!digits) return ''
    return new Intl.NumberFormat('id-ID').format(parseInt(digits, 10))
  }

  const handleNilaiChange = (e) => {
    const raw = e.target.value
    const digits = raw.replace(/\D/g, '')
    const numeric = digits ? parseInt(digits, 10) : ''
    setFormData(prev => ({
      ...prev,
      nilai: numeric,
      nilaiDisplay: formatThousands(digits)
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    setFileError('')
    setFileInfo('')
    setImagePreview(null)
    if (!file) {
      setFormData(prev => ({ ...prev, gambar: null }))
      return
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError('Format file tidak didukung. Hanya JPG, PNG, atau PDF.')
      setFormData(prev => ({ ...prev, gambar: null }))
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Ukuran file terlalu besar. Maksimal 10MB.')
      setFormData(prev => ({ ...prev, gambar: null }))
      return
    }
    setFormData(prev => ({ ...prev, gambar: file }))
    setFileInfo(`${file.name} • ${formatFileSize(file.size)}`)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }

  const handleReset = () => {
    setFormData({
      pelabuhan: '',
      tahunPembuatan: '',
      keteranganRehab: '',
      jenisKonstruksi: '',
      panjang: '',
      rencanaPengembanganPanjang: '',
      lebar: '',
      rencanaPengembanganLebar: '',
      elevasi: '',
      jumlahGroin: '',
      jarakGroin: '',
      keteranganKonstruksi: '',
      kondisi: '',
      sumberDana: '',
      nilai: '',
      nilaiDisplay: '',
      keteranganSumberDana: '',
      gambar: null,
      aktif: true,
    })
    setImagePreview(null)
    setFileError('')
    setFileInfo('')
  }

  const handleOpenPreview = () => {
    if (saveDisabled) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 600)
      setTimeout(() => setShowPreview(true), 300)
    } else {
      setShowPreview(true)
    }
  }

  const handleClosePreview = () => setShowPreview(false)

  const submitData = async () => {
    console.log('Konfirmasi Simpan Data (Groin):', formData)
    setShowPreview(false)
    setConfirmOpen(false)
  }

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Pokok - Groin"
        description="Form untuk mengelola data fasilitas pokok groin"
        rightSlot={(
          <div className={`form-group ${isRequiredEmpty('pelabuhan') ? 'error' : ''} ${isRequiredEmpty('pelabuhan') && doShake ? 'shake' : ''}`} style={{ position: 'relative', margin: 0 }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label" style={{ fontSize: 14, marginBottom: 6 }}>Pelabuhan <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.pelabuhan}
                onMouseEnter={() => toggleTip('pelabuhan')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'pelabuhan' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.pelabuhan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <SmartSelect
              name="pelabuhan"
              value={formData.pelabuhan}
              onChange={handleInputChange}
              category="pelabuhan"
              baseOptions={PELABUHAN_OPTIONS}
              className="form-select"
              required
              style={{ fontSize: 14 }}
              placeholder="Cari atau pilih pelabuhan..."
            />
          </div>
        )}
        selectedLabel={formData.pelabuhan ? 'Pelabuhan Terpilih:' : null}
        selectedValue={formData.pelabuhan || null}
      />

      <form className="fasilitas-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <div className={`form-group ${isRequiredEmpty('tahunPembuatan') ? 'error' : ''} ${isRequiredEmpty('tahunPembuatan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tahun <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tahunPembuatan} onMouseEnter={() => toggleTip('tahunPembuatan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'tahunPembuatan' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.tahunPembuatan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select name="tahunPembuatan" value={formData.tahunPembuatan} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Tahun</option>
              {yearOptions.map(y => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>

          {/* Jenis Fasilitas dihapus sesuai standar halaman Groin */}

          {/* Keterangan Rehab ditangani oleh komponen footer standar */}

          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisKonstruksi} onMouseEnter={() => toggleTip('jenisKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'jenisKonstruksi' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jenisKonstruksi}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select name="jenisKonstruksi" value={formData.jenisKonstruksi} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Jenis Konstruksi</option>
              <option value="Beton">Beton</option>
              <option value="Batu">Batu</option>
              <option value="Kayu">Kayu</option>
              <option value="Gabion">Gabion</option>
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('panjang') ? 'error' : ''} ${isRequiredEmpty('panjang') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Panjang (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.panjang} onMouseEnter={() => toggleTip('panjang')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'panjang' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.panjang}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="panjang" value={formData.panjang} onChange={handleInputChange} className="form-input" placeholder="Contoh: 50" step="0.01" min="0" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('rencanaPengembanganPanjang') ? 'error' : ''} ${isRequiredEmpty('rencanaPengembanganPanjang') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Panjang (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganPanjang} onMouseEnter={() => toggleTip('rencanaPengembanganPanjang')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'rencanaPengembanganPanjang' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.rencanaPengembanganPanjang}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="rencanaPengembanganPanjang" value={formData.rencanaPengembanganPanjang} onChange={handleInputChange} className="form-input" placeholder="Contoh: 10" step="0.01" min="0" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('lebar') ? 'error' : ''} ${isRequiredEmpty('lebar') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Lebar (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.lebar} onMouseEnter={() => toggleTip('lebar')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'lebar' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.lebar}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="lebar" value={formData.lebar} onChange={handleInputChange} className="form-input" placeholder="Contoh: 3" step="0.01" min="0" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('rencanaPengembanganLebar') ? 'error' : ''} ${isRequiredEmpty('rencanaPengembanganLebar') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Lebar (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganLebar} onMouseEnter={() => toggleTip('rencanaPengembanganLebar')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'rencanaPengembanganLebar' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.rencanaPengembanganLebar}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="rencanaPengembanganLebar" value={formData.rencanaPengembanganLebar} onChange={handleInputChange} className="form-input" placeholder="Contoh: 1" step="0.01" min="0" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('elevasi') ? 'error' : ''} ${isRequiredEmpty('elevasi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Elevasi (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.elevasi} onMouseEnter={() => toggleTip('elevasi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'elevasi' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.elevasi}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="elevasi" value={formData.elevasi} onChange={handleInputChange} className="form-input" placeholder="Contoh: 1.5" step="0.01" min="0" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('jumlahGroin') ? 'error' : ''} ${isRequiredEmpty('jumlahGroin') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jumlah Groin <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jumlahGroin} onMouseEnter={() => toggleTip('jumlahGroin')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'jumlahGroin' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jumlahGroin}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="jumlahGroin" value={formData.jumlahGroin} onChange={handleInputChange} className="form-input" placeholder="Contoh: 5" step="1" min="0" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('jarakGroin') ? 'error' : ''} ${isRequiredEmpty('jarakGroin') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jarak Groin (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jarakGroin} onMouseEnter={() => toggleTip('jarakGroin')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'jarakGroin' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jarakGroin}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="jarakGroin" value={formData.jarakGroin} onChange={handleInputChange} className="form-input" placeholder="Contoh: 30" step="0.01" min="0" required />
          </div>

          {/* Keterangan Konstruksi dipindah ke komponen footer standar */}

          <div className={`form-group ${isRequiredEmpty('kondisi') ? 'error' : ''} ${isRequiredEmpty('kondisi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Kondisi <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.kondisi} onMouseEnter={() => toggleTip('kondisi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'kondisi' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.kondisi}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select name="kondisi" value={formData.kondisi} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Kondisi</option>
              {KONDISI_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('sumberDana') ? 'error' : ''} ${isRequiredEmpty('sumberDana') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Sumber Dana <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.sumberDana} onMouseEnter={() => toggleTip('sumberDana')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'sumberDana' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.sumberDana}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select name="sumberDana" value={formData.sumberDana} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Sumber Dana</option>
              {SUMBER_DANA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('nilai') ? 'error' : ''} ${isRequiredEmpty('nilai') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nilai <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.nilai} onMouseEnter={() => toggleTip('nilai')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'nilai' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.nilai}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <div className="input-affix">
              <span className="affix-prefix">Rp</span>
              <input type="text" name="nilai" value={formData.nilaiDisplay || ''} onChange={handleNilaiChange} className="form-input currency-input" placeholder="Contoh: 150.000.000" />
            </div>
          </div>

          {/* Keterangan Sumber Dana dipindah ke komponen footer standar */}

          {/* Gambar dipindah ke komponen footer standar */}

          {/* Aktif dipindah ke komponen footer standar */}
          {/* Footer standar: Gambar, Keterangan Rehab, Keterangan Konstruksi, Keterangan Sumber Dana, Aktif */}
          <StandardFooterFields
            formData={formData}
            openTip={openTip}
            setOpenTip={setOpenTip}
            TIPS={TIPS}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            fileError={fileError}
            fileInfo={fileInfo}
            imagePreview={imagePreview}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleOpenPreview} className="btn btn-primary btn-lg btn-wide">Simpan Data</button>
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-lg btn-wide">Hapus Isian</button>
        </div>
      </form>

      {showPreview && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Preview Hasil Input</h3>
              <div style={{ marginTop: 6, fontSize: 14, color: '#64748b' }}>
                <strong>Pelabuhan:</strong> <span>{formData.pelabuhan || '-'}</span>
              </div>
            </div>
            <div className="modal-body">
              <div className="preview-grid">
                <div className={isRequiredEmpty('tahunPembuatan') ? 'preview-item error' : 'preview-item'}>
                  <strong>Tahun:</strong> <span>{formData.tahunPembuatan || '-'}</span>
                </div>
                <div className={isRequiredEmpty('pelabuhan') ? 'preview-item error' : 'preview-item'}>
                  <strong>Pelabuhan:</strong> <span>{formData.pelabuhan || '-'}</span>
                </div>
                {/* Jenis Fasilitas dihapus dari preview */}
                <div className="preview-item"><strong>Keterangan Rehab:</strong> <span>{formData.keteranganRehab || '-'}</span></div>
                <div className={isRequiredEmpty('jenisKonstruksi') ? 'preview-item error' : 'preview-item'}>
                  <strong>Jenis Konstruksi:</strong> <span>{formData.jenisKonstruksi || '-'}</span>
                </div>
                <div className={isRequiredEmpty('panjang') ? 'preview-item error' : 'preview-item'}>
                  <strong>Panjang (m):</strong> <span>{formData.panjang || '-'}</span>
                </div>
                <div className="preview-item"><strong>Rencana Pengembangan Panjang (m):</strong> <span>{formData.rencanaPengembanganPanjang || '-'}</span></div>
                <div className={isRequiredEmpty('lebar') ? 'preview-item error' : 'preview-item'}>
                  <strong>Lebar (m):</strong> <span>{formData.lebar || '-'}</span>
                </div>
                <div className="preview-item"><strong>Rencana Pengembangan Lebar (m):</strong> <span>{formData.rencanaPengembanganLebar || '-'}</span></div>
                <div className={isRequiredEmpty('elevasi') ? 'preview-item error' : 'preview-item'}>
                  <strong>Elevasi (m):</strong> <span>{formData.elevasi || '-'}</span>
                </div>
                <div className={isRequiredEmpty('jumlahGroin') ? 'preview-item error' : 'preview-item'}>
                  <strong>Jumlah Groin:</strong> <span>{formData.jumlahGroin || '-'}</span>
                </div>
                <div className={isRequiredEmpty('jarakGroin') ? 'preview-item error' : 'preview-item'}>
                  <strong>Jarak Groin (m):</strong> <span>{formData.jarakGroin || '-'}</span>
                </div>
                <div className="preview-item"><strong>Keterangan Konstruksi:</strong> <span>{formData.keteranganKonstruksi || '-'}</span></div>
                <div className="preview-item"><strong>Kondisi:</strong> <span>{formData.kondisi || '-'}</span></div>
                <div className={isRequiredEmpty('sumberDana') ? 'preview-item error' : 'preview-item'}>
                  <strong>Sumber Dana:</strong> <span>{formData.sumberDana || '-'}</span>
                </div>
                <div className={isRequiredEmpty('nilai') ? 'preview-item error' : 'preview-item'}>
                  <strong>Nilai:</strong> <span>{formData.nilaiDisplay ? `Rp ${formData.nilaiDisplay}` : '-'}</span>
                </div>
                <div className="preview-item"><strong>Keterangan Sumber Dana:</strong> <span>{formData.keteranganSumberDana || '-'}</span></div>
                <div className="preview-item"><strong>Aktif:</strong> <span>{formData.aktif ? 'Aktif' : 'Tidak Aktif'}</span></div>
                {imagePreview ? (
                  <div className="preview-item preview-image">
                    <strong>Gambar:</strong>
                    <div className="image-preview" style={{ marginTop: 8 }}>
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  </div>
                ) : (
                  formData.gambar && (
                    <div className="preview-item preview-image">
                      <strong>Gambar:</strong>
                      <span>{formData.gambar.name} • {formatFileSize(formData.gambar.size)}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={handleClosePreview}>Tutup</button>
              <button type="button" className="btn btn-primary" onClick={() => setConfirmOpen(true)}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Konfirmasi Simpan</h3>
            </div>
            <div className="modal-body">
              <p>Apakah Anda sudah yakin akan menyimpan data ini?</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>Edit Kembali</button>
              <button type="button" className="btn btn-primary" disabled={saveDisabled} onClick={submitData}>Ya, Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FasilitasPokokGroin