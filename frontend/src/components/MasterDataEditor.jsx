import React, { useEffect, useMemo, useState } from 'react'
import AutoBreadcrumb from './AutoBreadcrumb'
import { getAllOptions, getHiddenList, isHidden, setHidden, toggleHidden, addOption, removeOption, updateOption } from '../utils/optionsStore'

export default function MasterDataEditor({
  category,
  baseOptions = [],
  title,
  description,
}) {
  const [list, setList] = useState([])
  const [query, setQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [addValue, setAddValue] = useState('')
  const [addHidden, setAddHidden] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editHidden, setEditHidden] = useState(false)
  const [hiddenSet, setHiddenSet] = useState(new Set())

  const baseSet = useMemo(() => new Set(baseOptions || []), [baseOptions])

  const refresh = () => {
    setList(getAllOptions(category, baseOptions))
    setHiddenSet(new Set(getHiddenList(category)))
  }

  useEffect(() => { refresh() }, [category, baseOptions])

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return (list || []).filter(v => v.toLowerCase().includes(q))
  }, [list, query])

  const sorted = useMemo(() => {
    const base = []
    const custom = []
    filtered.forEach((v) => { (baseSet.has(v) ? base : custom).push(v) })
    base.sort((a, b) => a.localeCompare(b))
    custom.sort((a, b) => a.localeCompare(b))
    return [...base, ...custom]
  }, [filtered, baseSet])

  const startAdd = () => {
    setIsAdding(true)
    setAddValue('')
    setAddHidden(false)
  }

  const applyAdd = () => {
    const val = (addValue || '').trim()
    if (!val) return
    addOption(category, val)
    setHidden(category, val, addHidden)
    setIsAdding(false)
    setAddValue('')
    setAddHidden(false)
    refresh()
  }

  const cancelAdd = () => {
    setIsAdding(false)
    setAddValue('')
  }

  const onDelete = (val) => {
    if (baseSet.has(val)) return // protect base options from deletion
    const ok = window.confirm(`Hapus "${val}" dari Master Data?`)
    if (!ok) return
    removeOption(category, val)
    refresh()
  }

  const startEdit = (val) => {
    if (baseSet.has(val)) return // protect base options from editing
    setEditing(val)
    setEditValue(val)
    setEditHidden(isHidden(category, val))
  }

  const applyEdit = () => {
    const next = (editValue || '').trim()
    if (!next || !editing) { setEditing(null); setEditValue(''); setEditHidden(false); return }
    if (next !== editing) {
      // remove hidden flag from old name when renaming
      setHidden(category, editing, false)
    }
    updateOption(category, editing, next)
    setHidden(category, next, editHidden)
    setEditing(null)
    setEditValue('')
    setEditHidden(false)
    refresh()
  }

  const toggleVisibility = (val) => {
    toggleHidden(category, val)
    refresh()
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">{title}</h2>
      {description && (<p className="section-desc">{description}</p>)}

      <div className="fasilitas-form" style={{ paddingTop: 0 }}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <div className="form-group">
            <label className="form-label">Cari</label>
            <input className="form-input" placeholder="Ketik untuk mencari..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="form-group" style={{ alignSelf: 'end', justifySelf: 'end' }}>
            <label className="form-label" style={{ visibility: 'hidden' }}>Aksi</label>
            <button type="button" className="btn btn-primary" onClick={startAdd}>Tambah</button>
          </div>
        </div>

        <div className="form-group full-width" style={{ marginTop: 16 }}>
          <label className="form-label">Daftar Nilai</label>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 13, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Nama</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 13, color: '#6b7280', borderBottom: '1px solid #e5e7eb', width: 140 }}>Tipe</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 13, color: '#6b7280', borderBottom: '1px solid #e5e7eb', width: 240 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isAdding && (
                  <tr style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                      <input
                        className="form-input"
                        placeholder="Misal: nama baru"
                        value={addValue}
                        onChange={(e) => setAddValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') applyAdd() }}
                      />
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                      <select className="form-select" value={addHidden ? 'hide' : 'show'} onChange={(e) => setAddHidden(e.target.value === 'hide')}>
                        <option value="show">Tampilkan</option>
                        <option value="hide">Sembunyikan</option>
                      </select>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button className="btn btn-primary" type="button" onClick={applyAdd}>Simpan</button>
                        <button className="btn" type="button" onClick={cancelAdd}>Batal</button>
                      </div>
                    </td>
                  </tr>
                )}
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '12px 16px', color: '#64748b' }}>Tidak ada data</td>
                  </tr>
                ) : sorted.map((val) => (
                  <tr key={val} style={{ background: editing === val ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                      {editing === val ? (
                        <input className="form-input" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                      ) : (
                        <span style={{ fontSize: 14 }}>
                          {val}
                          {baseSet.has(val) ? (
                            <span style={{ marginLeft: 8, fontSize: 11, color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: 6 }}>Standar</span>
                          ) : (
                            <span style={{ marginLeft: 8, fontSize: 11, color: '#374151', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '1px 6px', borderRadius: 6 }}>Custom</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                      {editing === val ? (
                        <select className="form-select" value={editHidden ? 'hide' : 'show'} onChange={(e) => setEditHidden(e.target.value === 'hide')}>
                          <option value="show">Tampilkan</option>
                          <option value="hide">Sembunyikan</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {hiddenSet.has(val) ? (
                            <span style={{ fontSize: 12, color: '#374151', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '2px 6px', borderRadius: 6 }}>Sembunyikan</span>
                          ) : (
                            <span style={{ fontSize: 12, color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 6px', borderRadius: 6 }}>Tampilkan</span>
                          )}
                          <button className="btn" type="button" onClick={() => toggleVisibility(val)}>
                            {hiddenSet.has(val) ? 'Tampilkan' : 'Sembunyikan'}
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        {editing === val ? (
                          <>
                            <button className="btn btn-primary" type="button" onClick={applyEdit}>Simpan</button>
                            <button className="btn" type="button" onClick={() => { setEditing(null); setEditValue(''); setEditHidden(false) }}>Batal</button>
                          </>
                        ) : (
                          <>
                            <button className="btn" type="button" onClick={() => startEdit(val)} disabled={baseSet.has(val)}>Edit</button>
                            <button className="btn btn-secondary" type="button" onClick={() => onDelete(val)} disabled={baseSet.has(val)}>Hapus</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}