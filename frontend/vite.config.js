import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// CKEditor Vite plugin is deprecated; CKEditor v42+ works without it.

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ckeditor5({
      theme: require.resolve('@ckeditor/ckeditor5-theme-lark'),
    }),
  ],
  server: {
    port: 5172,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: [
      '@ckeditor/ckeditor5-react',
      '@ckeditor/ckeditor5-editor-classic',
      '@ckeditor/ckeditor5-essentials',
      '@ckeditor/ckeditor5-paragraph',
      '@ckeditor/ckeditor5-heading',
      '@ckeditor/ckeditor5-basic-styles',
      '@ckeditor/ckeditor5-alignment',
      '@ckeditor/ckeditor5-font',
      '@ckeditor/ckeditor5-link',
      '@ckeditor/ckeditor5-list',
      '@ckeditor/ckeditor5-indent',
      '@ckeditor/ckeditor5-table',
      '@ckeditor/ckeditor5-image',
      '@ckeditor/ckeditor5-horizontal-line',
      '@ckeditor/ckeditor5-remove-format',
      '@ckeditor/ckeditor5-style',
      '@ckeditor/ckeditor5-html-support',
      '@ckeditor/ckeditor5-theme-lark'
    ]
  }
})
