import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import StandardFooterFields from '../components/StandardFooterFields'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS } from '../utils/formStandards'

const JENIS_LIMBAH_OPTIONS = ['Cair', 'Padat', 'B3', 'Organik', 'Anorganik']

const TIPS = {
  pelabuhan: 'Pilih pelabuhan untuk fasilitas kebersihan/olah limbah.',
  namaOlahLimbah: 'Masukkan nama unit pengolahan limbah.',
  tahunPembuatan: 'Isi tahun pembuatan (4 digit).',
  jenisLimbah: 'Pilih jenis limbah yang diolah.',
  kapasitas: 'Isi kapasitas pengolahan (opsional).',
  rencanaPengembanganKapasitas: 'Isi rencana pengembangan kapasitas (opsional).',
  luas: 'Isi luas fasilitas (wajib).',
  rencanaPengembanganLuas: 'Isi rencana pengembangan luas (opsional).',
  sumberDana: 'Pilih sumber dana (wajib).',
  nilai: 'Nilai pembiayaan/asset (opsional).',
  keterangan: 'Catatan umum terkait fasilitas (opsional).',
  // Footer tips
  gambar: 'Unggah gambar atau PDF terkait fasilitas (opsional).',
  keteranganRehab: 'Catat keterangan rehab/pekerjaan (opsional).',
  keteranganKonstruksi: 'Catat detail konstruksi (opsional).',
  keteranganSumberDana: 'Catat detail tambahan terkait sumber dana (opsional).',
  aktif: 'Tandai aktif/tidak aktif.',
}

export default function FasilitasFungsionalKebersihanLimbah() {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    namaOlahLimbah: '',
    tahunPembuatan: '',
    keteranganRehab: '',
    jenisLimbah: '',
    kapasitas: '',
    rencanaPengembanganKapasitas: '',
    luas: '',
    rencanaPengembanganLuas: '',
    keteranganKonstruksi: '',
    keteranganSumberDana: '',
    sumberDana: '',
    nilai: '',
    keterangan: '',
    gambar: null,
    aktif: false,
  })
  const [openTip, setOpenTip] = useState(null)
  const [doShake, setDoShake] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileError, setFileError] = useState('')
  const [fileInfo, setFileInfo] = useState('')

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan', 'namaOlahLimbah'],
    selectKeys: ['jenisLimbah', 'sumberDana'],
    numericKeys: ['tahunPembuatan', 'luas'],
    booleanKeys: ['aktif'],
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','namaOlahLimbah','tahunPembuatan','jenisLimbah','luas','sumberDana','aktif'])

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
    alert('Data Kebersihan & Limbah tersimpan (mock).')
  }

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Fungsional — Kebersihan & Limbah"
        description="Form input fasilitas kebersihan dan pengolahan limbah."
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
          {/* Nama Olah Limbah */}
          <div className={`form-group ${isRequiredEmpty('namaOlahLimbah') ? 'error' : ''} ${isRequiredEmpty('namaOlahLimbah') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Olah Limbah <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaOlahLimbah} onMouseEnter={() => setOpenTip('namaOlahLimbah')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'namaOlahLimbah' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.namaOlahLimbah}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="text" name="namaOlahLimbah" value={formData.namaOlahLimbah} onChange={handleInputChange} className="form-input" required />
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

          {/* Jenis Limbah */}
          <div className={`form-group ${isRequiredEmpty('jenisLimbah') ? 'error' : ''} ${isRequiredEmpty('jenisLimbah') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Jenis Limbah <span className="required-mark">*</span></label>
            <SmartSelect
              name="jenisLimbah"
              value={formData.jenisLimbah}
              onChange={handleInputChange}
              category="jenisLimbah"
              baseOptions={JENIS_LIMBAH_OPTIONS}
              className="form-select"
              required
            />
          </div>

          {/* Kapasitas */}
          <div className="form-group" onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Kapasitas
              <span className="tooltip-trigger" role="button" aria-label={TIPS.kapasitas} onMouseEnter={() => setOpenTip('kapasitas')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'kapasitas' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.kapasitas}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="kapasitas" value={formData.kapasitas} onChange={handleInputChange} className="form-input" />
          </div>

          {/* Rencana Pengembangan (Kapasitas) */}
          <div className="form-group">
            <label className="form-label">Rencana Pengembangan (Kapasitas)</label>
            <input type="number" name="rencanaPengembanganKapasitas" value={formData.rencanaPengembanganKapasitas} onChange={handleInputChange} className="form-input" />
          </div>

          {/* Luas */}
          <div className={`form-group ${isRequiredEmpty('luas') ? 'error' : ''} ${isRequiredEmpty('luas') && doShake ? 'shake' : ''}`} onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Luas <span className="required-mark">*</span>
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

          {/* Rencana Pengembangan (Luas) */}
          <div className="form-group">
            <label className="form-label">Rencana Pengembangan (Luas)</label>
            <input type="number" name="rencanaPengembanganLuas" value={formData.rencanaPengembanganLuas} onChange={handleInputChange} className="form-input" />
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

          {/* Nilai */}
          <div className="form-group" onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Nilai
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

          {/* Keterangan umum */}
          <div className="form-group full-width" onMouseLeave={() => setOpenTip(null)} style={{ position: 'relative' }}>
            <label className="form-label">Keterangan
              <span className="tooltip-trigger" role="button" aria-label={TIPS.keterangan} onMouseEnter={() => setOpenTip('keterangan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help' }}>?</span>
            </label>
            {openTip === 'keterangan' && (
              <div role="dialog" aria-label="Informasi" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.keterangan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <textarea name="keterangan" value={formData.keterangan} onChange={handleInputChange} rows={3} className="form-input" />
          </div>

          {/* Footer standar: Keterangan Rehab, Keterangan Konstruksi, Ket Sumber Dana, Gambar, Aktif */}
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
              onClick={() => setFormData({ pelabuhan: '', namaOlahLimbah: '', tahunPembuatan: '', keteranganRehab: '', jenisLimbah: '', kapasitas: '', rencanaPengembanganKapasitas: '', luas: '', rencanaPengembanganLuas: '', keteranganKonstruksi: '', sumberDana: '', nilai: '', keterangan: '', gambar: null, aktif: false })}
            >Hapus Isian</button>
          </div>
        </div>
      </form>
    </div>
  )
}