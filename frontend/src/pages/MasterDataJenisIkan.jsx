import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { JENIS_IKAN_OPTIONS } from '../utils/formStandards'

export default function MasterDataJenisIkan() {
  return (
    <MasterDataEditor
      category="jenisIkan"
      baseOptions={JENIS_IKAN_OPTIONS}
      title="Master Data - Jenis Ikan"
      description="Kelola daftar jenis ikan untuk digunakan pada halaman distribusi dan lainnya."
    />
  )
}