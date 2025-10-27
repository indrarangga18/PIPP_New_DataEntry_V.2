import React, { useState } from 'react'
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
    { to: '/distribusi-ikan', label: 'Distribusi Ikan', icon: TruckIcon },
    { to: '/usaha-pendapatan-pelabuhan', label: 'Usaha dan pendapatan Pelabuhan', icon: BanknotesIcon },
    { to: '/dokumen-pelabuhan-perikanan', label: 'Dokumen Pelabuhan Perikanan', icon: ClipboardDocumentListIcon },
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
          to: '/fasilitas/penunjang'
        }
      ]
    },
    { to: '/website', label: 'Website', icon: GlobeAltIcon },
    { to: '/dokumen', label: 'Dokumen', icon: DocumentTextIcon },
    { to: '/profil', label: 'Profil', icon: UserCircleIcon },
    { to: '/pengaturan', label: 'Pengaturan', icon: Cog6ToothIcon },
  ]

  const location = useLocation()
  
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