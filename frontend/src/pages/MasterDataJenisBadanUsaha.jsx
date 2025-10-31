import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { JENIS_BADAN_USAHA_OPTIONS } from '../utils/formStandards'

export default function MasterDataJenisBadanUsaha() {
  return (
    <MasterDataEditor
      category="jenisBadanUsaha"
      baseOptions={JENIS_BADAN_USAHA_OPTIONS}
      title="Master Data - Jenis Badan Usaha"
      description="Kelola daftar jenis badan usaha untuk digunakan pada halaman industri di pelabuhan dan lainnya."
    />
  )
}