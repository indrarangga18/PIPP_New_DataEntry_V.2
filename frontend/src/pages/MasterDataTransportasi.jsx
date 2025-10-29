import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { TRANSPORTASI_OPTIONS } from '../utils/formStandards'

export default function MasterDataTransportasi() {
  return (
    <MasterDataEditor
      category="transportasi"
      baseOptions={TRANSPORTASI_OPTIONS}
      title="Master Data - Transportasi"
      description="Kelola daftar jenis transportasi untuk digunakan pada halaman distribusi dan lainnya."
    />
  )
}