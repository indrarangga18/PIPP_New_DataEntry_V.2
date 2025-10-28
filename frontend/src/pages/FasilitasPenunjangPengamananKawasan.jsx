import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS, SUMBER_DANA_OPTIONS } from '../utils/formStandards'

const FasilitasPenunjangPengamananKawasan = () => {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tahunPembuatan: '',
    jenisFasilitasUmum: '',
    jenisKonstruksi: '',
    luas: '',
    jumlah: '',
    sumberDana: '',
    nilai: '',
    nilaiDisplay: '',
    keterangan: '',
    keteranganRehab: '',
    keteranganKonstruksi: '',
    keteranganSumberDana: '',
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

  const JENIS_FASILITAS_UMUM_OPTIONS = ['Pagar', 'Pos Keamanan', 'CCTV', 'Lampu Jalan']
  const JENIS_KONSTRUKSI_OPTIONS = ['Beton', 'Baja', 'Kayu', 'Campuran', 'Semi Permanen', 'Permanen']

  const TIPS = {
    pelabuhan: 'Pilih pelabuhan tempat fasilitas berada.',
    tahunPembuatan: 'Tahun pembuatan (tahun saja).',
    jenisFasilitasUmum: 'Pilih jenis fasilitas pengamanan.',
    jenisKonstruksi: 'Pilih jenis konstruksi.',
    luas: 'Luas total area (m²).',
    jumlah: 'Jumlah unit fasilitas.',
    sumberDana: 'Pilih sumber dana pembangunan/pengelolaan.',
    nilai: 'Nilai anggaran (Rp).',
    keterangan: 'Keterangan tambahan terkait fasilitas.',
    keteranganRehab: 'Keterangan pekerjaan rehab jika ada.',
    keteranganKonstruksi: 'Catatan teknis konstruksi.',
    keteranganSumberDana: 'Detail tambahan terkait sumber dana.',
    gambar: 'Unggah foto atau PDF. Maks 10MB.',
    aktif: 'Tandai aktif bila fasilitas masih berlaku.'
  }

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','tahunPembuatan','jenisFasilitasUmum','jenisKonstruksi','sumberDana'],
    numericKeys: ['luas']
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','tahunPembuatan','jenisFasilitasUmum','jenisKonstruksi','luas','sumberDana'])

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
        title="Fasilitas Penunjang - Fasilitas Pengamanan Kawasan"
        description="Form Pengamanan Kawasan"
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

          <div className={`form-group ${isRequiredEmpty('jenisFasilitasUmum') ? 'error' : ''} ${isRequiredEmpty('jenisFasilitasUmum') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Fasilitas Umum <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisFasilitasUmum} onMouseEnter={() => setOpenTip('jenisFasilitasUmum')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <SmartSelect
              name="jenisFasilitasUmum"
              value={formData.jenisFasilitasUmum}
              onChange={handleInputChange}
              category="jenisFasilitasUmum"
              baseOptions={JENIS_FASILITAS_UMUM_OPTIONS}
              className="form-select"
              required
              placeholder="Pilih Jenis Fasilitas"
            />
          </div>

          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Konstruksi <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisKonstruksi} onMouseEnter={() => setOpenTip('jenisKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <SmartSelect
              name="jenisKonstruksi"
              value={formData.jenisKonstruksi}
              onChange={handleInputChange}
              category="jenisKonstruksi"
              baseOptions={JENIS_KONSTRUKSI_OPTIONS}
              className="form-select"
              required
              placeholder="Pilih Jenis Konstruksi"
            />
          </div>

          <div className={`form-group ${isRequiredEmpty('luas') ? 'error' : ''} ${isRequiredEmpty('luas') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Luas (m²) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.luas} onMouseEnter={() => setOpenTip('luas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="luas" value={formData.luas} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jumlah
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jumlah} onMouseEnter={() => setOpenTip('jumlah')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} className="form-input" />
          </div>

          <div className={`form-group ${isRequiredEmpty('sumberDana') ? 'error' : ''} ${isRequiredEmpty('sumberDana') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Sumber Dana <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.sumberDana} onMouseEnter={() => setOpenTip('sumberDana')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <SmartSelect
              name="sumberDana"
              value={formData.sumberDana}
              onChange={handleInputChange}
              category="sumberDana"
              baseOptions={SUMBER_DANA_OPTIONS}
              className="form-select"
              required
              placeholder="Pilih Sumber Dana"
            />
          </div>

          <div className={`form-group ${false ? 'error' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nilai (Rp)
              <span className="tooltip-trigger" role="button" aria-label={TIPS.nilai} onMouseEnter={() => setOpenTip('nilai')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="nilai" value={formData.nilaiDisplay || ''} onChange={handleInputChange} className="form-input" placeholder="Masukkan nilai (Rupiah)" />
          </div>

          <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Keterangan
              <span className="tooltip-trigger" role="button" aria-label={TIPS.keterangan} onMouseEnter={() => setOpenTip('keterangan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <textarea name="keterangan" value={formData.keterangan} onChange={handleInputChange} className="form-input" rows={3} placeholder="Keterangan tambahan" />
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

export default FasilitasPenunjangPengamananKawasan