import React, { useState } from 'react'
import '../styles/fasilitas-form.css'
import FormHeader from '../components/FormHeader'
import SmartSelect from '../components/SmartSelect'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../utils/formValidation'
import { PELABUHAN_OPTIONS } from '../utils/formStandards'

const TIPS = {
  pelabuhan: 'Pilih pelabuhan yang relevan untuk data perkantoran.',
  namaLembaga: 'Masukkan nama lembaga/perkantoran secara lengkap.',
  alamat: 'Tuliskan alamat lengkap lokasi perkantoran.',
  namaPimpinan: 'Masukkan nama pimpinan/penanggung jawab lembaga.',
  jumlahTenaga: 'Isi jumlah tenaga kerja aktif (numeric).'
}

export default function FasilitasFungsionalPerkantoran() {
  const [formData, setFormData] = useState({
    pelabuhan: '',
    namaLembaga: '',
    alamat: '',
    namaPimpinan: '',
    jumlahTenaga: '',
  })
  const [openTip, setOpenTip] = useState(null)
  const [doShake, setDoShake] = useState(false)

  const isRequiredEmpty = createIsRequiredEmpty(formData, {
    textKeys: ['pelabuhan', 'namaLembaga', 'alamat', 'namaPimpinan'],
    numericKeys: ['jumlahTenaga'],
  })
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['pelabuhan', 'namaLembaga', 'alamat', 'namaPimpinan', 'jumlahTenaga'])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (saveDisabled) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 500)
      return
    }
    // TODO: Integrasi penyimpanan data
    alert('Data Perkantoran tersimpan (mock).')
  }

  return (
    <div className="section-card">
      <FormHeader
        title="Fasilitas Fungsional — Perkantoran"
        description="Form input data perkantoran sesuai standar."
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
          {/* Nama Lembaga */}
          <div className={`form-group ${isRequiredEmpty('namaLembaga') ? 'error' : ''} ${isRequiredEmpty('namaLembaga') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Lembaga <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaLembaga} onMouseEnter={() => setOpenTip('namaLembaga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'namaLembaga' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.namaLembaga}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="text" name="namaLembaga" value={formData.namaLembaga} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Alamat */}
          <div className={`form-group full-width ${isRequiredEmpty('alamat') ? 'error' : ''} ${isRequiredEmpty('alamat') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Alamat <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.alamat} onMouseEnter={() => setOpenTip('alamat')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'alamat' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.alamat}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="form-input" rows={3} required />
          </div>

          {/* Nama Pimpinan */}
          <div className={`form-group ${isRequiredEmpty('namaPimpinan') ? 'error' : ''} ${isRequiredEmpty('namaPimpinan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nama Pimpinan <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.namaPimpinan} onMouseEnter={() => setOpenTip('namaPimpinan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'namaPimpinan' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.namaPimpinan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="text" name="namaPimpinan" value={formData.namaPimpinan} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Jumlah Tenaga */}
          <div className={`form-group ${isRequiredEmpty('jumlahTenaga') ? 'error' : ''} ${isRequiredEmpty('jumlahTenaga') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jumlah Tenaga <span className="required-mark">*</span>
              <span className="tooltip-trigger" role="button" aria-label={TIPS.jumlahTenaga} onMouseEnter={() => setOpenTip('jumlahTenaga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
            </label>
            {openTip === 'jumlahTenaga' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jumlahTenaga}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input type="number" name="jumlahTenaga" value={formData.jumlahTenaga} onChange={handleInputChange} className="form-input" required />
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
              onClick={() => setFormData({ pelabuhan: '', namaLembaga: '', alamat: '', namaPimpinan: '', jumlahTenaga: '' })}
            >Hapus Isian</button>
          </div>
        </div>
      </form>
    </div>
  )
}