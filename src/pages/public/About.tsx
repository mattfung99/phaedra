import { Seo } from '@/components/Seo'

export default function About() {
  return (
    <>
      <Seo title="About" description="About Phaedra." />
      <h1 className="mb-6 text-3xl font-bold tracking-tight">About</h1>
      <div className="post-content">
        <p>
          Phaedra is a personal blog. Replace this copy with a short
          introduction — who writes here and what you write about.
        </p>
      </div>
    </>
  )
}
