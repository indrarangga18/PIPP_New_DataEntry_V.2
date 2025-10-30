import React, { useState, useEffect } from 'react'
import './sidebar.css'
import { NavLink, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ChartBarIcon,
  TruckIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'

export default function Sidebar({ open, collapsed, onClose }) {
  const [openSubmenus, setOpenSubmenus] = useState({})

  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      onClose()
    }
  }

  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const items = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/produksi', label: 'Produksi', icon: ChartBarIcon },
    {
      key: 'distribusi-ikan',
      label: 'Distribusi Ikan',
      icon: TruckIcon,
      submenu: [
        { to: '/distribusi-ikan/pemasaran-masuk', label: 'Pemasaran Masuk' },
        { to: '/distribusi-ikan/pemasaran-keluar', label: 'Pemasaran Keluar' },
      ]
    },
    { to: '/usaha-pendapatan-pelabuhan', label: 'Usaha dan pendapatan Pelabuhan', icon: BanknotesIcon },
    { to: '/dokumen-pelabuhan-perikanan', label: 'Dokumen Pelabuhan Perikanan', icon: ClipboardDocumentListIcon },
    {
      key: 'pelabuhan',
      label: 'Profil Pelabuhan',
      icon: BuildingOfficeIcon,
      submenu: [
        { to: '/pelabuhan/kondisi-fisik', label: 'Kondisi fisik pelabuhan' },
        { to: '/pelabuhan/data-umum', label: 'Data umum' },
        { to: '/pelabuhan/informasi-wilayah', label: 'Informasi wilayah pelabuhan' },
        { to: '/pelabuhan/akses', label: 'Akses pelabuhan' },
        { to: '/pelabuhan/amenities', label: 'Amenities Pelabuhan' },
        { to: '/pelabuhan/transportasi', label: 'Transportasi pelabuhan' },
        { to: '/pelabuhan/pemangku-kepentingan', label: 'Pemangku kepentingan' },
        { to: '/pelabuhan/masalah-upaya', label: 'Masalah dan upaya' },
        { to: '/pelabuhan/monitoring-k5', label: 'Monitoring K5' },
        { to: '/pelabuhan/kelembagaan-upt', label: 'Kelembagaan UPT pelabuhan' },
        { to: '/pelabuhan/penyaluran-perbekalan', label: 'Penyaluran perbekalan' },
        { to: '/pelabuhan/target-pnbp-sda', label: 'Target PNBP SDA' },
        { to: '/pelabuhan/indeks-kepuasan-masyarakat', label: 'Indeks Kepuasan Masyarakat' },
        { to: '/pelabuhan/tata-kelola-lingkungan', label: 'Tata kelola lingkungan' },
        { to: '/pelabuhan/kebersihan-kolam', label: 'Kebersihan Kolam' },
        { to: '/pelabuhan/kebersihan-daratan', label: 'Kebersihan daratan' },
        { to: '/pelabuhan/bimtek-cpib', label: 'Bimbingan teknis CPIB Kepada nelayan' },
      ]
    },
    { 
      key: 'fasilitas',
      label: 'Fasilitas', 
      icon: BuildingOfficeIcon,
      submenu: [
        {
          key: 'pokok',
          label: 'Pokok',
          submenu: [
            { to: '/fasilitas/pokok/tanah', label: 'Tanah' },
            { to: '/fasilitas/pokok/dermaga', label: 'Dermaga' },
            { to: '/fasilitas/pokok/kolam-pelabuhan', label: 'Kolam pelabuhan' },
            { to: '/fasilitas/pokok/sarana-bantu-navigasi', label: 'Sarana bantu navigasi pelayaran' },
            { to: '/fasilitas/pokok/breakwater', label: 'Breakwater' },
            { to: '/fasilitas/pokok/revetment', label: 'Revetment' },
            { to: '/fasilitas/pokok/groin', label: 'Groin' },
            { to: '/fasilitas/pokok/drainase-jembatan', label: 'Drainase Dan Jembatan' },
            { to: '/fasilitas/pokok/jalan', label: 'Jalan' },
          ]
        },
        {
          key: 'fungsional',
          label: 'Fungsional',
          submenu: [
            { to: '/fasilitas/fungsional/tempat-pemasaran-ikan', label: 'Tempat Pemasaran Ikan' },
            { to: '/fasilitas/fungsional/menara-pengawasan', label: 'Menara pengawasan aktifitas pelabuhan perikanan' },
            { to: '/fasilitas/fungsional/fasilitas-komunikasi', label: 'Fasilitias Komunikasi' },
            { to: '/fasilitas/fungsional/pemadam-kebakaran', label: 'Fasilitas Pemadam Kebakaran' },
            { to: '/fasilitas/fungsional/air-bbm-es-listrik', label: 'Fasilitas air bersih, Bahan bakar (BBM), es, dan listrik' },
            { to: '/fasilitas/fungsional/pemeliharaan-kapal', label: 'Tempat pemeliharaan kapal' },
            { to: '/fasilitas/fungsional/pemeliharaan-alat-tangkap', label: 'Tempat pemeliharaan alat dan penangkapan ikan' },
            { to: '/fasilitas/fungsional/penangkapan-pengolahan', label: 'Tempat penangkapan ikan dan pengolahan hasil perikanan' },
            { to: '/fasilitas/fungsional/perkantoran', label: 'Perkantoran' },
            { to: '/fasilitas/fungsional/transportasi', label: 'Transportasi' },
            { to: '/fasilitas/fungsional/kebersihan-limbah', label: 'Kebersihan dan pengelolaan limbah' },
          ]
        },
        {
          key: 'penunjang',
          label: 'Penunjang',
          submenu: [
            { to: '/fasilitas/penunjang/balai-pertemuan-nelayan', label: 'Balai pertemuan nelayan' },
            { to: '/fasilitas/penunjang/mes-operator', label: 'mes operator' },
            { to: '/fasilitas/penunjang/wisma-nelayan', label: 'wisma nelayan' },
            { to: '/fasilitas/penunjang/fasilitas-sosial-dan-umum', label: 'fasilitas sosial dan umum' },
            { to: '/fasilitas/penunjang/tempat-istirahat-shelter-nelayan', label: 'tempat istirahat/shelter nelayan' },
            { to: '/fasilitas/penunjang/pertokoan-kios-nelayan', label: 'pertokoan/kios nelayan' },
            { to: '/fasilitas/penunjang/fasilitas-pengamanan-kawasan', label: 'fasilitas pengamanan kawasan' },
            { to: '/fasilitas/penunjang/pasar-ikan', label: 'Pasar Ikan' },
          ]
        }
      ]
    },
    { to: '/website', label: 'Website', icon: GlobeAltIcon },
    { to: '/berita', label: 'Berita', icon: DocumentTextIcon },
    {
      key: 'master-data',
      label: 'Master Data',
      icon: ClipboardDocumentListIcon,
      submenu: [
        { to: '/master-data/pelabuhan', label: 'Pelabuhan' },
        { to: '/master-data/sumber-dana', label: 'Sumber Dana' },
        { to: '/master-data/jenis-konstruksi', label: 'Jenis Konstruksi' },
        { to: '/master-data/jenis-fasilitas', label: 'Jenis Fasilitas' },
        { to: '/master-data/kondisi', label: 'Kondisi' },
        { to: '/master-data/industri', label: 'Industri' },
        { to: '/master-data/hasil-olahan', label: 'Hasil Olahan' },
        { to: '/master-data/tipe-dokumen', label: 'Tipe Dokumen' },
        { to: '/master-data/jenis-ikan', label: 'Jenis Ikan' },
        { to: '/master-data/transportasi', label: 'Transportasi' },
      ]
    },
    { to: '/profil', label: 'Profil', icon: UserCircleIcon },
    { to: '/pengaturan', label: 'Pengaturan', icon: Cog6ToothIcon },
  ]

  // Auto-expand submenus when current route is inside their subtree
  const location = useLocation()
  useEffect(() => {
    const matchLink = (it) => it.to && (location.pathname === it.to || location.pathname.startsWith(it.to + '/'))
    const findKeys = (list) => {
      for (const it of list) {
        if (it.submenu) {
          const childKeys = findKeys(it.submenu)
          if (childKeys) return [it.key, ...childKeys]
        } else if (matchLink(it)) {
          return []
        }
      }
      return null
    }
    const keys = findKeys(items) || []
    setOpenSubmenus(prev => {
      const next = { ...prev }
      keys.forEach(k => { if (prev[k] !== false) next[k] = true })
      return next
    })
  }, [location.pathname])

  // location is defined above for auto-expanding logic
  
  const hasActiveChild = (item) => {
    if (item.to) {
      return location.pathname === item.to || location.pathname.startsWith(item.to + '/')
    }
    if (item.submenu) {
      return item.submenu.some(child => hasActiveChild(child))
    }
    return false
  }
  
  const renderMenuItem = (item, level = 0) => {
    if (item.submenu) {
      const isOpen = openSubmenus[item.key]
      const isActive = hasActiveChild(item)
      return (
        <div key={item.key} className={`menu-item-container level-${level}`}>
          <button 
            className={`nav-button ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => toggleSubmenu(item.key)}
          >
            {item.icon && <item.icon className="icon" aria-hidden="true" />}
            <span className="label">{item.label}</span>
            {!collapsed && (
              isOpen ? 
                <ChevronDownIcon className="chevron" /> : 
                <ChevronRightIcon className="chevron" />
            )}
          </button>
          {isOpen && !collapsed && (
            <div className="submenu">
              {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
            </div>
          )}
        </div>
      )
    }

    if (item.to) {
      return (
        <NavLink 
          key={item.to} 
          to={item.to} 
          onClick={handleNavClick}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} level-${level}`}
        >
          {item.icon && <item.icon className="icon" aria-hidden="true" />}
          <span className="label">{item.label}</span>
        </NavLink>
      )
    }

    return null
  }

  return (
    <aside className={`sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
      <nav className="nav">
        {items.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  )
}