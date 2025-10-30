import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { INDUSTRI_OPTIONS } from '../utils/formStandards'

export default function MasterDataIndustri() {
  return (
    <MasterDataEditor
      category="industri"
      baseOptions={INDUSTRI_OPTIONS}
      title="Master Data - Industri Pengolahan"
      description="Kelola daftar jenis industri pengolahan perikanan untuk digunakan pada halaman Produksi."
    />
  )
}