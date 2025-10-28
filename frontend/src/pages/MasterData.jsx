import React from 'react'
import AutoBreadcrumb from '../components/AutoBreadcrumb'

export default function MasterData() {
  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">Master Data</h2>
      <p className="section-desc">Konfigurasi data induk untuk dropdown di seluruh halaman.</p>

      <div style={{ marginTop: 16 }}>
        <p style={{ color: '#374151', fontSize: 14 }}>
          Pilih kategori di sidebar: Pelabuhan, Sumber Dana, Jenis Konstruksi, Jenis Fasilitas, atau Kondisi.
        </p>
        <div style={{ marginTop: 12, padding: '12px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
            Halaman sementara: pengelolaan master data akan diisi kemudian.
          </p>
        </div>
      </div>
    </div>
  )
}