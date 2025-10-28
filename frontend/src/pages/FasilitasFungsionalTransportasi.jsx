import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS } from '../utils/formStandards'

const JENIS_FASILITAS_PEMASARAN_OPTIONS = [
  'Transportasi Darat',
  'Transportasi Laut',
  'Transportasi Udara',
]
const JENIS_KONSTRUKSI_OPTIONS = ['Beton', 'Baja', 'Kayu', 'Campuran']
const JENIS_LANTAI_OPTIONS = ['Beton', 'Aspal', 'Paving', 'Tanah', 'Kayu']

const TIPS = {
  pelabuhan: 'Pilih pelabuhan tujuan data transportasi.',
  jenisFasilitasPemasaran: 'Pilih jenis fasilitas pemasaran terkait transportasi.',
  namaFasilitasPemasaran: 'Masukkan nama fasilitas pemasaran yang spesifik.',
  tahunPembuatan: 'Isi tahun pembuatan (4 digit).',
  jenisKonstruksi: 'Pilih jenis konstruksi utama fasilitas.',
  jenisLantai: 'Pilih jenis lantai/permukaan.',
  luas: 'Isi luas area dalam meter persegi.',
  rencanaPengembanganLuas: 'Isi rencana pengembangan luas (opsional).',
  jarak: 'Isi jarak dalam meter dari referensi lokasi.',
  nilai: 'Isi perkiraan nilai (opsional).',
  sumberDana: 'Pilih sumber dana utama fasilitas.',
  // Footer tips
  gambar: 'Unggah gambar atau PDF terkait fasilitas (opsional).',
  keteranganRehab: 'Catat keterangan rehab/pekerjaan terkait fasilitas (opsional).',
  keteranganKonstruksi: 'Catat detail konstruksi tambahan (opsional).',
  keteranganSumberDana: 'Catat detail tambahan terkait sumber dana (opsional).',
  aktif: 'Tandai apakah fasilitas ini saat ini aktif atau tidak.',
}

export default function FasilitasFungsionalTransportasi() {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    jenisFasilitasPemasaran: '',
    namaFasilitasPemasaran: '',
    tahunPembuatan: '',
    jenisKonstruksi: '',
    jenisLantai: '',
    luas: '',
    rencanaPengembanganLuas: '',
    jarak: '',
    nilai: '',
    keteranganKonstruksi: '',
    keteranganSumberDana: '',
    sumberDana: '',
    gambar: null,
    aktif: false,
  })
  const [openTip, setOpenTip] = useState(null)
  const [doShake, setDoShake] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [fileInfo, setFileInfo] = useState('')

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan', 'namaFasilitasPemasaran'],
    selectKeys: ['jenisFasilitasPemasaran', 'jenisKonstruksi', 'jenisLantai', 'sumberDana'],
    numericKeys: ['tahunPembuatan', 'luas', 'jarak'],
    booleanKeys: ['aktif'],
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','jenisFasilitasPemasaran','namaFasilitasPemasaran','tahunPembuatan','jenisKonstruksi','jenisLantai','luas','jarak','sumberDana','aktif'])

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
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
    alert('Data Transportasi tersimpan (mock).')
  }

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Fungsional — Transportasi"
        description="Form input fasilitas transportasi pemasaran sesuai standar."
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
          {/* Jenis Fasilitas Pemasaran */}
          <div className={`form-group ${isRequiredEmpty('jenisFasilitasPemasaran') ? 'error' : ''} ${isRequiredEmpty('jenisFasilitasPemasaran') && doShake ? 'shake' : ''}`} onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Jenis Fasilitas Pemasaran
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisFasilitasPemasaran} onMouseEnter={() => setOpenTip('jenisFasilitasPemasaran')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
              <span className="required-mark">*</span>
            </label>
            {openTip === 'jenisFasilitasPemasaran' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jenisFasilitasPemasaran}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <SmartSelect
              name="jenisFasilitasPemasaran"
              value={formData.jenisFasilitasPemasaran}
              onChange={handleInputChange}
              category="jenisFasilitasPemasaran"
              baseOptions={JENIS_FASILITAS_PEMASARAN_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Nama Fasilitas Pemasaran */}
          <div className={`form-group ${isRequiredEmpty('namaFasilitasPemasaran') ? 'error' : ''} ${isRequiredEmpty('namaFasilitasPemasaran') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Fasilitas Pemasaran <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaFasilitasPemasaran} onMouseEnter={() => setOpenTip('namaFasilitasPemasaran')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'namaFasilitasPemasaran' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.namaFasilitasPemasaran}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="text" name="namaFasilitasPemasaran" value={formData.namaFasilitasPemasaran} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Tahun Pembuatan */}
          <div className={`form-group ${isRequiredEmpty('tahunPembuatan') ? 'error' : ''} ${isRequiredEmpty('tahunPembuatan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tahun Pembuatan <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tahunPembuatan} onMouseEnter={() => setOpenTip('tahunPembuatan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'tahunPembuatan' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.tahunPembuatan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
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

          {/* Luas (m2) */}
          <div className={`form-group ${isRequiredEmpty('luas') ? 'error' : ''} ${isRequiredEmpty('luas') && doShake ? 'shake' : ''}`} onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Luas (m2) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.luas} onMouseEnter={() => setOpenTip('luas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'luas' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.luas}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="luas" value={formData.luas} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Rencana Pengembangan Luas (m2) */}
          <div className="form-group">
            <label className="form-label">Rencana Pengembangan Luas (m2)</label>
            <input type="number" name="rencanaPengembanganLuas" value={formData.rencanaPengembanganLuas} onChange={handleInputChange} className="form-input" />
          </div>

          {/* Jarak (m) */}
          <div className={`form-group ${isRequiredEmpty('jarak') ? 'error' : ''} ${isRequiredEmpty('jarak') && doShake ? 'shake' : ''}`} onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Jarak (m) <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jarak} onMouseEnter={() => setOpenTip('jarak')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'jarak' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jarak}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="jarak" value={formData.jarak} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Nilai (Rp) */}
          <div className="form-group" onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Nilai (Rp)
              <span className="tooltip-trigger" role="button" aria-label={TIPS.nilai} onMouseEnter={() => setOpenTip('nilai')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'nilai' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.nilai}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
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
              baseOptions={['APBN','APBD','DAK','Hibah','Swasta']}
              className="form-select"
              required
            />
          </div>

          {/* Footer standar: Keterangan Konstruksi, Ket Sumber Dana, Gambar, Aktif */}
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
              onClick={() => setFormData({ pelabuhan: '', jenisFasilitasPemasaran: '', namaFasilitasPemasaran: '', tahunPembuatan: '', jenisKonstruksi: '', jenisLantai: '', luas: '', rencanaPengembanganLuas: '', jarak: '', nilai: '', keteranganKonstruksi: '', keteranganSumberDana: '', sumberDana: '', gambar: null, aktif: false })}
            >Hapus Isian</button>
          </div>
        </div>
      </form>
    </div>
  )
}