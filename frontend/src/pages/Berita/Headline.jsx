import React, { useEffect, useMemo, useRef, useState } from 'react'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import '../../styles/fasilitas-form.css'
import SmartSelect from '../../components/SmartSelect'
import { PELABUHAN_OPTIONS, TIPE_BERITA_OPTIONS } from '../../utils/formStandards'
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/24/solid'

const LS_KEY = 'pipp_headlines_v1'

function readHeadlines() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch { return [] }
}

function writeHeadlines(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list || [])) } catch {}
}

export default function BeritaHeadline() {
  const [filter, setFilter] = useState({ pelabuhan: '', from: '', to: '', keyword: '' })
  const [headlines, setHeadlines] = useState(() => readHeadlines())
  const [addOpen, setAddOpen] = useState(false)
  const dragIndex = useRef(null)

  const allNews = useMemo(() => {
    const demo = [
      { id: 'N001', judul: 'kegiatan nelayan di pelabuhan nusantara', kategori: 'Informasi', tanggal: '2025-10-21', pelabuhan: 'Pelabuhan Nusantara', thumbnail: '', isHeadline: true },
      { id: 'N002', judul: 'pengumuman perbaikan dermaga selama sepekan', kategori: 'Pengumuman', tanggal: '2025-10-18', pelabuhan: 'Pelabuhan Samudera', thumbnail: '', isHeadline: false },
      { id: 'N003', judul: 'event lomba masak ikan nasional', kategori: 'Event', tanggal: '2025-10-10', pelabuhan: 'Pelabuhan Nusantara', thumbnail: '', isHeadline: false },
      { id: 'N004', judul: 'hasil tangkapan meningkat di kuartal empat', kategori: 'Informasi', tanggal: '2025-09-30', pelabuhan: 'Pelabuhan Bahari', thumbnail: '', isHeadline: true },
      { id: 'N005', judul: 'workshop kebersihan kapal dan peralatan', kategori: 'Edukasi', tanggal: '2025-10-01', pelabuhan: 'Pelabuhan Bahari', thumbnail: '', isHeadline: false },
    ]
    const initial = readHeadlines()
    if (!initial.length) {
      const seed = demo.filter(d => d.isHeadline).map((d, idx) => ({ ...d, order: idx + 1 }))
      writeHeadlines(seed)
      return demo
    }
    return demo
  }, [])

  useEffect(() => { writeHeadlines(headlines) }, [headlines])

  const filteredHeadlines = useMemo(() => {
    const byFilters = headlines.filter((h) => {
      if (filter.pelabuhan && h.pelabuhan !== filter.pelabuhan) return false
      if (filter.from && h.tanggal < filter.from) return false
      if (filter.to && h.tanggal > filter.to) return false
      if (filter.keyword && !h.judul.toLowerCase().includes(filter.keyword.toLowerCase())) return false
      return true
    })
    return byFilters.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [headlines, filter])

  // Pagination sederhana untuk daftar headline
  const [currentPage, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filteredHeadlines.length / pageSize))
  const paginatedHeadlines = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredHeadlines.slice(start, start + pageSize)
  }, [filteredHeadlines, currentPage])

  const onChangeFilter = (e) => {
    const { name, value } = e.target
    setFilter((f) => ({ ...f, [name]: value }))
  }

  const onChangePelabuhan = (e) => setFilter((f) => ({ ...f, pelabuhan: e.target.value }))

  const removeHeadline = (id) => {
    setHeadlines((list) => {
      const next = list.filter((h) => h.id !== id)
      return next.map((h, idx) => ({ ...h, order: idx + 1 }))
    })
  }

  const moveUp = (idx) => {
    setHeadlines((list) => {
      if (idx <= 0) return list
      const next = [...list]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next.map((h, i) => ({ ...h, order: i + 1 }))
    })
  }

  const moveDown = (idx) => {
    setHeadlines((list) => {
      if (idx >= list.length - 1) return list
      const next = [...list]
      ;[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]
      return next.map((h, i) => ({ ...h, order: i + 1 }))
    })
  }

  const onDragStart = (idx) => { dragIndex.current = idx }
  const onDragOver = (e) => { e.preventDefault() }
  const onDrop = (idx) => {
    const from = dragIndex.current
    if (from == null || from === idx) return
    setHeadlines((list) => {
      const next = [...list]
      const [moved] = next.splice(from, 1)
      next.splice(idx, 0, moved)
      return next.map((h, i) => ({ ...h, order: i + 1 }))
    })
    dragIndex.current = null
  }

  const addFromList = (items) => {
    setHeadlines((list) => {
      const existingIds = new Set(list.map((h) => h.id))
      const additions = items.filter((it) => !existingIds.has(it.id)).map((it) => ({ ...it, isHeadline: true }))
      const merged = [...list, ...additions]
      return merged
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((h, i) => ({ ...h, order: i + 1 }))
    })
  }

  const [selectableNewsKeyword, setSelectableNewsKeyword] = useState('')
  const selectableNews = useMemo(() => {
    const notHeadline = allNews.filter((n) => !headlines.some((h) => h.id === n.id))
    const kw = selectableNewsKeyword.trim().toLowerCase()
    return kw ? notHeadline.filter((n) => n.judul.toLowerCase().includes(kw)) : notHeadline
  }, [allNews, headlines, selectableNewsKeyword])

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h3 className="section-subtitle">Daftar Headline PIPP</h3>
      <p className="section-desc">Kelola berita yang ditandai sebagai Headline di halaman depan.</p>

      <div className="fasilitas-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Filter Pelabuhan</label>
            <SmartSelect
              name="pelabuhan"
              value={filter.pelabuhan}
              onChange={onChangePelabuhan}
              category="pelabuhan"
              baseOptions={PELABUHAN_OPTIONS}
              placeholder="Pilih pelabuhan..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Filter Tanggal</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="date" name="from" value={filter.from} onChange={onChangeFilter} className="form-input" />
              <input type="date" name="to" value={filter.to} onChange={onChangeFilter} className="form-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Keyword</label>
            <input type="text" name="keyword" value={filter.keyword} onChange={onChangeFilter} className="form-input" placeholder="Cari judul..." />
          </div>
        </div>

        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn btn-primary" onClick={() => setAddOpen(true)}>Tambah dari Daftar Berita</button>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Total: {filteredHeadlines.length} headline</span>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: 16 }}>
        <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 160px 160px 240px', gap: 8, padding: '8px 12px', background: '#f3f4f6', fontWeight: 600 }}>
          <div>No</div>
          <div>Judul</div>
          <div>Kategori</div>
          <div>Tanggal</div>
          <div>Aksi</div>
        </div>
        <div className="table-body">
          {paginatedHeadlines.map((h, idx) => (
            <div
              key={h.id}
              className="table-row"
              style={{ display: 'grid', gridTemplateColumns: '60px 1fr 160px 160px 240px', gap: 8, padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(idx)}
            >
              <div>{(currentPage - 1) * pageSize + idx + 1}</div>
              <div style={{ textTransform: 'capitalize' }}>{h.judul}</div>
              <div>{h.kategori}</div>
              <div>{h.tanggal}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-secondary" type="button" onClick={() => moveUp(idx)} aria-label="Naik" title="Naik" style={{ padding: 6 }}>
                  <ChevronUpIcon style={{ width: 16, height: 16 }} />
                </button>
                <button className="btn btn-sm btn-secondary" type="button" onClick={() => moveDown(idx)} aria-label="Turun" title="Turun" style={{ padding: 6 }}>
                  <ChevronDownIcon style={{ width: 16, height: 16 }} />
                </button>
                <button className="btn btn-sm btn-danger" type="button" onClick={() => removeHeadline(h.id)} aria-label="Hapus dari Headline" title="Hapus dari Headline" style={{ padding: 6 }}>
                  <TrashIcon style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          ))}
          {!filteredHeadlines.length && (
            <div style={{ padding: 12, color: '#6b7280' }}>Tidak ada headline dengan filter saat ini.</div>
          )}
        </div>
      </div>

      {/* Pagination (sederhana) */}
      <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 12 }}>
        <button className="btn" type="button" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span style={{ margin: '0 8px' }}>Hal {currentPage} / {totalPages}</span>
        <button className="btn" type="button" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>

      <div className="section-card" style={{ marginTop: 20 }}>
        <h4 className="section-subtitle">Mini Preview Headline (Homepage)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {filteredHeadlines.slice(0, 4).map((h) => (
            <div key={h.id} className="preview-card" style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#f9fafb', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                Thumbnail
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 4, textTransform: 'capitalize' }}>{h.judul}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{h.kategori} • {h.tanggal}</div>
              </div>
            </div>
          ))}
          {!filteredHeadlines.length && (
            <div style={{ padding: 12, color: '#6b7280' }}>Belum ada headline untuk preview.</div>
          )}
        </div>
      </div>

      {addOpen && (
        <AddFromListModal
          onClose={() => setAddOpen(false)}
          items={selectableNews}
          onAdd={(selected) => { addFromList(selected); setAddOpen(false) }}
          keyword={selectableNewsKeyword}
          setKeyword={setSelectableNewsKeyword}
        />
      )}
    </div>
  )
}

function AddFromListModal({ onClose, items, onAdd, keyword, setKeyword }) {
  const [selected, setSelected] = useState({})
  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }))
  const selectedItems = items.filter((it) => selected[it.id])

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Tambah dari Daftar Berita</h3>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Cari Keyword</label>
            <input type="text" className="form-input" placeholder="Cari judul berita..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
          <div style={{ maxHeight: '50vh', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
            {items.map((it) => (
              <label key={it.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 160px 160px', gap: 8, padding: '8px 12px', borderBottom: '1px solid #f3f4f6' }}>
                <input type="checkbox" checked={!!selected[it.id]} onChange={() => toggle(it.id)} />
                <div style={{ textTransform: 'capitalize' }}>{it.judul}</div>
                <div>{it.kategori}</div>
                <div>{it.tanggal}</div>
              </label>
            ))}
            {!items.length && (<div style={{ padding: 12, color: '#6b7280' }}>Tidak ada berita tersedia untuk ditambahkan.</div>)}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => onAdd(selectedItems)} disabled={!selectedItems.length}>Tambahkan</button>
        </div>
      </div>
    </div>
  )
}