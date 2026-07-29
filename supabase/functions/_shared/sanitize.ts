import sanitizeHtml from 'npm:sanitize-html@2'

// Server-side allowlist for TipTap-authored post HTML. Extracted here so it can be
// unit-tested (see sanitize.test.ts) independently of the request handler.
export const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'strong',
    'b',
    'em',
    'i',
    's',
    'u',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    code: ['class'],
    pre: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    // Harden outbound links.
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
}

export function sanitizePostContent(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS)
}
