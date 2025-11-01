import React from 'react'
import AutoBreadcrumb from '../components/AutoBreadcrumb'
import Tabs from '../components/Tabs'
import { Outlet } from 'react-router-dom'

export default function Berita() {
  return (
    <div className="section-card">
      <AutoBreadcrumb />
      <h2 className="section-title">Berita</h2>
      <p className="section-desc">Kelola dan tampilkan berita terkait pelabuhan dan kegiatan.</p>

      <Tabs
        items={[
          { key: 'daftar-berita', label: 'Daftar Berita PIPP', to: '/berita/daftar' },
          { key: 'entry-berita', label: 'Entry Berita PIPP', to: '/berita/entry' },
          { key: 'headline-berita', label: 'Daftar Headline PIPP', to: '/berita/headline' }
        ]}
      >
        <Outlet />
      </Tabs>
    </div>
  )
}