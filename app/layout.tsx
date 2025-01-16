import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Pito Desri Pauzi - Protofolio',
  description: 'Portfolio website showcasing my work and experience as a Full Stack Developer',
  keywords: [
    'Full Stack Developer', 'Web Developer', 'Frontend', 'Backend', 'React', 'Next.js', 'Laravel', 'Node.js', 'Prisma', 'PostgreSQL', 'MySQL', 'JavaScript', 'TypeScript', 'API Development', 'Database Management', 'Version Control', 'GitHub', 'User Authentication', 'JWT'
  ],
  authors: [{
    name: 'Pito Desri Pauzi', url: 'https://github.com/PitokDf'
  }],
  openGraph: {
    title: 'Pito Desri Pauzi - Protofolio',
    description: 'Portfolio website showcasing my work and experience as a Full Stack Developer',
    url: 'https://protofolio-git-main-pitok-dfs-projects.vercel.app/',
    siteName: 'Pito Desri Pauzi - Protofolio',
    images: ['https://protofolio-git-main-pitok-dfs-projects.vercel.app/pito-desri-pauzi.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    images: ['https://protofolio-git-main-pitok-dfs-projects.vercel.app/pito-desri-pauzi.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      "max-snippet": -1
    },
  },
  verification: {
    google: 'google8156d5c26713cfcd'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}