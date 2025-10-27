import React from 'react'
import Breadcrumb from '../components/Breadcrumb'

export default function Settings(){
  return (
    <>
      <Breadcrumb items={[{ label: 'Pengaturan' }]} />
      <div className="section-card">
        <h2 className="section-title">Pengaturan</h2>
        <p className="section-desc">Preferensi aplikasi dan konfigurasi tampilan.</p>
      </div>
    </>
  )
}