import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS, SUMBER_DANA_OPTIONS, KONDISI_OPTIONS } from '../utils/formStandards'

const FasilitasPokokDermaga = () => {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    tahunPembuatan: '',
    namaFasilitas: '',
    namaDermaga: '',
    jenisDermaga: '',
    tipeDermaga: '',
    lampu: '',
    posisiTambat: '',
    jenisFender: '',
    jenisBolard: '',
    deskripsiDermaga: '',
    keteranganRehab: '',
    jenisKonstruksi: '',
    keteranganKonstruksi: '',
    kondisi: '',
    panjang: '',
    rencanaPengembanganPanjang: '',
    lebar: '',
    rencanaPengembanganLebar: '',
    elevasi: '',
    sumberDana: '',
    nilai: '',
    nilaiDisplay: '',
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

  const DERMAGA_JENIS_OPTIONS = ['Beton', 'Kayu', 'Baja', 'Batu']
  const DERMAGA_TIPE_OPTIONS = ['Warf/Dermaga', 'Jetty', 'Causeway']

  const TIPS = {
    pelabuhan: 'Pilih pelabuhan tempat fasilitas berada.',
    tahunPembuatan: 'Tahun pembuatan (tahun saja).',
    namaFasilitas: 'Opsional: nama atau label fasilitas.',
    namaDermaga: 'Nama dermaga, wajib diisi.',
    jenisDermaga: 'Pilih jenis material dermaga.',
    tipeDermaga: 'Pilih tipe dermaga sesuai standar.',
    lampu: 'Keterangan lampu di dermaga.',
    posisiTambat: 'Posisi tambat kapal.',
    jenisFender: 'Jenis fender yang digunakan.',
    jenisBolard: 'Jenis bollard yang tersedia.',
    deskripsiDermaga: 'Deskripsi umum dermaga.',
    keteranganRehab: 'Keterangan rehabilitasi jika ada.',
    jenisKonstruksi: 'Jenis konstruksi (teks).',
    keteranganKonstruksi: 'Keterangan detail konstruksi.',
    kondisi: 'Pilih kondisi sesuai standar.',
    panjang: 'Panjang dermaga dalam meter.',
    rencanaPengembanganPanjang: 'Rencana penambahan panjang.',
    lebar: 'Lebar dermaga dalam meter.',
    rencanaPengembanganLebar: 'Rencana penambahan lebar.',
    elevasi: 'Elevasi dermaga.',
    sumberDana: 'Sumber pendanaan.',
    nilai: 'Nilai anggaran dalam Rupiah.',
    keteranganSumberDana: 'Keterangan tambahan sumber dana.',
    gambar: 'Unggah foto atau PDF. Maks 10MB.',
    aktif: 'Tandai aktif bila masih berlaku.'
  }

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','tahunPembuatan','namaDermaga','jenisDermaga','tipeDermaga','kondisi','sumberDana','jenisKonstruksi'],
    numericKeys: ['panjang','lebar','elevasi']
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','tahunPembuatan','namaDermaga','jenisDermaga','tipeDermaga','kondisi','panjang','lebar','elevasi','sumberDana','jenisKonstruksi'])

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
        title="Fasilitas Pokok - Dermaga"
        description="Form untuk mengelola data dermaga"
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

          {/* Jenis (standar, jenis konstruksi) di urutan kedua */}
          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisKonstruksi} onMouseEnter={() => setOpenTip('jenisKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisKonstruksi" value={formData.jenisKonstruksi} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Jenis Dermaga */}
          <div className={`form-group ${isRequiredEmpty('jenisDermaga') ? 'error' : ''} ${isRequiredEmpty('jenisDermaga') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Dermaga <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisDermaga} onMouseEnter={() => setOpenTip('jenisDermaga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="jenisDermaga" value={formData.jenisDermaga} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Jenis</option>
              {DERMAGA_JENIS_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          {/* Tipe dermaga */}
          <div className={`form-group ${isRequiredEmpty('tipeDermaga') ? 'error' : ''} ${isRequiredEmpty('tipeDermaga') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tipe Dermaga <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tipeDermaga} onMouseEnter={() => setOpenTip('tipeDermaga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="tipeDermaga" value={formData.tipeDermaga} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Tipe</option>
              {DERMAGA_TIPE_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>

          {/* Nama Dermaga */}
          <div className={`form-group ${isRequiredEmpty('namaDermaga') ? 'error' : ''} ${isRequiredEmpty('namaDermaga') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Dermaga <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaDermaga} onMouseEnter={() => setOpenTip('namaDermaga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="namaDermaga" value={formData.namaDermaga} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Opsional dan keterangan */}
          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Fasilitas
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaFasilitas} onMouseEnter={() => setOpenTip('namaFasilitas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="namaFasilitas" value={formData.namaFasilitas} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Lampu
              <span className="tooltip-trigger" role="button" aria-label={TIPS.lampu} onMouseEnter={() => setOpenTip('lampu')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="lampu" value={formData.lampu} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Posisi Tambat
              <span className="tooltip-trigger" role="button" aria-label={TIPS.posisiTambat} onMouseEnter={() => setOpenTip('posisiTambat')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="posisiTambat" value={formData.posisiTambat} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Fender
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisFender} onMouseEnter={() => setOpenTip('jenisFender')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisFender" value={formData.jenisFender} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Bolard
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisBolard} onMouseEnter={() => setOpenTip('jenisBolard')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisBolard" value={formData.jenisBolard} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Deskripsi Dermaga
              <span className="tooltip-trigger" role="button" aria-label={TIPS.deskripsiDermaga} onMouseEnter={() => setOpenTip('deskripsiDermaga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <textarea name="deskripsiDermaga" value={formData.deskripsiDermaga} onChange={handleInputChange} className="form-textarea" rows={3} />
          </div>

          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisKonstruksi} onMouseEnter={() => setOpenTip('jenisKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="jenisKonstruksi" value={formData.jenisKonstruksi} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Keterangan Konstruksi
              <span className="tooltip-trigger" role="button" aria-label={TIPS.keteranganKonstruksi} onMouseEnter={() => setOpenTip('keteranganKonstruksi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <textarea name="keteranganKonstruksi" value={formData.keteranganKonstruksi} onChange={handleInputChange} className="form-textarea" rows={2} />
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

          <div className={`form-group ${isRequiredEmpty('panjang') ? 'error' : ''} ${isRequiredEmpty('panjang') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Panjang (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.panjang} onMouseEnter={() => setOpenTip('panjang')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="panjang" value={formData.panjang} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Panjang (m)
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganPanjang} onMouseEnter={() => setOpenTip('rencanaPengembanganPanjang')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="rencanaPengembanganPanjang" value={formData.rencanaPengembanganPanjang} onChange={handleInputChange} className="form-input" />
          </div>

          <div className={`form-group ${isRequiredEmpty('lebar') ? 'error' : ''} ${isRequiredEmpty('lebar') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Lebar (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.lebar} onMouseEnter={() => setOpenTip('lebar')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="lebar" value={formData.lebar} onChange={handleInputChange} className="form-input" required />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Lebar (m)
              <span className="tooltip-trigger" role="button" aria-label={TIPS.rencanaPengembanganLebar} onMouseEnter={() => setOpenTip('rencanaPengembanganLebar')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="rencanaPengembanganLebar" value={formData.rencanaPengembanganLebar} onChange={handleInputChange} className="form-input" />
          </div>

          <div className={`form-group ${isRequiredEmpty('elevasi') ? 'error' : ''} ${isRequiredEmpty('elevasi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Elevasi <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.elevasi} onMouseEnter={() => setOpenTip('elevasi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="number" step="0.01" name="elevasi" value={formData.elevasi} onChange={handleInputChange} className="form-input" required />
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

          <div className={`form-group ${isRequiredEmpty('nilai') ? 'error' : ''} ${isRequiredEmpty('nilai') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nilai <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.nilai} onMouseEnter={() => setOpenTip('nilai')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="nilai" value={formData.nilaiDisplay || ''} onChange={handleInputChange} className="form-input" placeholder="Masukkan nilai (Rupiah)" required />
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

export default FasilitasPokokDermaga