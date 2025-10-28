import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { SUMBER_DANA_OPTIONS } from '../utils/formStandards'

export default function MasterDataSumberDana() {
  return (
    <MasterDataEditor
      category="sumberDana"
      baseOptions={SUMBER_DANA_OPTIONS}
      title="Master Data - Sumber Dana"
      description="Kelola daftar sumber dana untuk pengisian form."
    />
  )
}