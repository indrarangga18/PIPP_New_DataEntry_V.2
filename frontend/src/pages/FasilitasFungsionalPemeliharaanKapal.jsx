import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS } from '../utils/formStandards'

const FasilitasFungsionalPemeliharaanKapal = () => {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tahunPembuatan: '',
    jenisFasilitas: '',
    jenisKonstruksi: '',
    kondisi: '',
    luas: '',
    rencanaPengembanganLuas: '',
    gambar: null,
    aktif: true,
  })

  const [openTip, setOpenTip] = useState(null)
  const [doShake, setDoShake] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [fileInfo, setFileInfo] = useState('')

  const CURRENT_YEAR = new Date().getFullYear()
  const MIN_YEAR = 1950
  const yearOptions = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => String(CURRENT_YEAR - i))

  const JENIS_FASILITAS_OPTIONS = ['Bengkel', 'Gudang Peralatan', 'Penjemuran Jaring', 'Perbaikan Jaring']
  const KONDISI_OPTIONS = ['Baik', 'Belum Berfungsi']

  const TIPS = {
    pelabuhan: 'Pilih pelabuhan tempat fasilitas berada.',
    tahunPembuatan: 'Tahun pembuatan (tahun saja).',
    jenisFasilitas: 'Pilih jenis fasilitas pemeliharaan kapal.',
    jenisKonstruksi: 'Isi jenis konstruksi bangunan/fasilitas.',
    kondisi: 'Pilih kondisi: Baik atau Belum Berfungsi.',
    luas: 'Total luas area fasilitas (m²).',
    rencanaPengembanganLuas: 'Rencana pengembangan luas (m²).',
    gambar: 'Unggah foto atau PDF. Maks 10MB.',
    aktif: 'Tandai aktif bila fasilitas masih berlaku.'
  }

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','tahunPembuatan','jenisFasilitas','jenisKonstruksi'],
    numericKeys: ['luas']
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','tahunPembuatan','jenisFasilitas','jenisKonstruksi','luas'])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextValue = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: nextValue }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) { setFileError(''); setFileInfo(''); setImagePreview(null); return }
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!ALLOWED_FILE_TYPES.includes(file.type)) { setFileError('Tipe file tidak didukung'); setFileInfo(''); setImagePreview(null); return }
    if (file.size > MAX_FILE_SIZE) { setFileError('Ukuran file melebihi 10MB'); setFileInfo(''); setImagePreview(null); return }
    setFileError('')
    setFileInfo(`${file.name} • ${(file.size/1024/1024).toFixed(2)} MB`)
    setFormData(prev => ({ ...prev, gambar: file }))
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (saveDisabled) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 500)
      return
    }
    // TODO: Integrasi penyimpanan data
    alert('Data Pemeliharaan Kapal tersimpan (mock).')
  }

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Fungsional - Pemeliharaan Kapal"
        description="Form untuk mengelola fasilitas pemeliharaan kapal"
        rightSlot={(
          <div className={`form-group ${isRequiredEmpty('pelabuhan') ? 'error' : ''} ${isRequiredEmpty('pelabuhan') && doShake ? 'shake' : ''}`} style={{ position: 'relative', margin: 0 }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label" style={{ fontSize: 14, marginBottom: 6 }}>Pelabuhan <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.pelabuhan} onMouseEnter={() => setOpenTip('pelabuhan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'pelabuhan' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.pelabuhan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <SmartSelect name="pelabuhan" value={formData.pelabuhan} onChange={handleInputChange} category="pelabuhan" baseOptions={PELABUHAN_OPTIONS} className="form-select" required style={{ fontSize: 14 }} placeholder="Cari atau pilih pelabuhan..." />
          </div>
        )}
        selectedLabel={formData.pelabuhan ? 'Pelabuhan Terpilih:' : null}
        selectedValue={formData.pelabuhan || null}
      />

      <form className="fasilitas-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Tahun di awal (standar) */}
          <div className={`form-group ${isRequiredEmpty('tahunPembuatan') ? 'error' : ''} ${isRequiredEmpty('tahunPembuatan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tahun <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tahunPembuatan} onMouseEnter={() => setOpenTip('tahunPembuatan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
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

          {/* Jenis di urutan kedua (standar) */}
          <div className={`form-group ${isRequiredEmpty('jenisFasilitas') ? 'error' : ''} ${isRequiredEmpty('jenisFasilitas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Fasilitas <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisFasilitas} onMouseEnter={() => setOpenTip('jenisFasilitas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="jenisFasilitas" value={formData.jenisFasilitas} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Jenis Fasilitas</option>
              {JENIS_FASILITAS_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Konstruksi <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisKonstruksi} onMouseEnter={() => setOpenTip('jenisKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisKonstruksi" value={formData.jenisKonstruksi} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Kondisi
              <span className="tooltip-trigger" role="button" aria-label={TIPS.kondisi} onMouseEnter={() => setOpenTip('kondisi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="kondisi" value={formData.kondisi} onChange={handleInputChange} className="form-select">
              <option value="">Pilih Kondisi</option>
              {KONDISI_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('luas') ? 'error' : ''} ${isRequiredEmpty('luas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Luas (m²) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.luas} onMouseEnter={() => setOpenTip('luas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="luas" value={formData.luas} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan (Luas)
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganLuas} onMouseEnter={() => setOpenTip('rencanaPengembanganLuas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="rencanaPengembanganLuas" value={formData.rencanaPengembanganLuas} onChange={handleInputChange} className="form-input" />
          </div>

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

          {/* Aksi Simpan */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg btn-wide" disabled={saveDisabled}>Simpan</button>
            {saveDisabled && (
              <span className="save-hint">Lengkapi field wajib untuk menyimpan</span>
            )}
            <button
              type="button"
              className="btn btn-secondary btn-lg btn-wide"
              onClick={() => setFormData({
                pelabuhan: '', tahunPembuatan: '', jenisFasilitas: '', jenisKonstruksi: '', kondisi: '', luas: '', rencanaPengembanganLuas: '', gambar: null, aktif: true,
              })}
            >Hapus Isian</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FasilitasFungsionalPemeliharaanKapal