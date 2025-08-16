// src/app/layout.tsx
import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/next"
import './globals.css';
import AppWrapper from "@/components/AppWrapper";
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: {
    default: 'CodeMod - AI Code Generator',
    template: '%s | CodeMod',
  },
  description: 'CodeMod is an AI-powered coding assistant that helps you write code faster using Google Gemini models..',
  keywords: ['AI', 'Code Generator', 'Next.js', 'React', 'Tailwind CSS', 'Gemini'],
  openGraph: {
    title: 'CodeMod - AI Code Generator',
    description: 'Create React components and HTML pages easily using the power of AI.',
    type: 'website',
    locale: 'id_ID',
   images: [
     {
       url: 'https://code-mod.vercel.app/og-image.png',
       width: 1200,
       height: 630,
       alt: 'CodeMod',
     },
   ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta name="theme-color" content="#000000"></meta>
        <meta name="author" content="DaffaDev"></meta>
        <meta name="publisher" content="Vercel"></meta>
        <meta property="appId" content="Q29kZSBNb2QgQnVpbGQgYnkgRGFmZmE="/>
        <meta property="twitter:card" content="summary_large_image"></meta>
        <meta property="twitter:site" content="@codeMod"></meta>
        <meta property="twitter:creator" content="@codeMod"></meta>
        <meta property="twitter:title" content="CodeMod"></meta>
        <meta property="twitter:description" content="CodeMod is an AI-powered coding assistant that helps you write code faster using Google Gemini models..."></meta>
        <meta property="twitter:image" content="https://code-mod.vercel.app/og-image.png"></meta>

        <meta property="og:title" content="Code Mod"></meta>
        <meta property="og:description" content="CodeMod is an AI-powered coding assistant that helps you write code faster using Google Gemini models..."></meta>
        <meta property="og:image" content="https://code-mod.vercel.app/og-image.png"></meta>
        <meta property="og:url" content="https://code-mod.vercel.app"></meta>
        <meta property="og:type" content="website"></meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
            <AppWrapper>
              {children}
            </AppWrapper>
        <Toaster />
      </body>
    </html>
  );
}