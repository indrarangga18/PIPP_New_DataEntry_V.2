import React, { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import AutoBreadcrumb from '../components/AutoBreadcrumb'
import './layout.css'

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const onToggleSidebar = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setOpen(!open)
    } else {
      setCollapsed(!collapsed)
    }
  }

  return (
    <div className={`app ${open ? 'sidebar-open' : ''} ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Header onToggleSidebar={onToggleSidebar} collapsed={collapsed} />
      <Sidebar open={open} collapsed={collapsed} onClose={() => setOpen(false)} />
      {/* Overlay untuk mobile */}
      <div
        className={`backdrop ${open ? 'visible' : ''}`}
        onClick={() => open && setOpen(false)}
      />
      <main className="content" onClick={() => open && setOpen(false)}>
        <AutoBreadcrumb />
        {children}
      </main>
    </div>
  )
}