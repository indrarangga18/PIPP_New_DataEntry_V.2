import React, { useState, useRef } from 'react'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import SmartSelect from '../../components/SmartSelect'
import { PELABUHAN_OPTIONS, URL_WEBSITE_OPTIONS } from '../../utils/formStandards'
import '../../styles/banner.css'

export default function WebsiteBanner() {
  const [newBanner, setNewBanner] = useState({
    pelabuhan: '',
    url: '',
    linkText: '',
    file: null,
    preview: ''
  })
  const [banners, setBanners] = useState([])
  const [showInfo, setShowInfo] = useState(true)
  const [dragIndex, setDragIndex] = useState(null)
  const fileInputRef = useRef(null)

  const onDropZoneClick = () => fileInputRef.current?.click()
  const onFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setNewBanner(prev => ({ ...prev, file: f, preview: url }))
  }
  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setNewBanner(prev => ({ ...prev, file: f, preview: url }))
  }
  const onDragOver = (e) => e.preventDefault()

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newBanner.file || !newBanner.pelabuhan || !newBanner.url || !newBanner.linkText) {
      alert('Lengkapi gambar, pelabuhan, URL, dan Link Text sebelum menyimpan.')
      return
    }
    const item = {
      id: Date.now(),
      pelabuhan: newBanner.pelabuhan,
      url: newBanner.url,
      linkText: newBanner.linkText,
      preview: newBanner.preview
    }
    setBanners(prev => [item, ...prev])
    setNewBanner({ pelabuhan: '', url: '', linkText: '', file: null, preview: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const startDrag = (index) => setDragIndex(index)
  const enterDrag = (index) => {
    if (dragIndex === null || dragIndex === index) return
    setBanners(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      setDragIndex(index)
      return next
    })
  }
  const endDrag = () => setDragIndex(null)

  const handleDelete = (id) => setBanners(prev => prev.filter(b => b.id !== id))
  const handleSaveOrder = () => {
    // Placeholder: integrate API to persist order
    alert('Urutan banner disimpan (simulasi).')
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <div className="banner-page">
        {/* Left: Tambah Web Banner */}
        <div className="banner-left">
          <div className="panel-header">
            <span>Tambah Web Banner</span>
            <button className="collapse-btn" aria-label="Collapse">▾</button>
          </div>

          <div className="dropzone" onClick={onDropZoneClick} onDrop={onDrop} onDragOver={onDragOver} role="button" aria-label="Click or Drag to Upload Image">
            {newBanner.preview ? (
              <img src={newBanner.preview} alt="Preview" className="preview-img" />
            ) : (
              <span className="dz-text">Click or Drag to Upload Image</span>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
          </div>

          <div className="form-field">
            <label>Pelabuhan :</label>
            <SmartSelect
              name="pelabuhan"
              value={newBanner.pelabuhan}
              onChange={(name, value) => setNewBanner(prev => ({ ...prev, pelabuhan: value }))}
              category="pelabuhan"
              baseOptions={PELABUHAN_OPTIONS}
              placeholder="PP. Ie Meulee"
            />
          </div>

          <div className="form-field">
            <label>URL :</label>
            <SmartSelect
              name="url"
              value={newBanner.url}
              onChange={(e) => setNewBanner(prev => ({ ...prev, url: e.target.value }))}
              category="urlWebsite"
              baseOptions={URL_WEBSITE_OPTIONS}
              placeholder="https://"
            />
          </div>

          <div className="form-field">
            <label>Link Text :</label>
            <input
              type="text"
              placeholder="Nama Profile Pelabuhan"
              value={newBanner.linkText}
              onChange={(e) => setNewBanner(prev => ({ ...prev, linkText: e.target.value }))}
              className="text-input"
            />
          </div>

          <button className="primary-btn" onClick={handleAdd}>Simpan</button>
        </div>

        {/* Right: Web Banner List & Sort */}
        <div className="banner-right">
          <div className="panel-header">
            <span>Web Banner</span>
            <button className="secondary-btn" onClick={handleSaveOrder}>Save</button>
          </div>

          {showInfo && (
            <div className="info-box">
              <span>Urutkan dengan melakukan drag & drop, kemudian klik tombol <b>save</b></span>
              <button className="close-info" aria-label="Tutup" onClick={() => setShowInfo(false)}>✕</button>
            </div>
          )}

          <div className="list-area">
            {banners.length === 0 ? (
              <div className="empty-box" />
            ) : (
              <ul className="banner-list">
                {banners.map((b, idx) => (
                  <li
                    key={b.id}
                    className="banner-item"
                    draggable
                    onDragStart={() => startDrag(idx)}
                    onDragEnter={() => enterDrag(idx)}
                    onDragEnd={endDrag}
                  >
                    <img src={b.preview} alt={b.linkText} className="item-thumb" />
                    <div className="item-meta">
                      <div className="item-title">{b.linkText}</div>
                      <div className="item-sub">{b.pelabuhan} • <a href={b.url} target="_blank" rel="noreferrer">{b.url}</a></div>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(b.id)} aria-label="Hapus">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}