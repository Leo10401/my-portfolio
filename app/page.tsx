import Portfolio from '@/components/portfolio'
import { profile, projects } from '@/lib/portfolio-data'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Ayush Kumar Yadav',
      url: profile.website,
      email: `mailto:${profile.email}`,
      jobTitle: 'Full Stack & Mobile Developer',
      sameAs: [profile.github, profile.linkedin],
    },
    {
      '@type': 'WebSite',
      name: 'Ayush Kumar Yadav Portfolio',
      url: profile.website,
      description: 'Portfolio of Ayush Kumar Yadav, a full-stack, mobile, and applied AI developer.',
      author: { '@type': 'Person', name: 'Ayush Kumar Yadav' },
    },
    ...projects.map((project) => ({
      '@type': 'CreativeWork',
      name: project.name,
      description: project.description,
      url: project.live || project.github,
      author: { '@type': 'Person', name: 'Ayush Kumar Yadav' },
      keywords: project.stack.join(', '),
    })),
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Portfolio />
    </>
  )
}
