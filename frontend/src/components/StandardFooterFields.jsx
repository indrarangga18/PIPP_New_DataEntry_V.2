import React from 'react'

// Komponen footer standar untuk urutan field di bagian bawah form:
// 1) Gambar, 2) Keterangan Rehab, 3) Keterangan Konstruksi, 4) Keterangan Sumber Dana, 5) Aktif
// Komponen ini mengasumsikan adanya properti dan handler yang umum dipakai di halaman-halaman form.
// Gunakan className dan gaya yang sudah ada agar konsisten dengan UI saat ini.

const StandardFooterFields = ({
  formData,
  openTip,
  setOpenTip,
  TIPS,
  handleInputChange,
  handleFileChange,
  fileError,
  fileInfo,
  imagePreview,
  openLightbox,
}) => {
  return (
    <>
      {/* Gambar */}
      <div className={`form-group full-width ${fileError ? 'error' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
        <label className="form-label">Gambar
          <span
            className="tooltip-trigger"
            role="button"
            aria-label={TIPS.gambar}
            onMouseEnter={() => setOpenTip('gambar')}
            style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
          >?</span>
        </label>
        {openTip === 'gambar' && (
          <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
            <div style={{ fontSize: 12 }}>{TIPS.gambar}</div>
            <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <input type="file" name="gambar" accept="image/*,application/pdf" onChange={handleFileChange} className="form-input" />
        {fileError && (<div className="field-error">{fileError}</div>)}
        {!fileError && fileInfo && (<div className="field-info">{fileInfo}</div>)}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            {openLightbox && (
              <button type="button" className="preview-overlay-btn" aria-label="Pratinjau gambar" onClick={() => openLightbox(imagePreview)}>Preview</button>
            )}
          </div>
        )}
      </div>

      {/* Keterangan Rehab */}
      <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
        <label className="form-label">Keterangan Rehab
          <span
            className="tooltip-trigger"
            role="button"
            aria-label={TIPS.keteranganRehab}
            onMouseEnter={() => setOpenTip('keteranganRehab')}
            style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
          >?</span>
        </label>
        {openTip === 'keteranganRehab' && (
          <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
            <div style={{ fontSize: 12 }}>{TIPS.keteranganRehab}</div>
            <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <textarea
          name="keteranganRehab"
          value={formData.keteranganRehab}
          onChange={handleInputChange}
          className="form-input"
          rows={3}
          placeholder="Contoh: uraian rehab/pekerjaan, catatan tambahan"
        />
      </div>

      {/* Keterangan Konstruksi */}
      <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
        <label className="form-label">Keterangan Konstruksi
          <span
            className="tooltip-trigger"
            role="button"
            aria-label={TIPS.keteranganKonstruksi}
            onMouseEnter={() => setOpenTip('keteranganKonstruksi')}
            style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
          >?</span>
        </label>
        {openTip === 'keteranganKonstruksi' && (
          <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
            <div style={{ fontSize: 12 }}>{TIPS.keteranganKonstruksi}</div>
            <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <textarea
          name="keteranganKonstruksi"
          value={formData.keteranganKonstruksi}
          onChange={handleInputChange}
          className="form-input"
          rows={3}
          placeholder="Contoh: material, metode, catatan teknis"
        />
      </div>

      {/* Keterangan Sumber Dana */}
      <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
        <label className="form-label">Keterangan Sumber Dana
          <span
            className="tooltip-trigger"
            role="button"
            aria-label={TIPS.keteranganSumberDana}
            onMouseEnter={() => setOpenTip('keteranganSumberDana')}
            style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
          >?</span>
        </label>
        {openTip === 'keteranganSumberDana' && (
          <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
            <div style={{ fontSize: 12 }}>{TIPS.keteranganSumberDana}</div>
            <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <textarea
          name="keteranganSumberDana"
          value={formData.keteranganSumberDana}
          onChange={handleInputChange}
          className="form-input"
          rows={3}
          placeholder="Contoh: detail tambahan terkait sumber dana"
        />
      </div>

      {/* Aktif */}
      <div className="form-group full-width" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
        <label className="form-label">Aktif
          <span
            className="tooltip-trigger"
            role="button"
            aria-label={TIPS.aktif}
            onMouseEnter={() => setOpenTip('aktif')}
            style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
          >?</span>
        </label>
        {openTip === 'aktif' && (
          <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
            <div style={{ fontSize: 12 }}>{TIPS.aktif}</div>
            <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <div className="switch-container">
          <label className="switch">
            <input type="checkbox" name="aktif" checked={!!formData.aktif} onChange={handleInputChange} />
            <span className="slider"></span>
          </label>
          <span className="switch-label">{formData.aktif ? 'Aktif' : 'Tidak Aktif'}</span>
        </div>
      </div>
    </>
  )
}

export default StandardFooterFields