import React, { useMemo, useState } from 'react'
import AutoBreadcrumb from '../components/AutoBreadcrumb'
import SmartSelect from '../components/SmartSelect'
import { INDUSTRI_OPTIONS, HASIL_OLAHAN_OPTIONS, KATEGORI_OPTIONS, TUJUAN_OPTIONS } from '../utils/formStandards'

export default function Produksi(){
  const [rows, setRows] = useState(() => initialRows())

  function initialRows(){
    return Array.from({ length: 5 }, () => ({
      industri: '',
      hasilOlahan: '',
      jumlahKg: '',
      nilaiRp: '',
      kategori: '',
      tujuan: '',
      keterangan: '',
    }))
  }

  const newEmptyRow = () => ({ industri: '', hasilOlahan: '', jumlahKg: '', nilaiRp: '', kategori: '', tujuan: '', keterangan: '' })

  const handleRowChange = (idx, field, value) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)))
  }

  const addRow = () => setRows(prev => [...prev, newEmptyRow()])
  const deleteRow = (idx) => setRows(prev => prev.filter((_, i) => i !== idx))
  const resetForm = () => setRows(initialRows())

  const onSave = () => {
    const payload = { items: rows }
    console.log('Simpan produksi:', payload)
    alert('Data produksi siap disimpan (mock).')
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">Produksi</h2>
      <p className="section-desc">Input produksi perikanan dalam format tabel, mengikuti standar master data.</p>

      {/* Tabel dinamis */}
      <div className="fasilitas-form" style={{ paddingTop: 0 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <div className="form-group">
            <label className="form-label">Rincian Produksi</label>
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
                  <th>Industri</th>
                  <th>Hasil Olahan</th>
                  <th>Jumlah Produksi (Kg)</th>
                  <th>Nilai Produksi (Rp)</th>
                  <th>Kategori</th>
                  <th>Tujuan</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td>
                      <SmartSelect
                        name={`industri_${idx}`}
                        value={row.industri}
                        onChange={(e) => handleRowChange(idx, 'industri', e.target.value)}
                        category="industri"
                        baseOptions={INDUSTRI_OPTIONS}
                        className="form-select"
                        style={{ fontSize: 14 }}
                        placeholder="Pilih industri..."
                      />
                    </td>
                    <td>
                      <SmartSelect
                        name={`hasilOlahan_${idx}`}
                        value={row.hasilOlahan}
                        onChange={(e) => handleRowChange(idx, 'hasilOlahan', e.target.value)}
                        category="hasilOlahan"
                        baseOptions={HASIL_OLAHAN_OPTIONS}
                        className="form-select"
                        style={{ fontSize: 14 }}
                        placeholder="Pilih hasil olahan..."
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
                        step="1"
                        className="form-input"
                        value={row.nilaiRp}
                        onChange={(e) => handleRowChange(idx, 'nilaiRp', e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <SmartSelect
                        name={`kategori_${idx}`}
                        value={row.kategori}
                        onChange={(e) => handleRowChange(idx, 'kategori', e.target.value)}
                        category="kategori"
                        baseOptions={KATEGORI_OPTIONS}
                        className="form-select"
                        style={{ fontSize: 14 }}
                        placeholder="Pilih kategori..."
                      />
                    </td>
                    <td>
                      <SmartSelect
                        name={`tujuan_${idx}`}
                        value={row.tujuan}
                        onChange={(e) => handleRowChange(idx, 'tujuan', e.target.value)}
                        category="tujuan"
                        baseOptions={TUJUAN_OPTIONS}
                        className="form-select"
                        style={{ fontSize: 14 }}
                        placeholder="Pilih tujuan..."
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        value={row.keterangan}
                        onChange={(e) => handleRowChange(idx, 'keterangan', e.target.value)}
                        placeholder="Keterangan (opsional)..."
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
        <button type="button" className="btn btn-primary btn-lg btn-wide" onClick={onSave}>Simpan</button>
        <button type="button" className="btn btn-secondary btn-lg btn-wide" onClick={resetForm} style={{ marginLeft: 8 }}>Reset</button>
      </div>
    </div>
  )
}