import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from '@/components/theme-toogle';
import DefaultLayout from '@/components/DefaultLayout';

export const metadata: Metadata = {
  title: 'Pito Desri Pauzi - Protofolio',
  icons: "/pito-desri-pauzi.webp",
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
    url: 'https://protofolio-ashy-one.vercel.app/',
    siteName: 'Pito Desri Pauzi - Protofolio',
    images: ['https://protofolio-ashy-one.vercel.app/pito-desri-pauzi.webp'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    images: ['https://protofolio-ashy-one.vercel.app/pito-desri-pauzi.webp'],
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
    google: '7UVWLjtHfAA1ccchiarJNOFElAmh6e2a4nHTqbosAZU'
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DefaultLayout>
            {children}
          </DefaultLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}