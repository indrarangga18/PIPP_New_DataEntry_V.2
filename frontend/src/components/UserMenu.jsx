import React, { useEffect, useRef, useState } from 'react'
import './user-menu.css'
import avatarFallback from '../assets/avatar.svg'
import { useNavigate } from 'react-router-dom'

export default function UserMenu({ name = 'User', photoUrl = '/user-photo.png' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const go = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-trigger" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open}>
        <img src={photoUrl} onError={(e) => { e.currentTarget.src = avatarFallback }} alt="User avatar" className="avatar" />
        <span className="user-name">{name}</span>
        <span className="chevron">▾</span>
      </button>
      {open && (
        <div className="menu" role="menu">
          <button className="menu-item" role="menuitem" onClick={() => go('/profil')}>Profil</button>
          <button className="menu-item" role="menuitem" onClick={() => go('/pengaturan')}>Pengaturan</button>
        </div>
      )}
    </div>
  )
}