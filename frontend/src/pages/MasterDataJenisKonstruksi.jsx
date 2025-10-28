import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'

export default function MasterDataJenisKonstruksi() {
  return (
    <MasterDataEditor
      category="jenisKonstruksi"
      baseOptions={[]}
      title="Master Data - Jenis Konstruksi"
      description="Kelola daftar jenis konstruksi yang digunakan di form."
    />
  )
}