import React from 'react'
import { useLocation } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

const LABELS = {
  '': 'Home',
  'produksi': 'Produksi',
  'distribusi-ikan': 'Distribusi Ikan',
  'usaha-pendapatan-pelabuhan': 'Usaha dan pendapatan Pelabuhan',
  'dokumen-pelabuhan-perikanan': 'Dokumen Pelabuhan Perikanan',
  'fasilitas': 'Fasilitas',
  'master-data': 'Master Data',
  'pelabuhan': 'Profil Pelabuhan',
  'sumber-dana': 'Sumber Dana',
  'jenis-konstruksi': 'Jenis Konstruksi',
  'jenis-fasilitas': 'Jenis Fasilitas',
  'kondisi': 'Kondisi',
  'pokok': 'Pokok',
  'jalan': 'Jalan',
  'groin': 'Groin',
  'drainase-jembatan': 'Drainase Jembatan',
  'revetment': 'Revetment',
  'breakwater': 'Breakwater',
  'website': 'Website',
  'profil': 'Profil',
  'pengaturan': 'Pengaturan',
}

function toLabel(segment) {
  if (LABELS[segment]) return LABELS[segment]
  // Fallback: beautify segment
  return segment
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

export default function AutoBreadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  const items = segments.map((seg, idx) => {
    const to = '/' + segments.slice(0, idx + 1).join('/')
    const label = toLabel(seg)
    const isLast = idx === segments.length - 1
    return isLast ? { label } : { label, to }
  })

  return <Breadcrumb items={items} />
}