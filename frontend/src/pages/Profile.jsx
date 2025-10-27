import React, { useEffect, useState } from 'react'

export default function Profile(){
  const [user, setUser] = useState({ name: '-', email: '-' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
    fetch(`${API_BASE}/api/user`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setUser({ name: data.name || '-', email: data.email || '-' })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="section-card">
        <h2 className="section-title">Profil</h2>
        <p className="section-desc">Informasi pengguna dan pengaturan akun.</p>
        <div style={{ marginTop: 12 }}>
          {loading ? (
            <span>Memuat data…</span>
          ) : error ? (
            <span style={{ color: '#b91c1c' }}>Gagal memuat: {error}</span>
          ) : (
            <div>
              <div><strong>Nama:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}