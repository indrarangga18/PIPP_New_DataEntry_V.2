// Simple HTML sanitizer with whitelist of tags and attributes
// Note: For production-grade sanitization, consider DOMPurify.

const ALLOWED_TAGS = new Set([
  'p','br','hr','span',
  'h1','h2','h3','h4','h5','h6',
  'strong','b','em','i','u','s','sub','sup','blockquote',
  'ul','ol','li',
  'a','img',
  'table','thead','tbody','tr','td','th'
])

const GLOBAL_ALLOWED_ATTRS = new Set(['class','style'])
const TAG_ALLOWED_ATTRS = {
  a: new Set(['href','title','target','rel']),
  img: new Set(['src','alt','width','height']),
  td: new Set(['colspan','rowspan','width','height']),
  th: new Set(['colspan','rowspan','width','height']),
  table: new Set(['width'])
}

const isSafeUrl = (url) => {
  try {
    const u = new URL(url, window.location.origin)
    return ['http:','https:'].includes(u.protocol) || u.origin === window.location.origin
  } catch {
    // allow relative urls
    return /^\/?[\w\-./#?=&%]+$/.test(url)
  }
}

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove scripts and style tags entirely
  doc.querySelectorAll('script, style').forEach(el => el.remove())

  const walk = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase()
      if (!ALLOWED_TAGS.has(tag)) {
        node.replaceWith(...Array.from(node.childNodes))
        return
      }

      // Clean attributes
      Array.from(node.attributes).forEach(attr => {
        const name = attr.name.toLowerCase()
        const value = attr.value
        const allowedForTag = TAG_ALLOWED_ATTRS[tag] || new Set()
        const isAllowed = allowedForTag.has(name) || GLOBAL_ALLOWED_ATTRS.has(name)
        if (!isAllowed) {
          node.removeAttribute(name)
          return
        }

        // Extra checks
        if (name.startsWith('on')) node.removeAttribute(name)
        if (name === 'href' || name === 'src') {
          if (!isSafeUrl(value)) node.removeAttribute(name)
        }
        if (name === 'style') {
          const s = sanitizeStyle(value)
          if (s) {
            node.setAttribute('style', s)
          } else {
            node.removeAttribute('style')
          }
        }
        if (name === 'target') {
          // Force safe target behavior
          node.setAttribute('rel', 'noopener noreferrer')
        }
      })
    }

    Array.from(node.childNodes).forEach(walk)
  }

  walk(doc.body)
  return doc.body.innerHTML
}
const ALLOWED_STYLE_PROPS = new Set(['font-family','font-size','text-decoration','text-align'])

function sanitizeStyle(value) {
  if (!value || typeof value !== 'string') return ''
  return value.split(';').map(part => part.trim()).filter(Boolean).map(rule => {
    const [prop, val] = rule.split(':').map(x => (x || '').trim().toLowerCase())
    if (!ALLOWED_STYLE_PROPS.has(prop)) return null
    // basic value checks
    if (prop === 'font-size' && !/^\d+(px|rem|em|%)$/.test(val)) return null
    if (prop === 'text-align' && !['left','center','right','justify'].includes(val)) return null
    if (prop === 'font-family' && /[<>]/.test(val)) return null
    if (prop === 'text-decoration' && !['underline','line-through','none'].includes(val)) return null
    return `${prop}: ${val}`
  }).filter(Boolean).join('; ')
}