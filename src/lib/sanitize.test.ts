import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('removes <script> tags', () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).not.toContain(
      '<script',
    )
  })

  it('strips inline event handlers', () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).not.toContain(
      'onerror',
    )
  })

  it('keeps benign formatting', () => {
    expect(sanitizeHtml('<p><strong>hi</strong></p>')).toContain(
      '<strong>hi</strong>',
    )
  })
})
