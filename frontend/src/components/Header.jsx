import React from 'react'
import './header.css'
import logoSvg from '../assets/logo.svg'
import logoNewEntry from '../assets/Image/logo-newdataentryy.png'
import logoKkp from '../assets/Image/logo-KKP.png'
import UserMenu from './UserMenu'

export default function Header({ onToggleSidebar, collapsed = false }) {
  return (
    <header className="app-header">
      <div className="left">
        <button className="hamburger" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          {collapsed ? (
            <img src={logoKkp} onError={(e) => { e.currentTarget.src = logoSvg }} alt="KKP" style={{ width: 24, height: 24, borderRadius: 4 }} />
          ) : (
            <>
              <span />
              <span />
              <span />
            </>
          )}
        </button>
        <div className="brand">
          <img
            src={logoNewEntry}
            onError={(e) => { e.currentTarget.src = logoSvg }}
            alt="New Data Entry PIPP Logo"
            className="logo"
          />
          <div className="brand-text">
            <h1 className="title">New Data Entry PIPP</h1>
            <p className="subtitle">Kementerian Kelautan dan Perikanan</p>
          </div>
        </div>
      </div>
      <UserMenu name="User" photoUrl="/user-photo.png" />
    </header>
  )
}