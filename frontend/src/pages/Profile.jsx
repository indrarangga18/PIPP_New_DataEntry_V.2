import React, { useEffect, useMemo, useState } from 'react'
import AutoBreadcrumb from '../components/AutoBreadcrumb'

export default function Profile(){
  const LS_KEY = 'pipp_profile_v1'
  const [user, setUser] = useState({ name: '-', email: '-', username: '', jabatan: '', instansi: '', phone: '', address: '', photo: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('umum') // 'umum' | 'kontak' | 'keamanan'
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState({ name: '', email: '', username: '', jabatan: '', instansi: '', phone: '', address: '', photo: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    // Muat dari localStorage jika ada, fallback ke API
    const saved = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} } })()
    if (saved && (saved.name || saved.email)) {
      setUser({
        name: saved.name || '-',
        email: saved.email || '-',
        username: saved.username || '',
        jabatan: saved.jabatan || '',
        instansi: saved.instansi || '',
        phone: saved.phone || '',
        address: saved.address || '',
        photo: saved.photo || ''
      })
      setLoading(false)
      return
    }
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
    fetch(`${API_BASE}/api/user`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setUser({ name: data.name || '-', email: data.email || '-', username: '', jabatan: '', instansi: '', phone: '', address: '', photo: '' })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setDraft({ name: user.name || '', email: user.email || '', username: user.username || '', jabatan: user.jabatan || '', instansi: user.instansi || '', phone: user.phone || '', address: user.address || '', photo: user.photo || '', newPassword: '', confirmPassword: '' })
  }, [user])

  const tabs = useMemo(() => ([
    { key: 'umum', label: 'Umum' },
    { key: 'kontak', label: 'Kontak' },
    { key: 'keamanan', label: 'Keamanan' },
  ]), [])

  const onChangeDraft = (e) => {
    const { name, value } = e.target
    setDraft((d) => ({ ...d, [name]: value }))
  }

  const onChangePhoto = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setDraft((d) => ({ ...d, photo: typeof dataUrl === 'string' ? dataUrl : '' }))
    }
    reader.readAsDataURL(file)
  }

  const onClearPhoto = () => {
    setDraft((d) => ({ ...d, photo: '' }))
  }

  const onSave = () => {
    // Validasi sederhana untuk perubahan password
    if (draft.newPassword || draft.confirmPassword) {
      if (draft.newPassword !== draft.confirmPassword) {
        alert('Konfirmasi password tidak cocok.')
        return
      }
      // Catatan: penyimpanan password tidak dilakukan di frontend demo ini
    }
    const next = { name: draft.name || '-', email: draft.email || '-', username: draft.username || '', jabatan: draft.jabatan || '', instansi: draft.instansi || '', phone: draft.phone || '', address: draft.address || '', photo: draft.photo || '' }
    setUser(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch {}
    setEditMode(false)
    alert('Perubahan profil disimpan secara lokal.')
  }

  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">Profil</h2>
      <p className="section-desc">Informasi pengguna dan pengaturan akun.</p>

      {/* Toolbar */}
      <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div role="tablist" aria-label="Profil sections" style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e5e7eb', flexGrow: 1 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                marginBottom: '-1px',
                cursor: 'pointer',
                color: activeTab === t.key ? '#111827' : '#6b7280',
                borderBottom: activeTab === t.key ? '2px solid #111827' : '2px solid transparent',
                fontWeight: activeTab === t.key ? 600 : 500
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div>
          {!editMode ? (
            <button className="btn btn-primary" type="button" onClick={() => setEditMode(true)}>Edit</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" type="button" onClick={onSave}>Simpan</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setEditMode(false); setDraft({ name: user.name || '', email: user.email || '', username: user.username || '', jabatan: user.jabatan || '', instansi: user.instansi || '', phone: user.phone || '', address: user.address || '', photo: user.photo || '', newPassword: '', confirmPassword: '' }) }}>Batal</button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ marginTop: 12 }}>
        {loading ? (
          <span>Memuat data…</span>
        ) : error ? (
          <span style={{ color: '#b91c1c' }}>Gagal memuat: {error}</span>
        ) : (
          <div>
            {activeTab === 'umum' && (
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 12 }}>
                <div className="form-group">
                  <label className="form-label">Foto Profil</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {((editMode ? draft.photo : user.photo) || '') ? (
                      <img
                        src={editMode ? draft.photo : user.photo}
                        alt="Foto profil"
                        style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                      />
                    ) : (
                      <div
                        aria-label="Avatar placeholder"
                        title="Avatar"
                        style={{ width: 96, height: 96, borderRadius: '50%', background: '#e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}
                      >
                        {(user.name || 'U').trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                    {editMode ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input type="file" accept="image/*" onChange={onChangePhoto} />
                        {(draft.photo || '') && (
                          <button type="button" className="btn btn-secondary btn-sm" onClick={onClearPhoto}>Hapus Foto</button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nama</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.name}</div>
                  ) : (
                    <input type="text" name="name" value={draft.name} onChange={onChangeDraft} className="form-input" placeholder="Nama pengguna" />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.email}</div>
                  ) : (
                    <input type="email" name="email" value={draft.email} onChange={onChangeDraft} className="form-input" placeholder="Email pengguna" />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.username || '-'}</div>
                  ) : (
                    <input type="text" name="username" value={draft.username} onChange={onChangeDraft} className="form-input" placeholder="Username" />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Jabatan</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.jabatan || '-'}</div>
                  ) : (
                    <input type="text" name="jabatan" value={draft.jabatan} onChange={onChangeDraft} className="form-input" placeholder="Jabatan" />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Instansi</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.instansi || '-'}</div>
                  ) : (
                    <input type="text" name="instansi" value={draft.instansi} onChange={onChangeDraft} className="form-input" placeholder="Instansi/Unit Kerja" />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'kontak' && (
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 12 }}>
                <div className="form-group">
                  <label className="form-label">Telepon</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.phone || '-'}</div>
                  ) : (
                    <input type="tel" name="phone" value={draft.phone} onChange={onChangeDraft} className="form-input" placeholder="Nomor telepon" />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Alamat</label>
                  {!editMode ? (
                    <div className="form-readonly">{user.address || '-'}</div>
                  ) : (
                    <input type="text" name="address" value={draft.address} onChange={onChangeDraft} className="form-input" placeholder="Alamat" />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'keamanan' && (
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 12 }}>
                <div className="form-group">
                  <label className="form-label">Password Baru</label>
                  {!editMode ? (
                    <div className="form-readonly">••••••••</div>
                  ) : (
                    <input type="password" name="newPassword" value={draft.newPassword} onChange={onChangeDraft} className="form-input" placeholder="Password baru" />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Konfirmasi Password</label>
                  {!editMode ? (
                    <div className="form-readonly">••••••••</div>
                  ) : (
                    <input type="password" name="confirmPassword" value={draft.confirmPassword} onChange={onChangeDraft} className="form-input" placeholder="Konfirmasi password" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}