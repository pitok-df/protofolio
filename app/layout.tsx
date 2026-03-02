import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/auth/session-provider";

export const metadata: Metadata = {
  title: 'Pito Desri Pauzi - Portfolio',
  icons: "/pito-desri-pauzi.webp",
  description: 'Explore the portfolio of Full Stack Developer Pito Desri Pauzi, showcasing expertise in React, Node.js, Laravel, and more.',
  keywords: [
    'Full Stack Developer', 'Pengembang Web', 'Frontend Developer', 'Backend Developer',
    'React', 'Next.js', 'Laravel', 'Node.js', 'Prisma', 'PostgreSQL', 'TypeScript',
    'Portofolio Developer Padang', 'Programmer Padang', 'Politeknik Negeri Padang'
  ],
  authors: [{ name: 'Pito Desri Pauzi', url: 'https://github.com/PitokDf' }],
  openGraph: {
    title: 'Pito Desri Pauzi - Portfolio',
    description: 'Full Stack Developer Portfolio — React, Node.js, Laravel, and more.',
    url: 'https://pitok.my.id',
    siteName: 'Pito Desri Pauzi',
    images: ['https://pitok.my.id/pito-desri-pauzi.webp'],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    images: ['https://pitok.my.id/pito-desri-pauzi.webp'],
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}