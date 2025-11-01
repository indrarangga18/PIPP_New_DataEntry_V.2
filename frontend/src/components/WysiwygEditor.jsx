import React, { useEffect, useRef, useState } from 'react'

// Rich WYSIWYG editor (no external deps), using contentEditable + execCommand
// Features: Source view, Bold/Italic/Underline/Strike, Sup/Sub, Lists, Indent,
// Alignment, Headings, Quote, Link, Image, Table, Clear, Undo/Redo
export default function WysiwygEditor({ value = '', onChange, placeholder = 'Tulis deskripsi...' }) {
  const editorRef = useRef(null)
  const [sourceMode, setSourceMode] = useState(false)
  const [htmlSource, setHtmlSource] = useState(value || '')
  const [linkUrl, setLinkUrl] = useState('')
  const [openLinkDialog, setOpenLinkDialog] = useState(false)
  const [textColor, setTextColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')

  useEffect(() => {
    if (sourceMode) {
      setHtmlSource(typeof value === 'string' ? value : '')
    } else if (editorRef.current && typeof value === 'string') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
  }, [value, sourceMode])

  const emitChange = () => {
    const html = editorRef.current?.innerHTML || ''
    onChange && onChange(html)
  }

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val)
    emitChange()
  }

  const toggleSource = () => {
    if (!sourceMode) {
      setHtmlSource(editorRef.current?.innerHTML || '')
    } else {
      if (editorRef.current) editorRef.current.innerHTML = htmlSource || ''
      emitChange()
    }
    setSourceMode((s) => !s)
  }

  const insertImage = () => {
    const url = window.prompt('URL Gambar:')
    if (!url) return
    exec('insertImage', url)
  }

  const insertTable = () => {
    const html = '<table style="border-collapse:collapse;width:100%"><tbody>' +
      '<tr><td style="border:1px solid #e5e7eb;padding:6px">Cell 1</td><td style="border:1px solid #e5e7eb;padding:6px">Cell 2</td></tr>' +
      '<tr><td style="border:1px solid #e5e7eb;padding:6px">Cell 3</td><td style="border:1px solid #e5e7eb;padding:6px">Cell 4</td></tr>' +
      '</tbody></table>'
    document.execCommand('insertHTML', false, html)
    emitChange()
  }

  const onCreateLink = () => {
    if (!linkUrl) { setOpenLinkDialog(false); return }
    exec('createLink', linkUrl)
    setLinkUrl('')
    setOpenLinkDialog(false)
  }

  const applyTextColor = (color) => {
    setTextColor(color)
    exec('foreColor', color)
  }

  const applyBgColor = (color) => {
    setBgColor(color)
    // hiliteColor works on most browsers; fallback to insert HTML span
    const ok = document.execCommand('hiliteColor', false, color)
    if (!ok) {
      const html = `<span style="background:${color}">${window.getSelection()?.toString() || ''}</span>`
      document.execCommand('insertHTML', false, html)
      emitChange()
    }
  }

  const findClosest = (tagName) => {
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) return null
    let node = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode
    while (node && node.nodeName && node.nodeName.toLowerCase() !== tagName.toLowerCase()) {
      node = node.parentNode
    }
    return node || null
  }

  const setElementWidth = (tag) => {
    const el = findClosest(tag)
    if (!el) { alert(`Pilih ${tag} terlebih dulu.`); return }
    const val = window.prompt(`Lebar ${tag} (mis. 500px atau 100%)`, el.style?.width || '')
    if (val === null) return
    el.style.width = val || ''
    emitChange()
  }

  const insertHr = () => {
    exec('insertHorizontalRule')
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {/* Source / Undo / Redo */}
        <button type="button" className="btn" title="Source" aria-label="Source" onClick={toggleSource}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 6h10v2H7zm0 4h10v2H7zm0 4h10v2H7z"/></svg>
        </button>
        <button type="button" className="btn" title="Undo" aria-label="Undo" onClick={() => exec('undo')}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5v3H5l4 4-4 4h7v3l9-7z"/></svg>
        </button>
        <button type="button" className="btn" title="Redo" aria-label="Redo" onClick={() => exec('redo')}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 19v-3h7l-4-4 4-4h-7V5l-9 7z"/></svg>
        </button>

        {/* Basic styles */}
        <button type="button" className="btn" title="Bold" aria-label="Bold" onClick={() => exec('bold')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 5h7a4 4 0 010 8H7zm0 6h8a4 4 0 010 8H7z"/></svg></button>
        <button type="button" className="btn" title="Italic" aria-label="Italic" onClick={() => exec('italic')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M10 5h8v3h-3l-3 8h3v3H7v-3h3l3-8h-3z"/></svg></button>
        <button type="button" className="btn" title="Underline" aria-label="Underline" onClick={() => exec('underline')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h3v6a3 3 0 006 0V4h3v6a6 6 0 11-12 0zm-1 16h14v2H5z"/></svg></button>
        <button type="button" className="btn" title="Strikethrough" aria-label="Strikethrough" onClick={() => exec('strikeThrough')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 11h16v2H4zm6-7h8v2h-5c-3 0-4 1-4 2 0 1 1 2 4 3H8c-3 0-4-1-4-3 0-2 2-4 6-4zm0 14c3 0 4-1 4-2 0-1-1-2-4-3h8c2 1 3 2 3 3 0 2-2 4-7 4H8c-4 0-6-2-6-4 0-1 1-2 3-3h5c3 1 4 2 4 3 0 1-1 2-4 3z"/></svg></button>
        <button type="button" className="btn" title="Superscript" aria-label="Superscript" onClick={() => exec('superscript')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 7h3l3 4 3-4h3l-4 5 4 5h-3l-3-4-3 4H4l4-5zM18 4h2v2h2v2h-2v2h-2V8h-2V6h2z"/></svg></button>
        <button type="button" className="btn" title="Subscript" aria-label="Subscript" onClick={() => exec('subscript')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 5h3l3 4 3-4h3l-4 5 4 5h-3l-3-4-3 4H4l4-5zM18 16h2v2h2v2h-2v2h-2v-2h-2v-2h2z"/></svg></button>

        {/* Lists / Indent */}
        <button type="button" className="btn" title="Bulleted List" aria-label="Bulleted" onClick={() => exec('insertUnorderedList')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 6h3v2H5zm0 5h3v2H5zm0 5h3v2H5zm6-10h8v2h-8zm0 5h8v2h-8zm0 5h8v2h-8z"/></svg></button>
        <button type="button" className="btn" title="Numbered List" aria-label="Numbered" onClick={() => exec('insertOrderedList')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 6h2v2H5zm0 5h2v2H5zm0 5h2v2H5zm6-10h8v2h-8zm0 5h8v2h-8zm0 5h8v2h-8z"/></svg></button>
        <button type="button" className="btn" title="Outdent" aria-label="Outdent" onClick={() => exec('outdent')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v2H3zm8 4h10v2H11zm-6 4l5-3v6zM11 16h10v2H11z"/></svg></button>
        <button type="button" className="btn" title="Indent" aria-label="Indent" onClick={() => exec('indent')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v2H3zm8 4h10v2H11zm6 4l-5-3v6zM11 16h10v2H11z"/></svg></button>

        {/* Alignment */}
        <button type="button" className="btn" title="Align Left" aria-label="Left" onClick={() => exec('justifyLeft')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/></svg></button>
        <button type="button" className="btn" title="Align Center" aria-label="Center" onClick={() => exec('justifyCenter')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z"/></svg></button>
        <button type="button" className="btn" title="Align Right" aria-label="Right" onClick={() => exec('justifyRight')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/></svg></button>
        <button type="button" className="btn" title="Justify" aria-label="Justify" onClick={() => exec('justifyFull')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/></svg></button>

        {/* Format dropdown */}
        <select className="form-select" onChange={(e) => exec('formatBlock', e.target.value)} defaultValue="">
          <option value="" disabled>Format</option>
          <option value="<p>">Paragraph</option>
          <option value="<h1>">H1</option>
          <option value="<h2>">H2</option>
          <option value="<h3>">H3</option>
          <option value="<h4>">H4</option>
          <option value="<h5>">H5</option>
          <option value="<h6>">H6</option>
        </select>

        {/* Quote / Link */}
        <button type="button" className="btn" title="Quote" aria-label="Quote" onClick={() => exec('formatBlock', '<blockquote>')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 7h5v5H9v5H4v-5h3zm10 0h5v5h-3v5h-5v-5h3z"/></svg></button>
        <button type="button" className="btn" title="Link" aria-label="Link" onClick={() => setOpenLinkDialog(true)}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M10 7h4v2h-4zm-3 5h10v2H7zm-1 5h12v2H6zM7 6l3-3h4l3 3H7z"/></svg></button>

        {/* Image / Table / HR */}
        <button type="button" className="btn" title="Image" aria-label="Image" onClick={insertImage}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 5h16v14H4zm2 2v10h12V7zm2 8l3-4 3 4H8zm7-6a2 2 0 11-4 0 2 2 0 014 0z"/></svg></button>
        <button type="button" className="btn" title="Table" aria-label="Table" onClick={insertTable}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v16H3zm2 2v3h14V6zm0 5v7h6v-7zm8 0v7h6v-7z"/></svg></button>
        <button type="button" className="btn" title="Horizontal Rule" aria-label="Horizontal Rule" onClick={insertHr}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 12h16v2H4z"/></svg></button>

        {/* Colors */}
        <label className="btn" title="Text color" aria-label="Text color" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h14v2H5zm2-4l5-12h2l5 12H7zm3-2h4l-2-6z"/></svg>
          <input type="color" value={textColor} onChange={(e) => applyTextColor(e.target.value)} style={{ width: 24, height: 18, border: 0, padding: 0 }} />
        </label>
        <label className="btn" title="Background color" aria-label="Background color" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h14v2H5zm2-4l5-12h2l5 12H7z"/></svg>
          <input type="color" value={bgColor} onChange={(e) => applyBgColor(e.target.value)} style={{ width: 24, height: 18, border: 0, padding: 0 }} />
        </label>

        {/* Size controls */}
        <button type="button" className="btn" title="Set Image Width" aria-label="Image width" onClick={() => setElementWidth('img')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 5h16v14H4zm2 2v10h12V7zm2 8l3-4 3 4H8zM6 3h12v2H6zm0 16h12v2H6z"/></svg></button>
        <button type="button" className="btn" title="Set Table Width" aria-label="Table width" onClick={() => setElementWidth('table')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h18v16H3zm2 2v3h14V6zm0 5v7h6v-7zm8 0v7h6v-7zM6 3h12v2H6zm0 16h12v2H6z"/></svg></button>

        {/* Clear */}
        <button type="button" className="btn" title="Clear formatting" aria-label="Clear" onClick={() => exec('removeFormat')}><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v2H4zm3 4h10v2H7zm0 4h6v2H7zm0 4h14v2H7z"/></svg></button>
      </div>

      {openLinkDialog && (
        <div role="dialog" aria-label="Tambah tautan" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input className="form-input" placeholder="https:// atau /path" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          <button type="button" className="btn btn-primary" onClick={onCreateLink}>Tambah</button>
          <button type="button" className="btn" onClick={() => { setOpenLinkDialog(false); setLinkUrl('') }}>Batal</button>
        </div>
      )}

      {/* Editor / Source */}
      {sourceMode ? (
        <textarea
          className="form-input"
          style={{ minHeight: 240 }}
          value={htmlSource}
          onChange={(e) => setHtmlSource(e.target.value)}
          onBlur={() => { if (editorRef.current) editorRef.current.innerHTML = htmlSource || ''; emitChange() }}
          placeholder={placeholder}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={emitChange}
          style={{ minHeight: 240, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' }}
          placeholder={placeholder}
          suppressContentEditableWarning
        />
      )}
    </div>
  )
}