import React, { useEffect, useMemo, useRef, useState } from 'react'

const SearchableSelect = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  className = 'form-select',
  style,
  required = false,
}) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setHighlightIndex(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    // Sync query with current value when value changes externally
    if (value) setQuery(value)
    else setQuery('')
  }, [value])

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return options.filter(opt => opt.toLowerCase().includes(q))
  }, [options, query])

  const emitChange = (val) => {
    if (onChange) {
      onChange({ target: { name, value: val, type: 'text' } })
    }
  }

  const handleSelect = (val) => {
    emitChange(val)
    setOpen(false)
    setHighlightIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true)
      setHighlightIndex(0)
      return
    }
    if (e.key === 'ArrowDown') {
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && highlightIndex >= 0 && filtered[highlightIndex]) {
        handleSelect(filtered[highlightIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setHighlightIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="searchable-select" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        name={name}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={className}
        style={style}
        placeholder={placeholder}
        aria-expanded={open}
        aria-controls={`${name}-dropdown`}
        aria-autocomplete="list"
        required={required}
      />
      {open && (
        <ul id={`${name}-dropdown`} role="listbox" className="dropdown" style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6,
          margin: 0, padding: '6px 0', listStyle: 'none', maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          {filtered.length === 0 ? (
            <li style={{ padding: '8px 12px', color: '#64748b' }}>Tidak ada hasil</li>
          ) : (
            filtered.map((opt, idx) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                onMouseEnter={() => setHighlightIndex(idx)}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(opt) }}
                style={{
                  padding: '8px 12px', cursor: 'pointer',
                  background: idx === highlightIndex ? '#f1f5f9' : 'transparent',
                  color: '#0f172a', fontSize: 14
                }}
              >
                {opt}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default SearchableSelect