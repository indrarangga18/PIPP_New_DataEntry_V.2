import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import '../styles/tabs.css'

export default function Tabs({ items = [], defaultIndex = 0, children }) {
  const [active, setActive] = useState(defaultIndex)
  const location = useLocation()

  const routerMode = items.some((item) => !!item.to)

  return (
    <div className="tabs">
      <div className="tabs-nav" role="tablist" aria-label="Tabs">
        {items.map((item, idx) => {
          const key = item.key || idx
          if (routerMode && item.to) {
            return (
              <NavLink
                key={key}
                to={item.to}
                className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            )
          }
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active === idx}
              className={`tab ${active === idx ? 'active' : ''}`}
              onClick={() => setActive(idx)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="tab-content" role="tabpanel">
        {routerMode ? children : items[active] && items[active].content}
      </div>
    </div>
  )
}