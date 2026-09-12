import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Ayush Kumar Yadav | Full Stack & Mobile Developer',
  description: 'Thoughtful code. Useful things. Explore Ayush Kumar Yadav’s full-stack, mobile, and applied AI projects.',
  metadataBase: new URL('https://devtacet.me'),
  alternates: {
    canonical: '/',
  },
  keywords: ['Ayush Kumar Yadav', 'full stack developer', 'mobile developer', 'React developer', 'Next.js developer', 'applied AI', 'portfolio'],
  authors: [{ name: 'Ayush Kumar Yadav', url: 'https://devtacet.me' }],
  creator: 'Ayush Kumar Yadav',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://devtacet.me',
    title: 'Ayush Kumar Yadav | Full Stack & Mobile Developer',
    description: 'Explore Ayush Kumar Yadav’s full-stack, mobile, and applied AI projects.',
    siteName: 'Ayush Kumar Yadav',
    locale: 'en_US',
    images: [{ url: '/images/engineering-stack.png', width: 1200, height: 630, alt: 'Ayush Kumar Yadav engineering portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Kumar Yadav | Full Stack & Mobile Developer',
    description: 'Explore Ayush Kumar Yadav’s full-stack, mobile, and applied AI projects.',
    images: ['/images/engineering-stack.png'],
  },
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#090b0e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className={`${sans.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
