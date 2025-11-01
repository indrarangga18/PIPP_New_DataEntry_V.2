import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AutoBreadcrumb from '../../components/AutoBreadcrumb'
import { PencilSquareIcon, TrashIcon, MegaphoneIcon } from '@heroicons/react/24/solid'

const seedDemoData = () => ([
  { id: 1, judul: 'pelabuhan nusantara terapkan protokol baru', tipeBerita: 'Umum', penulis: 'Admin', status: 'Published', tanggalPublish: '2024-08-12', keywords: ['pelabuhan','protokol'] },
  { id: 2, judul: 'hasil tangkapan meningkat di quarter ketiga', tipeBerita: 'Produksi', penulis: 'Redaksi', status: 'Published', tanggalPublish: '2024-09-05', keywords: ['produksi','tangkapan'] },
  { id: 3, judul: 'kegiatan bersih pantai bersama komunitas', tipeBerita: 'Kegiatan', penulis: 'Admin', status: 'Draft', tanggalPublish: '2024-10-01', keywords: ['kegiatan','pantai'] },
  { id: 4, judul: 'pemasaran ikan ekspor naik 12 persen', tipeBerita: 'Pemasaran', penulis: 'Redaksi', status: 'Published', tanggalPublish: '2024-07-21', keywords: ['pemasaran','ekspor'] },
  { id: 5, judul: 'perbaikan dermaga tahap kedua selesai', tipeBerita: 'Infrastruktur', penulis: 'Teknis', status: 'Published', tanggalPublish: '2024-06-30', keywords: ['dermaga','perbaikan'] },
  { id: 6, judul: 'pelatihan cpib bagi nelayan lokal', tipeBerita: 'Kegiatan', penulis: 'Admin', status: 'Draft', tanggalPublish: '2024-10-15', keywords: ['cpib','pelatihan'] },
  { id: 7, judul: 'logistik perbekalan kapal ditingkatkan', tipeBerita: 'Logistik', penulis: 'Redaksi', status: 'Published', tanggalPublish: '2024-05-18', keywords: ['logistik','perbekalan'] },
  { id: 8, judul: 'wisata bahari menarik minat pengunjung', tipeBerita: 'Kegiatan', penulis: 'Admin', status: 'Published', tanggalPublish: '2024-03-10', keywords: ['wisata','bahari'] },
  { id: 9, judul: 'program kebersihan kolam pelabuhan', tipeBerita: 'Lingkungan', penulis: 'Teknis', status: 'Published', tanggalPublish: '2024-02-25', keywords: ['kebersihan','kolam'] },
  { id: 10, judul: 'peningkatan layanan pasar ikan', tipeBerita: 'Pemasaran', penulis: 'Redaksi', status: 'Draft', tanggalPublish: '2024-11-01', keywords: ['pasar','layanan'] },
  { id: 11, judul: 'monitoring k5 berjalan efektif', tipeBerita: 'Keamanan', penulis: 'Admin', status: 'Published', tanggalPublish: '2024-01-12', keywords: ['monitoring','k5'] },
  { id: 12, judul: 'revitalisasi tempat pemasaran ikan', tipeBerita: 'Infrastruktur', penulis: 'Teknis', status: 'Published', tanggalPublish: '2024-04-08', keywords: ['revitalisasi','tempat pemasaran'] },
])

export default function BeritaDaftar() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [tipeBerita, setTipeBerita] = useState('')
  const [status, setStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Seed demo data into localStorage on first load
  useEffect(() => {
    const LS_KEY = 'beritaList'
    const existing = JSON.parse(localStorage.getItem(LS_KEY) || 'null')
    if (!Array.isArray(existing) || existing.length === 0) {
      localStorage.setItem(LS_KEY, JSON.stringify(seedDemoData()))
      setItems(seedDemoData())
    } else {
      setItems(existing)
    }
  }, [])

  // Helpers
  const tipeOptions = useMemo(() => {
    const set = new Set(items.map((x) => x.tipeBerita).filter(Boolean))
    return [''].concat(Array.from(set))
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((x) => {
      if (tipeBerita && x.tipeBerita !== tipeBerita) return false
      if (status && x.status !== status) return false
      if (fromDate && x.tanggalPublish < fromDate) return false
      if (toDate && x.tanggalPublish > toDate) return false
      if (searchTitle && !x.judul.toLowerCase().includes(searchTitle.toLowerCase())) return false
      return true
    })
  }, [items, tipeBerita, status, fromDate, toDate, searchTitle])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  const refreshFromStorage = () => {
    const LS_KEY = 'beritaList'
    const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    setItems(existing)
  }

  const handleDelete = (id) => {
    const LS_KEY = 'beritaList'
    const next = items.filter((x) => x.id !== id)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
    setItems(next)
  }

  const handleMakeHeadline = (item) => {
    const LS_KEY = 'headlineData'
    const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    const exists = existing.some((x) => x.id === item.id)
    const payload = { id: item.id, judul: item.judul, kategori: item.tipeBerita, tanggal: item.tanggalPublish, keywords: item.keywords || [] }
    const next = exists ? existing : existing.concat(payload)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
    alert('Berita dijadikan headline. Cek tab Headline untuk mengatur.')
  }

  const handleEdit = (id) => {
    navigate(`/berita/entry?edit=${id}`)
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h3 className="section-subtitle">Daftar Berita PIPP</h3>
      <p className="section-desc">Kelola berita, filter dan cari, serta atur headline.</p>

      {/* Toolbar */}
      <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Link className="btn btn-primary" to="/berita/entry">Tambah Berita</Link>
        <button className="btn" onClick={refreshFromStorage} type="button">Muat Ulang</button>
      </div>

      {/* Filter & Search */}
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="form-group">
          <label className="form-label">Tipe Berita</label>
          <select className="form-select" value={tipeBerita} onChange={(e) => { setTipeBerita(e.target.value); setPage(1) }}>
            {tipeOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt || 'Semua'}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
            <option value="">Semua</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tanggal Dari</label>
          <input type="date" className="form-input" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1) }} />
        </div>
        <div className="form-group">
          <label className="form-label">Tanggal Sampai</label>
          <input type="date" className="form-input" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1) }} />
        </div>
        <div className="form-group full-width">
          <label className="form-label">Cari Judul</label>
          <input type="text" className="form-input" placeholder="ketik judul..." value={searchTitle} onChange={(e) => { setSearchTitle(e.target.value); setPage(1) }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Tipe Berita</th>
              <th>Penulis</th>
              <th>Status</th>
              <th>Tanggal Publish</th>
              <th>Keyword</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, idx) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                <td style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, fontWeight: 400 }}>{item.judul}</td>
                <td>{item.tipeBerita}</td>
                <td>{item.penulis}</td>
                <td>{item.status}</td>
                <td>{item.tanggalPublish}</td>
                <td>{(item.keywords || []).join(', ')}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-secondary" type="button" onClick={() => handleEdit(item.id)} aria-label="Edit" title="Edit" style={{ padding: 6 }}>
                      <PencilSquareIcon style={{ width: 16, height: 16 }} />
                    </button>
                    <button className="btn btn-sm btn-secondary" type="button" onClick={() => handleDelete(item.id)} aria-label="Hapus" title="Hapus" style={{ padding: 6 }}>
                      <TrashIcon style={{ width: 16, height: 16, color: '#ef4444' }} />
                    </button>
                    <button className="btn btn-sm btn-secondary" type="button" onClick={() => handleMakeHeadline(item)} aria-label="Jadikan Headline" title="Jadikan Headline" style={{ padding: 6 }}>
                      <MegaphoneIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#666' }}>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (sederhana) */}
      <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 12 }}>
        <button className="btn" type="button" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span style={{ margin: '0 8px' }}>Hal {currentPage} / {totalPages}</span>
        <button className="btn" type="button" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  )
}