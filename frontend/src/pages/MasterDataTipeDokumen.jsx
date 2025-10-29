import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { TIPE_DOKUMEN_OPTIONS } from '../utils/formStandards'

export default function MasterDataTipeDokumen() {
  return (
    <MasterDataEditor
      category="tipeDokumen"
      baseOptions={TIPE_DOKUMEN_OPTIONS}
      title="Master Data - Tipe Dokumen"
      description="Kelola daftar tipe dokumen yang digunakan di seluruh form dokumen pelabuhan perikanan."
    />
  )
}