import { Seo } from '@/components/Seo'

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Get in touch." />
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Contact</h1>
      <div className="post-content">
        <p>
          Reach out at <a href="mailto:hello@example.com">hello@example.com</a>.
          Replace with your preferred contact details.
        </p>
      </div>
    </>
  )
}
