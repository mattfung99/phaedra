import { Head } from 'vite-react-ssg'

interface SeoProps {
  title: string
  description?: string | null
  image?: string | null
  /** JSON-LD structured data object, serialized into a <script> tag. */
  jsonLd?: Record<string, unknown>
}

const SITE = 'Phaedra'

// Renders into <head> at build time (react-helmet-async via vite-react-ssg), so
// crawlers and social scrapers see real title/description/OG tags in the static HTML.
export function Seo({ title, description, image, jsonLd }: SeoProps) {
  const fullTitle = title === SITE ? SITE : `${title} — ${SITE}`
  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:type" content="website" />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta
        name="twitter:card"
        content={image ? 'summary_large_image' : 'summary'}
      />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Head>
  )
}
