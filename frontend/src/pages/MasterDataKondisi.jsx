import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { KONDISI_OPTIONS } from '../utils/formStandards'

export default function MasterDataKondisi() {
  return (
    <MasterDataEditor
      category="kondisi"
      baseOptions={KONDISI_OPTIONS}
      title="Master Data - Kondisi"
      description="Kelola daftar kondisi standar fasilitas."
    />
  )
}