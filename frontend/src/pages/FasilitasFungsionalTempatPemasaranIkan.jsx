import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS, KONDISI_OPTIONS, SUMBER_DANA_OPTIONS } from '../utils/formStandards'

const FasilitasFungsionalTempatPemasaranIkan = () => {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tahunPembuatan: '',
    jenisPemasaran: '',
    namaFasilitasPemasaran: '',
    jenisKonstruksi: '',
    jenisLantai: '',
    luas: '',
    rencanaPengembanganLuas: '',
    jarak: '',
    nilai: '',
    nilaiDisplay: '',
    keteranganKonstruksi: '',
    kondisi: '',
    keteranganSumberDana: '',
    sumberDana: '',
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

  const JENIS_PEMASARAN_OPTIONS = ['TPI', 'Kendaraan Berpendingin', 'Peralatan', 'Pemasaran', 'Lain-Lain']

  const TIPS = {
    pelabuhan: 'Pilih pelabuhan tempat fasilitas berada.',
    tahunPembuatan: 'Tahun pembuatan (tahun saja).',
    jenisPemasaran: 'Jenis fasilitas pemasaran.',
    namaFasilitasPemasaran: 'Nama fasilitas pemasaran (wajib).',
    jenisKonstruksi: 'Jenis konstruksi (wajib).',
    jenisLantai: 'Jenis lantai (wajib).',
    luas: 'Luas dalam meter persegi.',
    rencanaPengembanganLuas: 'Rencana pengembangan luas dalam m2.',
    jarak: 'Jarak dalam meter.',
    nilai: 'Nilai anggaran dalam Rupiah.',
    keteranganKonstruksi: 'Keterangan detail konstruksi.',
    kondisi: 'Pilih kondisi sesuai standar.',
    sumberDana: 'Pilih sumber dana.',
    gambar: 'Unggah foto atau PDF. Maks 10MB.',
    aktif: 'Tandai aktif bila masih berlaku.'
  }

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','tahunPembuatan','jenisPemasaran','namaFasilitasPemasaran','jenisKonstruksi','jenisLantai','kondisi','sumberDana'],
    numericKeys: ['luas','rencanaPengembanganLuas','jarak','nilai']
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','tahunPembuatan','jenisPemasaran','namaFasilitasPemasaran','jenisKonstruksi','jenisLantai','luas','rencanaPengembanganLuas','jarak','nilai','kondisi','sumberDana'])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    let nextValue = type === 'checkbox' ? checked : value
    if (name === 'nilai') {
      const numeric = value.replace(/[^0-9]/g, '')
      nextValue = numeric
      const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      setFormData(prev => ({ ...prev, nilaiDisplay: formatted }))
    }
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
        title="Fasilitas Fungsional - Tempat Pemasaran Ikan"
        description="Form untuk mengelola fasilitas pemasaran ikan"
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
          <div className={`form-group ${isRequiredEmpty('jenisPemasaran') ? 'error' : ''} ${isRequiredEmpty('jenisPemasaran') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisPemasaran} onMouseEnter={() => setOpenTip('jenisPemasaran')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="jenisPemasaran" value={formData.jenisPemasaran} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Jenis</option>
              {JENIS_PEMASARAN_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('namaFasilitasPemasaran') ? 'error' : ''} ${isRequiredEmpty('namaFasilitasPemasaran') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Fasilitas Pemasaran <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaFasilitasPemasaran} onMouseEnter={() => setOpenTip('namaFasilitasPemasaran')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="namaFasilitasPemasaran" value={formData.namaFasilitasPemasaran} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Konstruksi <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisKonstruksi} onMouseEnter={() => setOpenTip('jenisKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisKonstruksi" value={formData.jenisKonstruksi} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('jenisLantai') ? 'error' : ''} ${isRequiredEmpty('jenisLantai') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Lantai <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisLantai} onMouseEnter={() => setOpenTip('jenisLantai')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisLantai" value={formData.jenisLantai} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('luas') ? 'error' : ''} ${isRequiredEmpty('luas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Luas (m²) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.luas} onMouseEnter={() => setOpenTip('luas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="luas" value={formData.luas} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('rencanaPengembanganLuas') ? 'error' : ''} ${isRequiredEmpty('rencanaPengembanganLuas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Luas (m²) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganLuas} onMouseEnter={() => setOpenTip('rencanaPengembanganLuas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="rencanaPengembanganLuas" value={formData.rencanaPengembanganLuas} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('jarak') ? 'error' : ''} ${isRequiredEmpty('jarak') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jarak (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jarak} onMouseEnter={() => setOpenTip('jarak')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="jarak" value={formData.jarak} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('nilai') ? 'error' : ''} ${isRequiredEmpty('nilai') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nilai (Rp) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.nilai} onMouseEnter={() => setOpenTip('nilai')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="nilai" value={formData.nilaiDisplay || ''} onChange={handleInputChange} className="form-input" placeholder="Masukkan nilai (Rupiah)" required />
          </div>

          <div className={`form-group ${isRequiredEmpty('kondisi') ? 'error' : ''} ${isRequiredEmpty('kondisi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Kondisi <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.kondisi} onMouseEnter={() => setOpenTip('kondisi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="kondisi" value={formData.kondisi} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Kondisi</option>
              {KONDISI_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('sumberDana') ? 'error' : ''} ${isRequiredEmpty('sumberDana') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Sumber Dana <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.sumberDana} onMouseEnter={() => setOpenTip('sumberDana')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="sumberDana" value={formData.sumberDana} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Sumber Dana</option>
              {SUMBER_DANA_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
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

export default FasilitasFungsionalTempatPemasaranIkan