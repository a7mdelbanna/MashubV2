import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MasHub - All-in-One Business OS for Software Houses',
  description: 'Complete business management platform for software development companies. Manage projects, finance, CRM, HR, and more in one unified system.',
  keywords: 'business management, software house, project management, CRM, HR, finance',
  authors: [{ name: 'MasHub' }],
  openGraph: {
    title: 'MasHub - All-in-One Business OS for Software Houses',
    description: 'Complete business management platform for software development companies',
    url: 'https://mashub.io',
    siteName: 'MasHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}