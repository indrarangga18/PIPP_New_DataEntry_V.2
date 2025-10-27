import React from 'react'

// Standard form header with title, description, right slot (e.g., pelabuhan), and optional selected info block
const FormHeader = ({
  title,
  description,
  rightSlot = null,
  selectedLabel = null,
  selectedValue = null,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </div>
        {rightSlot && (
          <div style={{ minWidth: 250 }}>
            {rightSlot}
          </div>
        )}
      </div>
      {selectedLabel && selectedValue && (
        <div style={{ marginBottom: 20, padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>{selectedLabel}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{selectedValue}</div>
        </div>
      )}
    </div>
  )
}

export default FormHeader