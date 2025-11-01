import React from 'react'
import MasterDataEditor from '../components/MasterDataEditor'
import { URL_WEBSITE_OPTIONS } from '../utils/formStandards'

export default function MasterDataUrlWebsite() {
  return (
    <MasterDataEditor
      category="urlWebsite"
      baseOptions={URL_WEBSITE_OPTIONS}
      title="Master Data - URL Website"
      description="Kelola daftar URL/tautan yang digunakan pada halaman Website Banner."
    />
  )
}