import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { HASIL_OLAHAN_OPTIONS } from '../utils/formStandards'

export default function MasterDataHasilOlahan() {
  return (
    <MasterDataEditor
      category="hasilOlahan"
      baseOptions={HASIL_OLAHAN_OPTIONS}
      title="Master Data - Hasil Olahan"
      description="Kelola daftar hasil olahan perikanan untuk digunakan pada halaman Produksi."
    />
  )
}