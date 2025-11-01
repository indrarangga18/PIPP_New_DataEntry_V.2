import React, { useMemo, useState, useEffect, useRef } from 'react'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import '../../styles/fasilitas-form.css'
import SmartSelect from '../../components/SmartSelect'
import RichTextEditor from '../../components/RichTextEditor'
import { createIsRequiredEmpty, createIsSaveDisabled } from '../../utils/formValidation'
import { TIPE_BERITA_OPTIONS } from '../../utils/formStandards'

// Helper: format size
const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '-'
  const units = ['B','KB','MB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }
  return `${size.toFixed(2)} ${units[unit]}`
}

// Compress image into JPEG under ~2MB using quality fallback and optional downscale
async function compressImage(file, maxBytes = 2 * 1024 * 1024) {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  ctx.drawImage(bitmap, 0, 0)

  const tryQualities = [0.92, 0.88, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6]
  for (let q of tryQualities) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', q))
    if (blob && blob.size <= maxBytes) {
      return { blob, info: { width: canvas.width, height: canvas.height, quality: q } }
    }
  }

  // If still large, attempt downscale proportionally
  let scale = 0.9
  while (scale > 0.4) {
    const w = Math.floor(bitmap.width * scale)
    const h = Math.floor(bitmap.height * scale)
    canvas.width = w
    canvas.height = h
    ctx.drawImage(bitmap, 0, 0, w, h)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8))
    if (blob && blob.size <= maxBytes) {
      return { blob, info: { width: w, height: h, quality: 0.8 } }
    }
    scale -= 0.1
  }

  // Fallback to last attempt even if > maxBytes
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.6))
  return { blob, info: { width: canvas.width, height: canvas.height, quality: 0.6 } }
}

export default function BeritaEntry() {
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    tipeBerita: '',
    isi: '',
    keyword1: '',
    keyword2: '',
    keyword3: '',
  })
  const [images, setImages] = useState([]) // {name, size, url, blob}
  const [fileError, setFileError] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [doShake, setDoShake] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)

  const required = useMemo(() => ({
    textKeys: ['judul','tanggal','tipeBerita','isi','keyword1','keyword2'],
    numericKeys: [],
  }), [])
  const isRequiredEmpty = createIsRequiredEmpty(formData, required)
  const saveDisabled = createIsSaveDisabled(isRequiredEmpty, ['judul','tanggal','tipeBerita','isi','keyword1','keyword2'])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    let nextValue = value
    if (name === 'judul') {
      // Enforce no uppercase, Arial size 12, non-bold handled via style
      nextValue = (value || '').toLowerCase()
    }
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
  }

  const handleIsiChange = (html) => {
    setFormData((prev) => ({ ...prev, isi: html }))
  }

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) {
      setImages([])
      setFileError('')
      return
    }
    setFileError('')
    const processed = []
    for (const file of files) {
      try {
        const { blob, info } = await compressImage(file, 2 * 1024 * 1024)
        const url = URL.createObjectURL(blob)
        processed.push({ name: file.name, size: blob.size, url, blob, info, originalSize: file.size })
      } catch (err) {
        setFileError('Gagal memproses gambar: ' + (file?.name || ''))
      }
    }
    setImages(processed)
  }

  const openPreview = () => {
    setDoShake(true)
    if (saveDisabled) return
    setPreviewOpen(true)
  }

  const handleClosePreview = () => setPreviewOpen(false)

  const submitData = async () => {
    // Simulasi simpan; integrasi API bisa ditambahkan nanti
    try {
      const payload = {
        ...formData,
        keywords: [formData.keyword1, formData.keyword2, formData.keyword3].filter(Boolean),
        images: images.map((img) => ({ name: img.name, size: img.size })),
      }
      console.log('Simpan Berita:', payload)
      setConfirmOpen(false)
      setPreviewOpen(false)
    } catch (e) {
      console.error('Gagal simpan:', e)
    }
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h3 className="section-subtitle">Entry Berita PIPP</h3>
      <p className="section-desc">Lengkapi form di bawah untuk menambahkan berita.</p>

      <form className="fasilitas-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          {/* Judul Berita */}
          <div className={`form-group ${isRequiredEmpty('judul') ? 'error' : ''} ${isRequiredEmpty('judul') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Judul Berita <span className="required-mark">*</span></label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              className="form-input"
              style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, fontWeight: 400 }}
              placeholder="tulis judul berita (huruf kecil, Arial 12)"
              required
            />
          </div>

          {/* Tanggal Berita */}
          <div className={`form-group ${isRequiredEmpty('tanggal') ? 'error' : ''} ${isRequiredEmpty('tanggal') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Tanggal Berita <span className="required-mark">*</span></label>
            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} className="form-input" required />
          </div>

          {/* Tipe Berita */}
          <div className={`form-group ${isRequiredEmpty('tipeBerita') ? 'error' : ''} ${isRequiredEmpty('tipeBerita') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Tipe Berita <span className="required-mark">*</span></label>
            <SmartSelect
              name="tipeBerita"
              value={formData.tipeBerita}
              onChange={handleInputChange}
              category="tipeBerita"
              baseOptions={TIPE_BERITA_OPTIONS}
              className="form-select"
              placeholder="Pilih tipe berita..."
              required
            />
          </div>

          {/* Isi Berita */}
          <div className={`form-group full-width ${isRequiredEmpty('isi') ? 'error' : ''} ${isRequiredEmpty('isi') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Isi Berita <span className="required-mark">*</span></label>
          <RichTextEditor value={formData.isi} onChange={handleIsiChange} placeholder="Tulis isi berita..." />
          </div>

          {/* Keyword Berita (2 wajib, 1 opsional) */}
          <div className="form-group full-width">
            <label className="form-label">Keyword Berita <span className="required-mark">*</span> (Keyword 1 & 2 wajib)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              <input type="text" name="keyword1" value={formData.keyword1} onChange={handleInputChange} className="form-input" placeholder="Keyword 1 (wajib)" required />
              <input type="text" name="keyword2" value={formData.keyword2} onChange={handleInputChange} className="form-input" placeholder="Keyword 2 (wajib)" required />
              <input type="text" name="keyword3" value={formData.keyword3} onChange={handleInputChange} className="form-input" placeholder="Keyword 3 (opsional)" />
            </div>
          </div>

          {/* Upload Gambar (multi, max 2MB per image, compress, preview) */}
          <div className="form-group full-width">
            <label className="form-label">Upload Gambar</label>
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="form-input" />
            {fileError && (<div className="error-hint">{fileError}</div>)}
            {!!images.length && (
              <div className="image-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 8 }}>
                {images.map((img, idx) => (
                  <div key={idx} className="image-preview" style={{ maxWidth: '100%' }}>
                    <img src={img.url} alt={img.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                    <button
                      type="button"
                      className="preview-overlay-btn"
                      onClick={() => { setLightboxImage(img); setLightboxOpen(true); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.45)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" fill="#fff"/>
                        <circle cx="12" cy="12" r="2.8" fill="#fff"/>
                      </svg>
                      Preview
                    </button>
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      <div><strong>{img.name}</strong></div>
                      <div>Ukuran: {formatFileSize(img.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aksi Simpan */}
          <div className="form-actions">
            <button type="button" className="btn btn-primary btn-lg btn-wide" onClick={openPreview} disabled={saveDisabled}>Simpan</button>
            {saveDisabled && (<span className="save-hint">Lengkapi field wajib untuk menyimpan</span>)}
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Preview Hasil Isian</h3>
            </div>
            <div className="modal-body">
              <div className="preview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                <div className="preview-item"><strong>Judul:</strong> <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, fontWeight: 400 }}>{formData.judul}</span></div>
                <div className="preview-item"><strong>Tanggal:</strong> {formData.tanggal}</div>
                <div className="preview-item"><strong>Tipe:</strong> {formData.tipeBerita}</div>
                <div className="preview-item">
                  <strong>Isi:</strong>
                  <div className="ck-content" style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, marginTop: 6 }} dangerouslySetInnerHTML={{ __html: formData.isi }} />
                </div>
                {!!images.length && (
                  <div className="preview-item">
                    <strong>Gambar:</strong>
                    <div className="image-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 8 }}>
                      {images.map((img, idx) => (
                        <div key={idx} className="preview-item preview-image" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                          <img src={img.url} alt={img.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }} />
                          <div style={{ marginTop: 6, fontSize: 12 }}>
                            <div><strong>{img.name}</strong></div>
                            <div>Ukuran: {formatFileSize(img.size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleClosePreview}>Edit Kembali</button>
              <button className="btn btn-primary" onClick={() => setConfirmOpen(true)}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Konfirmasi Simpan</h3>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0 }}>Apakah Anda sudah yakin akan menyimpan data ini?</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={submitData}>Ya, Simpan</button>
              <button className="btn btn-secondary" onClick={() => { setConfirmOpen(false); handleClosePreview(); }}>Edit Kembali</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox (Zoom/Pan) */}
      {lightboxOpen && lightboxImage && (
        <Lightbox
          image={lightboxImage}
          onClose={() => setLightboxOpen(false)}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  )
}

// Lightbox dengan kontrol zoom dan pan
function Lightbox({ image, onClose, formatFileSize }) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [pinching, setPinching] = useState(false)
  const [initialPinchDistance, setInitialPinchDistance] = useState(0)
  const [initialZoom, setInitialZoom] = useState(1)
  const lastTouch = useRef({ x: 0, y: 0 })
  const viewportRef = useRef(null)
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 })

  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [image?.url])

  const onWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((z) => Math.min(5, Math.max(1, parseFloat((z + delta).toFixed(2)))))
  }

  const onMouseDown = (e) => {
    if (zoom <= 1) return
    setDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const onMouseMove = (e) => {
    if (!dragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const onMouseUp = () => setDragging(false)
  const onMouseLeave = () => setDragging(false)

  const zoomIn = () => setZoom((z) => Math.min(5, parseFloat((z + 0.25).toFixed(2))))
  const zoomOut = () => setZoom((z) => Math.max(1, parseFloat((z - 0.25).toFixed(2))))
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  // Touch handlers for mobile pinch-zoom and pan
  const distanceBetweenTouches = (t1, t2) => {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const onTouchStart = (e) => {
    if (!image) return
    if (e.touches.length === 1) {
      const t = e.touches[0]
      lastTouch.current = { x: t.clientX, y: t.clientY }
      if (zoom > 1) {
        setDragging(true)
      }
    } else if (e.touches.length === 2) {
      const d = distanceBetweenTouches(e.touches[0], e.touches[1])
      setInitialPinchDistance(d)
      setInitialZoom(zoom)
      setPinching(true)
    }
  }

  const onTouchMove = (e) => {
    if (!image) return
    if (pinching && e.touches.length === 2) {
      e.preventDefault()
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      const d = distanceBetweenTouches(t0, t1)
      const rect = viewportRef.current?.getBoundingClientRect()
      const cx = ((t0.clientX + t1.clientX) / 2) - (rect?.left || 0)
      const cy = ((t0.clientY + t1.clientY) / 2) - (rect?.top || 0)
      if (initialPinchDistance > 0) {
        const ratio = d / initialPinchDistance
        const nextZoom = Math.min(5, Math.max(1, parseFloat((initialZoom * ratio).toFixed(2))))
        // Adjust pan to keep focal point stable
        setPan((p) => ({
          x: cx - (nextZoom / zoom) * (cx - p.x),
          y: cy - (nextZoom / zoom) * (cy - p.y)
        }))
        setZoom(nextZoom)
      }
      return
    }
    if (dragging && e.touches.length === 1) {
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - lastTouch.current.x
      const dy = t.clientY - lastTouch.current.y
      lastTouch.current = { x: t.clientX, y: t.clientY }
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
    }
  }

  const onTouchEnd = (e) => {
    const now = Date.now()
    if (e.touches.length === 0) {
      // Double-tap detection for quick zoom
      const ct = e.changedTouches && e.changedTouches[0]
      if (ct) {
        const rect = viewportRef.current?.getBoundingClientRect()
        const x = ct.clientX - (rect?.left || 0)
        const y = ct.clientY - (rect?.top || 0)
        const dt = now - (lastTapRef.current.time || 0)
        const dx = x - (lastTapRef.current.x || 0)
        const dy = y - (lastTapRef.current.y || 0)
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dt < 300 && dist < 30) {
          // Toggle zoom: zoom in to 2x, otherwise reset to 1x
          const targetZoom = zoom < 2 ? 2 : 1
          const newPan = {
            x: x - (targetZoom / zoom) * (x - pan.x),
            y: y - (targetZoom / zoom) * (y - pan.y)
          }
          setPan(newPan)
          setZoom(targetZoom)
        } else {
          lastTapRef.current = { time: now, x, y }
        }
      }
      setDragging(false)
      setPinching(false)
      setInitialPinchDistance(0)
    } else if (e.touches.length === 1) {
      // Transition from pinch to possible drag
      setPinching(false)
      if (zoom > 1) {
        setDragging(true)
      }
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '80vw', maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="modal-title">Pratinjau Gambar</h3>
          <div className="zoom-controls" style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={zoomOut} disabled={zoom <= 1}>-</button>
            <span style={{ minWidth: 60, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button type="button" className="btn" onClick={zoomIn}>+</button>
            <button type="button" className="btn" onClick={resetView}>Reset</button>
          </div>
        </div>
        <div className="modal-body">
          {image && (
            <div
              className="lightbox-viewport"
              style={{ width: '100%', height: '70vh', overflow: 'hidden', cursor: zoom > 1 && dragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default', touchAction: 'none' }}
              ref={viewportRef}
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={image.url}
                alt={image.name}
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  userSelect: 'none',
                }}
              />
            </div>
          )}
          {image && (
            <div className="image-meta" style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12 }}>{image.name} • {formatFileSize(image.size)}</div>
              <button type="button" className="btn" onClick={onClose}>Tutup</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}