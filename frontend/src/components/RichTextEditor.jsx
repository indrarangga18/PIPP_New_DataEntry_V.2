import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import '../styles/ckeditor.css'
import CustomEditor from '../ckeditor/CustomEditor'

// CKEditor-based rich text editor, common UI and behavior
// Props: value (HTML), onChange(html), placeholder
export default function RichTextEditor({ value = '', onChange, placeholder = 'Tulis deskripsi...' }) {
  return (
      <CKEditor
        editor={CustomEditor}
        data={value || ''}
        config={{
          licenseKey: 'GPL',
          placeholder,
          toolbar: [
            'undo', 'redo', '|',
            'heading', '|',
            'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
            'fontFamily', 'fontSize', '|',
            'bulletedList', 'numberedList', 'outdent', 'indent', '|',
            'alignment', '|',
            'link', 'insertTable', 'imageUpload', 'horizontalLine', '|',
            'removeFormat'
          ],
          alignment: {
            options: [ 'left', 'center', 'right', 'justify' ]
          },
          table: {
            contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
          }
        }}
        onReady={(editor) => {
          // Custom upload adapter to send images to backend API
          class UploadAdapter {
            constructor(loader) {
              this.loader = loader
            }
            async upload() {
              const file = await this.loader.file
              const data = new FormData()
              data.append('file', file)
              const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: data,
              })
              if (!res.ok) {
                const text = await res.text()
                throw new Error(text || 'Upload failed')
              }
              const json = await res.json()
              // CKEditor expects an object with `default` URL
              return { default: json.url }
            }
            abort() {}
          }
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new UploadAdapter(loader)
        }}
        onChange={(event, editor) => {
          try {
            const data = editor.getData() || ''
            if (onChange) onChange(data)
          } catch {}
        }}
      />
  )
}