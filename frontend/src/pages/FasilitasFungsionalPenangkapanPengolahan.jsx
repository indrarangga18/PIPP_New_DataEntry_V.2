import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS, KONDISI_OPTIONS, SUMBER_DANA_OPTIONS } from '../utils/formStandards'

const JENIS_FASILITAS_PP_OPTIONS = [
  'Unit Pengolahan Ikan',
  'Cold Storage',
  'Gudang Bahan Baku',
  'Area Bongkar Muat',
  'Tempat Pengeringan',
  'Tempat Pengasinan',
]
const JENIS_KONSTRUKSI_OPTIONS = ['Beton', 'Baja', 'Kayu', 'Campuran']
const JENIS_LANTAI_OPTIONS = ['Beton', 'Aspal', 'Paving', 'Tanah', 'Kayu']

const TIPS = {
  pelabuhan: 'Pilih pelabuhan terkait fasilitas penangkapan/pengolahan.',
  jenisFasilitas: 'Pilih jenis fasilitas sesuai judul halaman.',
  namaFasilitas: 'Masukkan nama fasilitas secara spesifik.',
  tahunPembuatan: 'Isi tahun pembuatan (4 digit).',
  jenisKonstruksi: 'Pilih jenis konstruksi utama.',
  kondisiKonstruksi: 'Pilih kondisi konstruksi saat ini.',
  jenisLantai: 'Pilih jenis lantai/permukaan.',
  luas: 'Isi luas area (m²).',
  rencanaPengembanganLuas: 'Isi rencana pengembangan luas (opsional).',
  jarak: 'Isi jarak (m) dari referensi lokasi.',
  nilai: 'Isi nilai perkiraan (opsional).',
  sumberDana: 'Pilih sumber dana utama fasilitas.',
  // Footer standar
  gambar: 'Unggah gambar/PDF dokumentasi (opsional).',
  keteranganRehab: 'Catatan rehab/pekerjaan (opsional).',
  keteranganKonstruksi: 'Catatan teknis konstruksi (opsional).',
  keteranganSumberDana: 'Detail tambahan terkait sumber dana (opsional).',
  aktif: 'Tandai aktif/tidak aktif.',
}

export default function FasilitasFungsionalPenangkapanPengolahan() {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    jenisFasilitas: '',
    namaFasilitas: '',
    tahunPembuatan: '',
    jenisKonstruksi: '',
    kondisiKonstruksi: '',
    jenisLantai: '',
    luas: '',
    rencanaPengembanganLuas: '',
    jarak: '',
    nilai: '',
    keteranganKonstruksi: '',
    sumberDana: '',
    keteranganSumberDana: '',
    gambar: null,
    aktif: false,
  })

  const [openTip, setOpenTip] = useState(null)
  const [doShake, setDoShake] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [fileInfo, setFileInfo] = useState('')

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan', 'namaFasilitas'],
    selectKeys: ['jenisFasilitas', 'jenisKonstruksi', 'kondisiKonstruksi', 'jenisLantai', 'sumberDana'],
    numericKeys: ['tahunPembuatan', 'luas', 'jarak'],
    booleanKeys: ['aktif'],
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, [
    'pelabuhan','jenisFasilitas','namaFasilitas','tahunPembuatan','jenisKonstruksi','kondisiKonstruksi','jenisLantai','luas','jarak','sumberDana','aktif'
  ])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => {
    const { files, name } = e.target
    const file = files && files[0] ? files[0] : null
    if (!file) {
      setFormData(prev => ({ ...prev, [name]: null }))
      setImagePreview(null)
      setFileError('')
      setFileInfo('')
      return
    }
    const maxSizeMb = 5
    if (file.size > maxSizeMb * 1024 * 1024) {
      setFileError(`Ukuran file melebihi ${maxSizeMb}MB`)
      setImagePreview(null)
    } else {
      setFileError('')
      setImagePreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null)
    }
    setFormData(prev => ({ ...prev, [name]: file }))
    setFileInfo(`${file.name} • ${(file.size / 1024).toFixed(0)} KB`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (saveDisabled) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 500)
      return
    }
    // TODO: Integrasi penyimpanan data
    alert('Data Penangkapan & Pengolahan tersimpan (mock).')
  }

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Fungsional — Penangkapan & Pengolahan"
        description="Form input fasilitas penangkapan dan pengolahan ikan sesuai standar."
        rightSlot={(
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
        )}
        selectedLabel={formData.pelabuhan ? 'Pelabuhan Terpilih:' : null}
        selectedValue={formData.pelabuhan || null}
      />

      <form className="fasilitas-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Jenis Fasilitas */}
          <div className={`form-group ${isRequiredEmpty('jenisFasilitas') ? 'error' : ''} ${isRequiredEmpty('jenisFasilitas') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Jenis Fasilitas <span className="required-mark">*</span></label>
            <SmartSelect
              name="jenisFasilitas"
              value={formData.jenisFasilitas}
              onChange={handleInputChange}
              category="jenisFasilitasPenangkapanPengolahan"
              baseOptions={JENIS_FASILITAS_PP_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Nama Fasilitas */}
          <div className={`form-group ${isRequiredEmpty('namaFasilitas') ? 'error' : ''} ${isRequiredEmpty('namaFasilitas') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Nama Fasilitas <span className="required-mark">*</span></label>
            <input type="text" name="namaFasilitas" value={formData.namaFasilitas} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Tahun Pembuatan */}
          <div className={`form-group ${isRequiredEmpty('tahunPembuatan') ? 'error' : ''} ${isRequiredEmpty('tahunPembuatan') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Tahun Pembuatan <span className="required-mark">*</span></label>
            <input type="number" name="tahunPembuatan" value={formData.tahunPembuatan} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Jenis Konstruksi */}
          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Jenis Konstruksi <span className="required-mark">*</span></label>
            <SmartSelect
              name="jenisKonstruksi"
              value={formData.jenisKonstruksi}
              onChange={handleInputChange}
              category="jenisKonstruksi"
              baseOptions={JENIS_KONSTRUKSI_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Kondisi Konstruksi */}
          <div className={`form-group ${isRequiredEmpty('kondisiKonstruksi') ? 'error' : ''} ${isRequiredEmpty('kondisiKonstruksi') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Kondisi Konstruksi <span className="required-mark">*</span></label>
            <SmartSelect
              name="kondisiKonstruksi"
              value={formData.kondisiKonstruksi}
              onChange={handleInputChange}
              category="kondisi"
              baseOptions={KONDISI_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Jenis Lantai */}
          <div className={`form-group ${isRequiredEmpty('jenisLantai') ? 'error' : ''} ${isRequiredEmpty('jenisLantai') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Jenis Lantai <span className="required-mark">*</span></label>
            <SmartSelect
              name="jenisLantai"
              value={formData.jenisLantai}
              onChange={handleInputChange}
              category="jenisLantai"
              baseOptions={JENIS_LANTAI_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Luas (m²) */}
          <div className={`form-group ${isRequiredEmpty('luas') ? 'error' : ''} ${isRequiredEmpty('luas') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Luas (m²) <span className="required-mark">*</span></label>
            <input type="number" name="luas" value={formData.luas} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Rencana Pengembangan (m²) */}
          <div className="form-group">
            <label className="form-label">Rencana Pengembangan (m²)</label>
            <input type="number" name="rencanaPengembanganLuas" value={formData.rencanaPengembanganLuas} onChange={handleInputChange} className="form-input" />
          </div>

          {/* Jarak (m) */}
          <div className={`form-group ${isRequiredEmpty('jarak') ? 'error' : ''} ${isRequiredEmpty('jarak') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Jarak (m) <span className="required-mark">*</span></label>
            <input type="number" name="jarak" value={formData.jarak} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Nilai (Rp) */}
          <div className="form-group">
            <label className="form-label">Nilai (Rp)</label>
            <input type="number" name="nilai" value={formData.nilai} onChange={handleInputChange} className="form-input" />
          </div>

          {/* Sumber Dana */}
          <div className={`form-group ${isRequiredEmpty('sumberDana') ? 'error' : ''} ${isRequiredEmpty('sumberDana') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Sumber Dana <span className="required-mark">*</span></label>
            <SmartSelect
              name="sumberDana"
              value={formData.sumberDana}
              onChange={handleInputChange}
              category="sumberDana"
              baseOptions={SUMBER_DANA_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Footer standar: Gambar, Ket Rehab, Ket Konstruksi, Ket Sumber Dana, Aktif */}
          <div className="form-group full-width">
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
              openLightbox={null}
            />
          </div>

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
                pelabuhan: '', jenisFasilitas: '', namaFasilitas: '', tahunPembuatan: '', jenisKonstruksi: '', kondisiKonstruksi: '', jenisLantai: '', luas: '', rencanaPengembanganLuas: '', jarak: '', nilai: '', keteranganKonstruksi: '', sumberDana: '', keteranganSumberDana: '', gambar: null, aktif: false
              })}
            >Hapus Isian</button>
          </div>
        </div>
      </form>
    </div>
  )
}