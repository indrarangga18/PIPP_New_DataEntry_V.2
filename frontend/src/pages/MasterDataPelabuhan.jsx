import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { PELABUHAN_OPTIONS } from '../utils/formStandards'

export default function MasterDataPelabuhan() {
  return (
    <MasterDataEditor
      category="pelabuhan"
      baseOptions={PELABUHAN_OPTIONS}
      title="Master Data - Pelabuhan"
      description="Kelola daftar pelabuhan yang digunakan di seluruh form."
    />
  )
}