import React, { useState } from 'react'
import '../styles/fasilitas-form.css'

const FasilitasPokokJalan = () => {
  const [formData, setFormData] = useState({
    tahunPembuatan: '',
    keteranganRehab: '',
    bebanGandar: '',
    jenisKonstruksi: '',
    pelabuhan: '',
    panjang: '',
    rencanaPengembanganPanjang: '',
    lebar: '',
    rencanaPengembanganLebar: '',
    keteranganKonstruksi: '',
    sumberDana: '',
    nilai: '',
    nilaiDisplay: '',
    keteranganSumberDana: '',
    gambar: null,
    aktif: true
  })
  const [showPreview, setShowPreview] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [doShake, setDoShake] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [fileError, setFileError] = useState('')
  const [fileInfo, setFileInfo] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [lbZoom, setLbZoom] = useState(1)
  const [lbOffset, setLbOffset] = useState({ x: 0, y: 0 })
  const [lbDragging, setLbDragging] = useState(false)
  const [lbDragStart, setLbDragStart] = useState({ x: 0, y: 0 })
  const [openTip, setOpenTip] = useState(null)

  const TIPS = {
    tahunPembuatan: 'Pilih tahun pembuatan (tahun saja). Contoh: 2025',
    bebanGandar: 'Beban gandar kendaraan dalam ton. Gunakan angka desimal jika diperlukan. Contoh: 8 atau 8.5',
    jenisKonstruksi: 'Pilih material utama konstruksi ruas jalan. Contoh: Aspal',
    panjang: 'Panjang ruas dalam meter (angka). Contoh: 500',
    lebar: 'Lebar efektif ruas jalan dalam meter (angka). Contoh: 8',
    pelabuhan: 'Pelabuhan tempat fasilitas berada. Pilih dari daftar. Contoh: PPS Nizam Zachman Jakarta',
    sumberDana: 'Asal pendanaan (APBN, APBD, Hibah, dsb). Contoh: APBN, APBD, Hibah',
    keteranganRehab: 'Uraikan kegiatan rehab/pekerjaan. Contoh: Perbaikan permukaan aspal',
    rencanaPengembanganPanjang: 'Perkiraan penambahan panjang dalam meter. Contoh: 200',
    rencanaPengembanganLebar: 'Perkiraan penambahan lebar dalam meter. Contoh: 2',
    keteranganKonstruksi: 'Kondisi/keterangan konstruksi saat ini. Pilih yang paling sesuai.',
    nilai: 'Nilai anggaran/pengeluaran (format Rupiah). Contoh: 150.000.000',
    keteranganSumberDana: 'Detail tambahan terkait sumber dana jika diperlukan.',
    gambar: 'Unggah foto atau PDF terkait. Format: JPG/PNG/PDF. Maks 10MB.',
    aktif: 'Tandai aktif jika fasilitas masih digunakan/berlaku.'
  }

  const toggleTip = (key) => setOpenTip(prev => (prev === key ? null : key))

  const [imagePreview, setImagePreview] = useState(null)
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const CURRENT_YEAR = new Date().getFullYear()
  const MIN_YEAR = 1950
  const yearOptions = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => String(CURRENT_YEAR - i))
  
  const isEmpty = (val) => val === undefined || val === null || val === ''
  const isRequiredEmpty = (key) => {
    switch (key) {
      case 'tahunPembuatan':
      case 'jenisKonstruksi':
      case 'pelabuhan':
      case 'sumberDana':
        return isEmpty(formData[key])
      case 'bebanGandar':
      case 'panjang':
      case 'lebar':
        return isEmpty(formData[key]) && formData[key] !== 0
      default:
        return false
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '-'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileError('')
      setFileInfo('')
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFormData(prev => ({ ...prev, gambar: null }))
        setImagePreview(null)
        setFileError('Tipe file tidak didukung. Gunakan jpg, jpeg, png, atau pdf.')
        return
      }

      if (file.type === 'application/pdf') {
        if (file.size > MAX_FILE_SIZE) {
          setFormData(prev => ({ ...prev, gambar: null }))
          setImagePreview(null)
          setFileError('Ukuran file terlalu besar. Maksimal 10MB.')
          setFileInfo('')
          return
        }
        setFormData(prev => ({ ...prev, gambar: file }))
        setImagePreview(null)
        setFileInfo(`Berhasil diunggah: PDF (${formatFileSize(file.size)})`)
        return
      }

      // Kompresi gambar ringan tanpa menurunkan kualitas secara signifikan
      setIsCompressing(true)
      compressImageFile(file).then((compressed) => {
        const finalFile = compressed || file
        if (finalFile.size > MAX_FILE_SIZE) {
          setFormData(prev => ({ ...prev, gambar: null }))
          setImagePreview(null)
          setFileError('Ukuran file terlalu besar. Maksimal 10MB.')
          setFileInfo('')
          return
        }
        setFormData(prev => ({ ...prev, gambar: finalFile }))
        const url = URL.createObjectURL(finalFile)
        setImagePreview(url)
        const compressedNote = compressed && finalFile.size < file.size ? ' • terkompresi' : ''
        const typeLabel = finalFile.type === 'image/png' ? 'PNG' : 'JPEG'
        setFileInfo(`Berhasil diunggah: ${typeLabel} (${formatFileSize(finalFile.size)})${compressedNote}`)
      }).catch(() => {
        // Jika kompresi gagal, gunakan file asli jika memenuhi batas
        if (file.size > MAX_FILE_SIZE) {
          setFormData(prev => ({ ...prev, gambar: null }))
          setImagePreview(null)
          setFileError('Ukuran file terlalu besar. Maksimal 10MB.')
          setFileInfo('')
        } else {
          setFormData(prev => ({ ...prev, gambar: file }))
          const url = URL.createObjectURL(file)
          setImagePreview(url)
          const typeLabel = file.type === 'image/png' ? 'PNG' : 'JPEG'
          setFileInfo(`Berhasil diunggah: ${typeLabel} (${formatFileSize(file.size)})`)
        }
      }).finally(() => setIsCompressing(false))
    }
  }

  // Lightbox helpers
  const openLightbox = (src) => {
    setLightboxSrc(src)
    setLightboxOpen(true)
    setLbZoom(1)
    setLbOffset({ x: 0, y: 0 })
    setLbDragging(false)
  }

  const closeLightbox = () => { setLightboxOpen(false) }

  const lbOnWheel = (e) => {
    e.preventDefault()
    const step = e.deltaY > 0 ? -0.15 : 0.15
    setLbZoom(prev => Math.min(3, Math.max(0.5, prev + step)))
  }

  const lbOnMouseDown = (e) => {
    e.preventDefault()
    setLbDragging(true)
    setLbDragStart({ x: e.clientX - lbOffset.x, y: e.clientY - lbOffset.y })
  }

  const lbOnMouseMove = (e) => {
    if (!lbDragging) return
    setLbOffset({ x: e.clientX - lbDragStart.x, y: e.clientY - lbDragStart.y })
  }

  const lbOnMouseUp = () => { setLbDragging(false) }
  const lbOnMouseLeave = () => { setLbDragging(false) }
  const lbZoomIn = () => setLbZoom(prev => Math.min(3, prev + 0.2))
  const lbZoomOut = () => setLbZoom(prev => Math.max(0.5, prev - 0.2))
  const lbReset = () => { setLbZoom(1); setLbOffset({ x: 0, y: 0 }) }

  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
          const maxDim = 1600
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          const quality = outputType === 'image/jpeg' ? 0.9 : undefined
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: outputType })
              resolve(compressedFile)
            } else {
              resolve(null)
            }
            URL.revokeObjectURL(url)
          }, outputType, quality)
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve(null)
        }
        img.src = url
      } catch (err) {
        reject(err)
      }
    })
  }

  const formatThousands = (value) => {
    const digits = String(value).replace(/\D/g, '')
    if (!digits) return ''
    return new Intl.NumberFormat('id-ID').format(parseInt(digits, 10))
  }

  const handleNilaiChange = (e) => {
    const raw = e.target.value
    const digits = raw.replace(/\D/g, '')
    const numeric = digits ? parseInt(digits, 10) : ''
    setFormData(prev => ({
      ...prev,
      nilai: numeric,
      nilaiDisplay: formatThousands(digits)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowPreview(true)
  }

  const handleOpenPreview = () => {
    const hasEmpty = ['tahunPembuatan','bebanGandar','jenisKonstruksi','pelabuhan','panjang','lebar','sumberDana'].some(isRequiredEmpty)
    if (hasEmpty) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 600)
      setTimeout(() => setShowPreview(true), 300)
    } else {
      setShowPreview(true)
    }
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  const submitData = async () => {
    // TODO: Integrasi API submit data di sini
    console.log('Konfirmasi Simpan Data:', formData)
    setShowPreview(false)
  }

  const handleReset = () => {
    setFormData({
      tahunPembuatan: '',
      keteranganRehab: '',
      bebanGandar: '',
      jenisKonstruksi: '',
      pelabuhan: '',
      panjang: '',
      rencanaPengembanganPanjang: '',
      lebar: '',
      rencanaPengembanganLebar: '',
      keteranganKonstruksi: '',
      sumberDana: '',
      nilai: '',
      nilaiDisplay: '',
      keteranganSumberDana: '',
      gambar: null,
      aktif: true
    })
    setImagePreview(null)
    setFileError('')
    setFileInfo('')
  }

  return (
    <div className="section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Fasilitas Pokok - Jalan</h2>
          <p className="section-desc">Form untuk mengelola data fasilitas pokok jalan</p>
        </div>
        <div style={{ minWidth: '250px' }}>
          <div className={`form-group ${isRequiredEmpty('pelabuhan') ? 'error' : ''} ${isRequiredEmpty('pelabuhan') && doShake ? 'shake' : ''}`} style={{ position: 'relative', margin: 0 }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label" style={{ fontSize: '14px', marginBottom: '6px' }}>Pelabuhan <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.pelabuhan}
                onMouseEnter={() => setOpenTip('pelabuhan')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'pelabuhan' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.pelabuhan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select
              name="pelabuhan"
              value={formData.pelabuhan}
              onChange={handleInputChange}
              className="form-select"
              required
              style={{ fontSize: '14px' }}
            >
              <option value="">Pilih Pelabuhan</option>
              <option value="PPS Nizam Zachman Jakarta">PPS Nizam Zachman Jakarta</option>
              <option value="PPS Kendari">PPS Kendari</option>
              <option value="PPN Pekalongan">PPN Pekalongan</option>
              <option value="PPN Kejawanan Cirebon">PPN Kejawanan Cirebon</option>
              <option value="PPP Pondokdadap Malang">PPP Pondokdadap Malang</option>
              <option value="PPP Brondong Lamongan">PPP Brondong Lamongan</option>
            </select>
          </div>
        </div>
      </div>
      {formData.pelabuhan && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Pelabuhan Terpilih:</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{formData.pelabuhan}</div>
        </div>
      )}
      
      <form className="fasilitas-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className={`form-group ${isRequiredEmpty('tahunPembuatan') ? 'error' : ''} ${isRequiredEmpty('tahunPembuatan') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Tahun Pembuatan <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.tahunPembuatan}
                onMouseEnter={() => setOpenTip('tahunPembuatan')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'tahunPembuatan' && (
              <div
                role="dialog"
                aria-label="Informasi pengisian"
                style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}
              >
                <div style={{ fontSize: 12 }}>{TIPS.tahunPembuatan}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select
              name="tahunPembuatan"
              value={formData.tahunPembuatan}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Pilih Tahun</option>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {isRequiredEmpty('tahunPembuatan') && null}
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
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
            <input
              type="text"
              name="keteranganRehab"
              value={formData.keteranganRehab}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: Perbaikan permukaan aspal"
            />
          </div>

          <div className={`form-group ${isRequiredEmpty('bebanGandar') ? 'error' : ''} ${isRequiredEmpty('bebanGandar') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Beban Gandar <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.bebanGandar}
                onMouseEnter={() => setOpenTip('bebanGandar')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'bebanGandar' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.bebanGandar}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              type="number"
              name="bebanGandar"
              value={formData.bebanGandar}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 8"
              step="0.01"
              min="0"
              required
            />
            {isRequiredEmpty('bebanGandar') && null}
          </div>

          <div className={`form-group ${isRequiredEmpty('jenisKonstruksi') ? 'error' : ''} ${isRequiredEmpty('jenisKonstruksi') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Jenis Konstruksi <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.jenisKonstruksi}
                onMouseEnter={() => setOpenTip('jenisKonstruksi')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'jenisKonstruksi' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.jenisKonstruksi}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <select
              name="jenisKonstruksi"
              value={formData.jenisKonstruksi}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Pilih Jenis Konstruksi</option>
              <option value="Aspal">Aspal</option>
              <option value="Beton">Beton</option>
              <option value="Paving Block">Paving Block</option>
              <option value="Tanah">Tanah</option>
              <option value="Kerikil">Kerikil</option>
            </select>
            {isRequiredEmpty('jenisKonstruksi') && null}
          </div>



          <div className={`form-group ${isRequiredEmpty('panjang') ? 'error' : ''} ${isRequiredEmpty('panjang') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Panjang (m) <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.panjang}
                onMouseEnter={() => setOpenTip('panjang')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'panjang' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.panjang}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              type="number"
              name="panjang"
              value={formData.panjang}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 500"
              step="0.01"
              min="0"
              required
            />
            {isRequiredEmpty('panjang') && null}
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Panjang
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.rencanaPengembanganPanjang}
                onMouseEnter={() => setOpenTip('rencanaPengembanganPanjang')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'rencanaPengembanganPanjang' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.rencanaPengembanganPanjang}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              type="number"
              name="rencanaPengembanganPanjang"
              value={formData.rencanaPengembanganPanjang}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 200"
              step="0.01"
              min="0"
            />
          </div>

          <div className={`form-group ${isRequiredEmpty('lebar') ? 'error' : ''} ${isRequiredEmpty('lebar') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Lebar (m) <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.lebar}
                onMouseEnter={() => setOpenTip('lebar')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'lebar' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.lebar}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              type="number"
              name="lebar"
              value={formData.lebar}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 8"
              step="0.01"
              min="0"
              required
            />
            {isRequiredEmpty('lebar') && null}
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Rencana Pengembangan Lebar (m)
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.rencanaPengembanganLebar}
                onMouseEnter={() => setOpenTip('rencanaPengembanganLebar')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'rencanaPengembanganLebar' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.rencanaPengembanganLebar}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              type="number"
              name="rencanaPengembanganLebar"
              value={formData.rencanaPengembanganLebar}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: 2"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
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
            <select
              name="keteranganKonstruksi"
              value={formData.keteranganKonstruksi}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Pilih Keterangan Konstruksi</option>
              <option value="kondisi baik belum berfungsi">kondisi baik belum berfungsi</option>
              <option value="Kondisi Rusak">Kondisi Rusak</option>
              <option value="Sudah berfungsi dalam keadaan baik">Sudah berfungsi dalam keadaan baik</option>
              <option value="Sudah berfungsi dalam keadaan rusak">Sudah berfungsi dalam keadaan rusak</option>
              <option value="tahap pembangunan">tahap pembangunan</option>
              <option value="Tidak ada">Tidak ada</option>
            </select>
          </div>

          <div className={`form-group ${isRequiredEmpty('sumberDana') ? 'error' : ''} ${isRequiredEmpty('sumberDana') && doShake ? 'shake' : ''}`} style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Sumber Dana <span className="required-mark">*</span>
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.sumberDana}
                onMouseEnter={() => setOpenTip('sumberDana')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'sumberDana' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.sumberDana}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              type="text"
              name="sumberDana"
              value={formData.sumberDana}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: APBN, APBD, Hibah"
              required
            />
            {isRequiredEmpty('sumberDana') && null}
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Nilai
              <span
                className="tooltip-trigger"
                role="button"
                aria-label={TIPS.nilai}
                onMouseEnter={() => setOpenTip('nilai')}
                style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}
              >?</span>
            </label>
            {openTip === 'nilai' && (
              <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 260, zIndex: 20 }}>
                <div style={{ fontSize: 12 }}>{TIPS.nilai}</div>
                <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <div className="input-affix">
              <span className="affix-prefix">Rp</span>
              <input
                type="text"
                name="nilai"
                value={formData.nilaiDisplay || ''}
                onChange={handleNilaiChange}
                className="form-input currency-input"
                placeholder="Contoh: 150.000.000"
              />
            </div>
          </div>

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
            <input
              type="text"
              name="keteranganSumberDana"
              value={formData.keteranganSumberDana}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Contoh: Tahap II, dana matching dari KKP"
            />
          </div>

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
            <input
              type="file"
              name="gambar"
              onChange={handleImageChange}
              className="form-input file-input"
              accept="image/*,application/pdf"
            />
            {isCompressing && (
              <div className="inline-progress"><span className="spinner"></span>Mengompres gambar…</div>
            )}
            {fileError && (
              <div className="field-hint">{fileError}</div>
            )}
            {!fileError && fileInfo && (
              <div className="field-info">{fileInfo}</div>
            )}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="preview-overlay-btn"
                  aria-label="Pratinjau gambar"
                  onClick={() => openLightbox(imagePreview)}
                >Preview</button>
              </div>
            )}
          </div>

          <div className="form-group" style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
            <label className="form-label">Aktif <span className="required-mark">*</span>
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
                <input
                  type="checkbox"
                  name="aktif"
                  checked={formData.aktif}
                  onChange={handleInputChange}
                />
                <span className="slider"></span>
              </label>
              <span className="switch-label">
                {formData.aktif ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleOpenPreview} className="btn btn-primary">
            Simpan Data
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset Form
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Preview Hasil Input</h3>
              <div style={{ marginTop: 6, fontSize: 14, color: '#64748b' }}>
                <strong>Pelabuhan:</strong> <span>{formData.pelabuhan || '-'}</span>
              </div>
            </div>
            <div className="modal-body">
              {/* Hitung apakah ada field wajib kosong */}
              {(() => {
                return null
              })()}
              <div className="preview-grid">
                <div className={isRequiredEmpty('tahunPembuatan') ? 'preview-item error' : 'preview-item'}>
                  <strong>Tahun Pembuatan:</strong> <span>{formData.tahunPembuatan || '-'}</span>
                  {isRequiredEmpty('tahunPembuatan') && null}
                </div>
                <div className={isRequiredEmpty('pelabuhan') ? 'preview-item error' : 'preview-item'}>
                  <strong>Pelabuhan:</strong> <span>{formData.pelabuhan || '-'}</span>
                  {isRequiredEmpty('pelabuhan') && null}
                </div>
                <div className="preview-item"><strong>Keterangan Rehab:</strong> <span>{formData.keteranganRehab || '-'}</span></div>
                <div className={isRequiredEmpty('bebanGandar') ? 'preview-item error' : 'preview-item'}>
                  <strong>Beban Gandar:</strong> <span>{formData.bebanGandar || '-'}</span>
                  {isRequiredEmpty('bebanGandar') && null}
                </div>
                <div className={isRequiredEmpty('jenisKonstruksi') ? 'preview-item error' : 'preview-item'}>
                  <strong>Jenis Konstruksi:</strong> <span>{formData.jenisKonstruksi || '-'}</span>
                  {isRequiredEmpty('jenisKonstruksi') && null}
                </div>
                <div className={isRequiredEmpty('panjang') ? 'preview-item error' : 'preview-item'}>
                  <strong>Panjang (m):</strong> <span>{formData.panjang || '-'}</span>
                  {isRequiredEmpty('panjang') && null}
                </div>
                <div className="preview-item"><strong>Rencana Pengembangan Panjang:</strong> <span>{formData.rencanaPengembanganPanjang || '-'}</span></div>
                <div className={isRequiredEmpty('lebar') ? 'preview-item error' : 'preview-item'}>
                  <strong>Lebar:</strong> <span>{formData.lebar || '-'}</span>
                  {isRequiredEmpty('lebar') && null}
                </div>
                <div className="preview-item"><strong>Rencana Pengembangan Lebar (m):</strong> <span>{formData.rencanaPengembanganLebar || '-'}</span></div>
                <div className="preview-item"><strong>Keterangan Konstruksi:</strong> <span>{formData.keteranganKonstruksi || '-'}</span></div>
                <div className={isRequiredEmpty('sumberDana') ? 'preview-item error' : 'preview-item'}>
                  <strong>Sumber Dana:</strong> <span>{formData.sumberDana || '-'}</span>
                  {isRequiredEmpty('sumberDana') && null}
                </div>
                <div className="preview-item"><strong>Nilai:</strong> <span>{formData.nilaiDisplay ? `Rp ${formData.nilaiDisplay}` : '-'}</span></div>
                <div className="preview-item"><strong>Keterangan Sumber Dana:</strong> <span>{formData.keteranganSumberDana || '-'}</span></div>
                <div className="preview-item"><strong>Aktif:</strong> <span>{formData.aktif ? 'Aktif' : 'Tidak Aktif'}</span></div>
                {imagePreview ? (
                  <div className="preview-item preview-image">
                    <strong>Gambar:</strong>
                    <div className="image-preview" style={{ marginTop: 8 }}>
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="preview-overlay-btn"
                        aria-label="Pratinjau gambar"
                        onClick={() => openLightbox(imagePreview)}
                      >Preview</button>
                    </div>
                  </div>
                ) : (
                  formData.gambar && (
                    <div className="preview-item preview-image">
                      <strong>Gambar:</strong>
                      <span>{formData.gambar.name} • {formatFileSize(formData.gambar.size)}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="modal-actions">
              {/** Disable simpan jika masih ada field wajib kosong */}
              <button
                className="btn btn-primary"
                onClick={() => setConfirmOpen(true)}
                disabled={['tahunPembuatan','bebanGandar','jenisKonstruksi','pelabuhan','panjang','lebar','sumberDana'].some(isRequiredEmpty)}
              >Simpan</button>
              {['tahunPembuatan','bebanGandar','jenisKonstruksi','pelabuhan','panjang','lebar','sumberDana'].some(isRequiredEmpty) && (
                <span className="save-hint">Lengkapi field wajib untuk menyimpan</span>
              )}
              <button className="btn btn-secondary" onClick={handleClosePreview}>Edit Kembali</button>
            </div>
          </div>
        </div>
      )}
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
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', padding: '10px 12px' }}>
            <button
              onClick={lbZoomOut}
              aria-label="Zoom out"
              style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 4, padding: '6px 10px', fontSize: 14, cursor: 'pointer'
              }}
            >−</button>
            <button
              onClick={lbReset}
              aria-label="Reset zoom"
              style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 4, padding: '6px 10px', fontSize: 14, cursor: 'pointer'
              }}
            >⤿</button>
            <button
              onClick={lbZoomIn}
              aria-label="Zoom in"
              style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 4, padding: '6px 10px', fontSize: 14, cursor: 'pointer'
              }}
            >+</button>
            <button
              onClick={closeLightbox}
              aria-label="Tutup"
              style={{
                marginLeft: 8,
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 4, padding: '6px 10px', fontSize: 14, cursor: 'pointer'
              }}
            >✕</button>
          </div>
          <div
            onWheel={lbOnWheel}
            onMouseDown={lbOnMouseDown}
            onMouseMove={lbOnMouseMove}
            onMouseUp={lbOnMouseUp}
            onMouseLeave={lbOnMouseLeave}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: lbDragging ? 'grabbing' : 'grab' }}
          >
            {lightboxSrc && (
              <img
                src={lightboxSrc}
                alt="Pratinjau besar"
                style={{
                  maxWidth: '85vw', maxHeight: '80vh', userSelect: 'none',
                  transform: `translate(${lbOffset.x}px, ${lbOffset.y}px) scale(${lbZoom})`,
                  transition: 'transform 50ms ease-out'
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FasilitasPokokJalan