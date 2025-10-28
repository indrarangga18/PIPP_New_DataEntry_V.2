import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS } from '../utils/formStandards'

const FasilitasFungsionalAirBbmEsListrik = () => {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tahunPembuatan: '',
    jenisLayanan: '',
    jumlah: '',
    rencanaPengembanganJumlah: '',
    kapasitas: '',
    rencanaPengembanganKapasitas: '',
    kondisi: '',
    keteranganKonstruksi: '',
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

  const JENIS_LAYANAN_OPTIONS = ['Air', 'BBM', 'Es', 'Listrik', 'Lain-Lain']

  const TIPS = {
    pelabuhan: 'Pilih pelabuhan tempat fasilitas berada.',
    tahunPembuatan: 'Tahun pembuatan (tahun saja).',
    jenisLayanan: 'Pilih jenis layanan utama.',
    jumlah: 'Jumlah unit.',
    rencanaPengembanganJumlah: 'Rencana penambahan jumlah unit.',
    kapasitas: 'Kapasitas layanan (misal m3/hari, kWh, dsb).',
    rencanaPengembanganKapasitas: 'Rencana peningkatan kapasitas layanan.',
    kondisi: 'Kondisi umum fasilitas saat ini.',
    keteranganKonstruksi: 'Keterangan konstruksi apabila relevan.',
    gambar: 'Unggah foto atau PDF. Maks 10MB.',
    aktif: 'Tandai aktif bila masih berlaku.'
  }

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','tahunPembuatan','jenisLayanan'],
    numericKeys: ['jumlah','kapasitas','rencanaPengembanganKapasitas']
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','tahunPembuatan','jenisLayanan','jumlah','kapasitas','rencanaPengembanganKapasitas'])

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

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Fungsional - Air BBM Es Listrik"
        description="Form untuk mengelola layanan air, BBM, es, dan listrik"
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

      <form className="fasilitas-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          {/* Tahun di awal */}
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

          {/* Jenis di urutan kedua */}
          <div className={`form-group ${isRequiredEmpty('jenisLayanan') ? 'error' : ''} ${isRequiredEmpty('jenisLayanan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisLayanan} onMouseEnter={() => setOpenTip('jenisLayanan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="jenisLayanan" value={formData.jenisLayanan} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Jenis</option>
              {JENIS_LAYANAN_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('jumlah') ? 'error' : ''} ${isRequiredEmpty('jumlah') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jumlah <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jumlah} onMouseEnter={() => setOpenTip('jumlah')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Jumlah
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganJumlah} onMouseEnter={() => setOpenTip('rencanaPengembanganJumlah')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="rencanaPengembanganJumlah" value={formData.rencanaPengembanganJumlah} onChange={handleInputChange} className="form-input" />
          </div>

          <div className={`form-group ${isRequiredEmpty('kapasitas') ? 'error' : ''} ${isRequiredEmpty('kapasitas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Kapasitas <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.kapasitas} onMouseEnter={() => setOpenTip('kapasitas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="kapasitas" value={formData.kapasitas} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('rencanaPengembanganKapasitas') ? 'error' : ''} ${isRequiredEmpty('rencanaPengembanganKapasitas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Kapasitas <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganKapasitas} onMouseEnter={() => setOpenTip('rencanaPengembanganKapasitas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="rencanaPengembanganKapasitas" value={formData.rencanaPengembanganKapasitas} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Kondisi
              <span className="tooltip-trigger" role="button" aria-label={TIPS.kondisi} onMouseEnter={() => setOpenTip('kondisi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="kondisi" value={formData.kondisi} onChange={handleInputChange} className="form-input" />
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
        </div>
      </form>
    </div>
  )
}

export default FasilitasFungsionalAirBbmEsListrik