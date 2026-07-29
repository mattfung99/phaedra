import DOMPurify from 'isomorphic-dompurify'

// Isomorphic: uses the browser DOM on the client and jsdom during SSG pre-render,
// so post HTML is sanitized both when baked into static pages and on client render.
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty)
}
