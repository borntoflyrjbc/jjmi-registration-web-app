import type { Metadata, Viewport } from 'next';
import './globals.css';
import { VisitorTracker } from '@/components/VisitorTracker';

export const metadata: Metadata = {
  title: 'Jai Jagannath Mission International | Official Participant Application Form',
  description: 'Official Digital Participant Application Portal for Jai Jagannath Mission International under the spiritual guidance of Dr. Purshottam Tiwari.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#081d36',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Rozha+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf6ee] text-[#1e293b] antialiased selection:bg-[#c99738]/20 selection:text-[#081d36] min-h-screen flex flex-col font-sans">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}

