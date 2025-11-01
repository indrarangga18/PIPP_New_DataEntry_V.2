import React, { useState } from 'react'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import SmartSelect from '../../components/SmartSelect'
import RichTextEditor from '../../components/RichTextEditor'
import { URL_WEBSITE_OPTIONS } from '../../utils/formStandards'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

export default function WebsiteSejarahPelabuhan() {
  const [form, setForm] = useState({
    judul: '',
    deskripsiHtml: '',
    tags: [],
    url: '',
  })
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const val = (tagInput || '').trim()
    if (!val) return
    setForm(prev => ({ ...prev, tags: Array.from(new Set([...(prev.tags || []), val])) }))
    setTagInput('')
  }

  const removeTag = (t) => {
    setForm(prev => ({ ...prev, tags: (prev.tags || []).filter(x => x !== t) }))
  }

  const onSave = (e) => {
    e.preventDefault()
    if (!form.judul || !form.deskripsiHtml || !form.url) {
      alert('Lengkapi Judul, Deskripsi, dan URL sebelum menyimpan.')
      return
    }
    const cleanHtml = sanitizeHtml(form.deskripsiHtml)
    // Placeholder: Integrasi API jika diperlukan
    console.log('Simpan Sejarah Pelabuhan', { ...form, deskripsiHtml: cleanHtml })
    alert('Data Sejarah Pelabuhan disimpan (simulasi).')
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">Sejarah Pelabuhan</h2>
      <p className="section-desc">Isi detail sejarah pelabuhan: judul, deskripsi, tags, dan URL.</p>

      <form className="fasilitas-form" onSubmit={onSave}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Judul <span className="required-mark">*</span></label>
            <input className="form-input" placeholder="Judul konten" value={form.judul} onChange={(e) => setForm(prev => ({ ...prev, judul: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="form-label">URL <span className="required-mark">*</span></label>
            <SmartSelect
              name="url"
              value={form.url}
              onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
              category="urlWebsite"
              baseOptions={URL_WEBSITE_OPTIONS}
              placeholder="Pilih URL tujuan"
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Deskripsi <span className="required-mark">*</span></label>
            <RichTextEditor
              value={form.deskripsiHtml}
              onChange={(html) => setForm(prev => ({ ...prev, deskripsiHtml: html }))}
              placeholder="Tulis deskripsi..."
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {(form.tags || []).map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eef2ff', border: '1px solid #c7d2fe', color: '#1e3a8a', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                  {t}
                  <button type="button" className="btn" onClick={() => removeTag(t)} style={{ background: 'transparent', color: '#1e3a8a', padding: 0 }}>✕</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="Ketik tag lalu Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }} />
              <button type="button" className="btn" onClick={addTag}>Tambah</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="submit" className="btn btn-primary">Simpan</button>
        </div>
      </form>
    </div>
  )
}