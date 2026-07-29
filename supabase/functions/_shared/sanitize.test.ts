import { assertEquals, assertStringIncludes } from 'jsr:@std/assert@1'
import { sanitizePostContent } from './sanitize.ts'

Deno.test('removes <script> tags', () => {
  const out = sanitizePostContent('<p>hi</p><script>alert(1)</script>')
  assertEquals(out.includes('<script'), false)
  assertStringIncludes(out, '<p>hi</p>')
})

Deno.test('strips inline event handlers', () => {
  const out = sanitizePostContent('<img src="x" onerror="alert(1)" />')
  assertEquals(out.includes('onerror'), false)
})

Deno.test('drops javascript: URLs', () => {
  const out = sanitizePostContent('<a href="javascript:alert(1)">x</a>')
  assertEquals(out.includes('javascript:'), false)
})

Deno.test('keeps allowed formatting and hardens links', () => {
  const out = sanitizePostContent(
    '<p><strong>bold</strong> <em>em</em></p><a href="https://example.com">link</a>',
  )
  assertStringIncludes(out, '<strong>bold</strong>')
  assertStringIncludes(out, '<em>em</em>')
  assertStringIncludes(out, 'rel="noopener noreferrer"')
})
