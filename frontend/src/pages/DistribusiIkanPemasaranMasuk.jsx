import React, { useMemo, useState } from 'react'
import AutoBreadcrumb from '../components/AutoBreadcrumb'
import SmartSelect from '../components/SmartSelect'
import { PELABUHAN_OPTIONS, KONDISI_OPTIONS, TRANSPORTASI_OPTIONS, JENIS_IKAN_OPTIONS } from '../utils/formStandards'

// Base options dipindahkan ke utils/formStandards.js agar konsisten lintas halaman

export default function DistribusiIkanPemasaranMasuk() {
  const [openTip, setOpenTip] = useState(null)
  const [header, setHeader] = useState({ pelabuhan: '', tanggalMasuk: '' })
  const initialRows = useMemo(() => (
    Array.from({ length: 5 }, () => ({ jenisIkan: '', kondisi: '', jumlahKg: '', harga: '', asalIkan: '', transportasi: 'Kapal Angkut' }))
  ), [])
  const [rows, setRows] = useState(initialRows)
  const [doShake, setDoShake] = useState(false)

  // Tips bantuan pengisian
  const TIPS = {
    transportasi: 'Pilih jenis transportasi yang digunakan untuk pemasaran masuk. Contoh: Kapal Angkut, Truk Pendingin, Pickup. Jika tidak ada, pilih "Lainnya" lalu tambahkan di Master Data.',
    jenisIkan: 'Pilih jenis ikan sesuai daftar master data. Contoh: Tuna, Cakalang, Bandeng.',
    kondisi: 'Pilih kondisi ikan sesuai standar: Baik, Rusak, Tahap Pembangunan, dsb.',
    jumlahKg: 'Masukkan berat ikan dalam kilogram. Contoh: 150, 250.5, 1000.',
    harga: 'Masukkan harga per kilogram dalam rupiah. Contoh: 25000, 50000, 75000.',
    asalIkan: 'Masukkan asal daerah penangkapan ikan. Contoh: Laut Jawa, Selat Sunda, Samudera Hindia.',
  }

  const newEmptyRow = () => ({ jenisIkan: '', kondisi: '', jumlahKg: '', harga: '', asalIkan: '', transportasi: 'Kapal Angkut' })

  const isRequiredEmpty = (key) => {
    if (key === 'pelabuhan') return !header.pelabuhan
    if (key === 'tanggalMasuk') return !header.tanggalMasuk
    return false
  }

  const handleHeaderChange = (e) => {
    const { name, value } = e.target
    setHeader(prev => ({ ...prev, [name]: value }))
  }

  const handleRowChange = (idx, field, value) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  const addRow = () => {
    setRows(prev => [...prev, newEmptyRow()])
  }

  const deleteRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx))
  }

  const resetForm = () => {
    setHeader({ pelabuhan: '', tanggalMasuk: '' })
    setRows(initialRows)
  }

  const onSave = () => {
    if (isRequiredEmpty('pelabuhan') || isRequiredEmpty('tanggalMasuk')) {
      setDoShake(true)
      setTimeout(() => setDoShake(false), 500)
      return
    }
    const payload = { ...header, items: rows }
    // TODO: integrasi API backend ketika endpoint tersedia
    console.log('Simpan pemasaran masuk:', payload)
    alert('Data pemasaran masuk siap disimpan (mock).')
  }

  const saveDisabled = isRequiredEmpty('pelabuhan') || isRequiredEmpty('tanggalMasuk')

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">Distribusi Ikan - Pemasaran Masuk</h2>
      <p className="section-desc">Input pemasaran masuk per pelabuhan dan tanggal, dengan tabel item dinamis.</p>

      {/* Header: Pelabuhan & Tanggal Masuk */}
      <div className="fasilitas-form" style={{ paddingTop: 0 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className={`form-group ${isRequiredEmpty('pelabuhan') ? 'error' : ''} ${isRequiredEmpty('pelabuhan') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Pelabuhan <span className="required-mark">*</span></label>
            <SmartSelect
              name="pelabuhan"
              value={header.pelabuhan}
              onChange={handleHeaderChange}
              category="pelabuhan"
              baseOptions={PELABUHAN_OPTIONS}
              className="form-select"
              required
              style={{ fontSize: 14 }}
              placeholder="Cari atau pilih pelabuhan..."
            />
          </div>
          <div className={`form-group ${isRequiredEmpty('tanggalMasuk') ? 'error' : ''} ${isRequiredEmpty('tanggalMasuk') && doShake ? 'shake' : ''}`}>
            <label className="form-label">Tanggal Masuk <span className="required-mark">*</span></label>
            <input
              type="date"
              name="tanggalMasuk"
              value={header.tanggalMasuk}
              onChange={handleHeaderChange}
              className="form-input"
              required
            />
          </div>
        </div>
      </div>

      {/* Pelabuhan Terpilih */}
      {header.pelabuhan && (
        <div style={{ marginTop: 16, padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: 6, border: '1px solid #e5e7eb' }}>
          <span style={{ color: '#6b7280', fontSize: 14 }}>Pelabuhan Terpilih: </span>
          <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{header.pelabuhan}</span>
        </div>
      )}

      {/* Tabel dinamis - disesuaikan dengan layout form */}
      <div className="fasilitas-form" style={{ paddingTop: 0 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <div className="form-group">
            <label className="form-label">Rincian Item</label>
          </div>
          <div className="form-group" style={{ alignSelf: 'end', justifySelf: 'start' }}>
            <label className="form-label" style={{ visibility: 'hidden' }}>Aksi</label>
            <button type="button" className="btn btn-primary btn-sm" onClick={addRow}>Tambah Kolom</button>
          </div>
        </div>
        <div className="form-group full-width" style={{ marginTop: 0 }}>
          <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>No.</th>
                <th style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
                  Jenis Ikan
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.jenisIkan} onMouseEnter={() => setOpenTip('jenisIkan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                  {openTip === 'jenisIkan' && (
                    <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 280, zIndex: 20 }}>
                      <div style={{ fontSize: 12 }}>{TIPS.jenisIkan}</div>
                      <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </th>
                <th style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
                  Kondisi
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.kondisi} onMouseEnter={() => setOpenTip('kondisi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                  {openTip === 'kondisi' && (
                    <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 280, zIndex: 20 }}>
                      <div style={{ fontSize: 12 }}>{TIPS.kondisi}</div>
                      <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </th>
                <th style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
                  Jumlah (Kg)
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.jumlahKg} onMouseEnter={() => setOpenTip('jumlahKg')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                  {openTip === 'jumlahKg' && (
                    <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 280, zIndex: 20 }}>
                      <div style={{ fontSize: 12 }}>{TIPS.jumlahKg}</div>
                      <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </th>
                <th style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
                  Harga
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.harga} onMouseEnter={() => setOpenTip('harga')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                  {openTip === 'harga' && (
                    <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 280, zIndex: 20 }}>
                      <div style={{ fontSize: 12 }}>{TIPS.harga}</div>
                      <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </th>
                <th style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
                  Asal Ikan
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.asalIkan} onMouseEnter={() => setOpenTip('asalIkan')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                  {openTip === 'asalIkan' && (
                    <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 280, zIndex: 20 }}>
                      <div style={{ fontSize: 12 }}>{TIPS.asalIkan}</div>
                      <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </th>
                <th style={{ position: 'relative' }} onMouseLeave={() => setOpenTip(null)}>
                  Transportasi
                  <span className="tooltip-trigger" role="button" aria-label={TIPS.transportasi} onMouseEnter={() => setOpenTip('transportasi')} style={{ color: '#6b7280', fontWeight: 600, fontSize: 12, marginLeft: 6, cursor: 'help', padding: 0, display: 'inline-block' }}>?</span>
                  {openTip === 'transportasi' && (
                    <div role="dialog" aria-label="Informasi pengisian" style={{ position: 'absolute', top: 6, right: 8, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '8px 10px', maxWidth: 280, zIndex: 20 }}>
                      <div style={{ fontSize: 12 }}>{TIPS.transportasi}</div>
                      <button onClick={() => setOpenTip(null)} aria-label="Tutup" style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>✕</button>
                    </div>
                  )}
                </th>
                <th>Aksi</th>
              </tr>
            </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="cell-number">{idx + 1}.</td>
                <td>
                  <SmartSelect
                    name={`jenisIkan_${idx}`}
                    value={row.jenisIkan}
                    onChange={(e) => handleRowChange(idx, 'jenisIkan', e.target.value)}
                    category="jenisIkan"
                    baseOptions={JENIS_IKAN_OPTIONS}
                    className="form-select"
                    style={{ fontSize: 14 }}
                    placeholder="Mulai ketik nama ikan..."
                  />
                </td>
                <td>
                  <SmartSelect
                    name={`kondisi_${idx}`}
                    value={row.kondisi}
                    onChange={(e) => handleRowChange(idx, 'kondisi', e.target.value)}
                    category="kondisi"
                    baseOptions={KONDISI_OPTIONS}
                    className="form-select"
                    style={{ fontSize: 14 }}
                    placeholder="Pilih kondisi..."
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={row.jumlahKg}
                    onChange={(e) => handleRowChange(idx, 'jumlahKg', e.target.value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={row.harga}
                    onChange={(e) => handleRowChange(idx, 'harga', e.target.value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    value={row.asalIkan}
                    onChange={(e) => handleRowChange(idx, 'asalIkan', e.target.value)}
                    placeholder="Asal ikan..."
                  />
                </td>
                <td>
                  <SmartSelect
                    name={`transportasi_${idx}`}
                    value={row.transportasi}
                    onChange={(e) => handleRowChange(idx, 'transportasi', e.target.value)}
                    category="transportasi"
                    baseOptions={TRANSPORTASI_OPTIONS}
                    className="form-select"
                    style={{ fontSize: 14 }}
                    placeholder="Pilih transportasi..."
                  />
                </td>
                <td>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => deleteRow(idx)}>Hapus Kolom</button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Aksi */}
      <div className="form-actions" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-primary btn-lg btn-wide" onClick={onSave} disabled={saveDisabled}>Simpan</button>
        <button type="button" className="btn btn-secondary btn-lg btn-wide" onClick={resetForm}>Hapus Isian</button>
      </div>
      {saveDisabled && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>Lengkapi semua field wajib sebelum menyimpan.</div>
      )}
    </div>
  )
}