import React, { useEffect, useMemo, useState } from 'react'
import SearchableSelect from './SearchableSelect'
import { getOptions } from '../utils/optionsStore'

// SmartSelect: wraps SearchableSelect, adds a 'Lainnya' option and inline input to add new values
// Props: name, value, onChange, category, baseOptions, placeholder, className, style, required
const SmartSelect = ({
  name,
  value,
  onChange,
  category,
  baseOptions = [],
  placeholder = 'Pilih...',
  className = 'form-select',
  style,
  required = false,
}) => {
  const [options, setOptions] = useState(() => getOptions(category, baseOptions))

  useEffect(() => {
    setOptions(getOptions(category, baseOptions))
  }, [category, baseOptions])

  const computedOptions = useMemo(() => {
    return Array.from(new Set([...(options || [])]))
  }, [options])

  const handleFieldChange = (e) => {
    const { value: val } = e.target
    if (onChange) onChange({ target: { name, value: val, type: 'text' } })
  }

  return (
    <SearchableSelect
      name={name}
      value={value}
      onChange={handleFieldChange}
      options={computedOptions}
      placeholder={placeholder}
      className={className}
      style={style}
      required={required}
    />
  )
}

export default SmartSelect