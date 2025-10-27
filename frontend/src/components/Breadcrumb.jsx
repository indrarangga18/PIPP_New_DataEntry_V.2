import React from 'react'
import { NavLink } from 'react-router-dom'
import './breadcrumb.css'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <NavLink to="/" className="crumb">Home</NavLink>
      {items.map((item, idx) => (
        <span key={idx} className="sep">›</span>
      ))}
      {items.map((item, idx) => (
        item.to ? (
          <NavLink key={idx} to={item.to} className="crumb">{item.label}</NavLink>
        ) : (
          <span key={idx} className="crumb current" aria-current="page">{item.label}</span>
        )
      ))}
    </nav>
  )
}