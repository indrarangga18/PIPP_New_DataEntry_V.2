import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'

export default function MasterDataJenisFasilitas() {
  return (
    <MasterDataEditor
      category="jenisFasilitas"
      baseOptions={[]}
      title="Master Data - Jenis Fasilitas"
      description="Kelola daftar jenis fasilitas untuk berbagai halaman."
    />
  )
}