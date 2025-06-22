import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mentrix App',
  description: 'Created with v0',
  generator: 'dev',
  icons: {
    icon: '/logo3_nobg.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
