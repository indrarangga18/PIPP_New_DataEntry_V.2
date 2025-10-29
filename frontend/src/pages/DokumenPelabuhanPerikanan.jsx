import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import AutoBreadcrumb from '../components/AutoBreadcrumb'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS, TIPE_DOKUMEN_OPTIONS } from '../utils/formStandards'

export default function DokumenPelabuhanPerikanan(){
  const [formData, setFormData] = useState({
    pelabuhan: '',
    judulDokumen: '',
    tipeDokumen: '',
    tahun: '',
    tempatPenetapan: '',
    dariTanggal: '',
    sampaiTanggal: '',
    deskripsi: '',
  })
  const [openTip, setOpenTip] = useState(null)
  const [doShake, setDoShake] = useState(false)

  const CURRENT_YEAR = new Date().getFullYear()
  const MIN_YEAR = 1950
  const yearOptions = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => String(CURRENT_YEAR - i))

  const TIPS = {
    pelabuhan: 'Pilih pelabuhan terkait dokumen.',
    judulDokumen: 'Masukkan judul dokumen secara jelas dan ringkas.',
    tipeDokumen: 'Pilih tipe dokumen sesuai standar, dapat menambah jika perlu.',
    tahun: 'Tahun penetapan/penerbitan dokumen (tahun saja).',
    tempatPenetapan: 'Lokasi/tempat penetapan dokumen.',
    dariTanggal: 'Tanggal mulai berlakunya dokumen.',
    sampaiTanggal: 'Tanggal berakhirnya masa berlaku dokumen.',
    deskripsi: 'Deskripsi atau ringkasan isi dokumen (opsional).',
  }

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan','judulDokumen','tipeDokumen','tahun','tempatPenetapan','dariTanggal','sampaiTanggal'],
    numericKeys: [],
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan','judulDokumen','tipeDokumen','tahun','tempatPenetapan','dariTanggal','sampaiTanggal'])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSave = () => {
    if (saveDisabled) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 600)
      return
    }
    // TODO: Integrasikan ke API backend untuk menyimpan data dokumen
    console.log('Simpan dokumen pelabuhan perikanan:', formData)
    alert('Data dokumen siap disimpan (mock).')
  }

  const onReset = () => {
    setFormData({
      pelabuhan: '',
      judulDokumen: '',
      tipeDokumen: '',
      tahun: '',
      tempatPenetapan: '',
      dariTanggal: '',
      sampaiTanggal: '',
      deskripsi: '',
    })
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <FormHeader
        title="Dokumen Pelabuhan Perikanan"
        description="Dokumen persyaratan dan legal pelabuhan perikanan"
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
          {/* Judul Dokumen */}
          <div className={`form-group ${isRequiredEmpty('judulDokumen') ? 'error' : ''} ${isRequiredEmpty('judulDokumen') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Judul Dokumen <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.judulDokumen} onMouseEnter={() => setOpenTip('judulDokumen')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="judulDokumen" value={formData.judulDokumen} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Tipe Dokumen */}
          <div className={`form-group ${isRequiredEmpty('tipeDokumen') ? 'error' : ''} ${isRequiredEmpty('tipeDokumen') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tipe Dokumen <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tipeDokumen} onMouseEnter={() => setOpenTip('tipeDokumen')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <SmartSelect
              name="tipeDokumen"
              value={formData.tipeDokumen}
              onChange={handleInputChange}
              category="tipeDokumen"
              baseOptions={TIPE_DOKUMEN_OPTIONS}
              className="form-select"
              required
              placeholder="Pilih tipe dokumen"
            />
          </div>

          {/* Tahun */}
          <div className={`form-group ${isRequiredEmpty('tahun') ? 'error' : ''} ${isRequiredEmpty('tahun') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tahun <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tahun} onMouseEnter={() => setOpenTip('tahun')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <select name="tahun" value={formData.tahun} onChange={handleInputChange} className="form-select" required>
              <option value="">Pilih Tahun</option>
              {yearOptions.map(y => (<option key={y} value={y}>{y}</option>))}
            </select>
          </div>

          {/* Tempat Penetapan */}
          <div className={`form-group ${isRequiredEmpty('tempatPenetapan') ? 'error' : ''} ${isRequiredEmpty('tempatPenetapan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tempat Penetapan <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.tempatPenetapan} onMouseEnter={() => setOpenTip('tempatPenetapan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <input type="text" name="tempatPenetapan" value={formData.tempatPenetapan} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Masa Berlaku */}
          <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Masa Berlaku</label>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className={`${isRequiredEmpty('dariTanggal') ? 'error' : ''} ${isRequiredEmpty('dariTanggal') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }}>
                <label className="form-label">Dari Tanggal <span className="required-mark">*</span>
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.dariTanggal} onMouseEnter={() => setOpenTip('dariTanggal')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                </label>
                <input type="date" name="dariTanggal" value={formData.dariTanggal} onChange={handleInputChange} className="form-input" required />
              </div>
              <div className={`${isRequiredEmpty('sampaiTanggal') ? 'error' : ''} ${isRequiredEmpty('sampaiTanggal') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }}>
                <label className="form-label">Sampai Tanggal <span className="required-mark">*</span>
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.sampaiTanggal} onMouseEnter={() => setOpenTip('sampaiTanggal')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                </label>
                <input type="date" name="sampaiTanggal" value={formData.sampaiTanggal} onChange={handleInputChange} className="form-input" required />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Deskripsi
              <span className="tooltip-trigger" role="button" aria-label={TIPS.deskripsi} onMouseEnter={() => setOpenTip('deskripsi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} className="form-input" rows={3} placeholder="Ringkas isi atau catatan dokumen" />
          </div>

          {/* Aksi */}
          <div className="form-actions">
            <button type="button" className="btn btn-primary" disabled={saveDisabled} onClick={onSave}>Simpan Data</button>
            <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
          </div>
        </div>
      </form>
    </div>
  )
}