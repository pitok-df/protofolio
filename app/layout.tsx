import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from '@/components/theme-toogle';
import DefaultLayout from '@/components/DefaultLayout';

export const metadata: Metadata = {
  title: 'Pito Desri Pauzi - Protofolio',
  icons: "/pito-desri-pauzi.webp",
  description: 'Website portofolio Pito Desri Pauzi yang menampilkan berbagai karya, pengalaman, dan keahlian sebagai Full Stack Developer di bidang frontend dan backend, menggunakan teknologi seperti React, Next.js, Laravel, Node.js, dan TypeScript.',
  keywords: [
    'Full Stack Developer',
    'Pengembang Web',
    'Frontend Developer',
    'Backend Developer',
    'React',
    'Next.js',
    'Laravel',
    'Node.js',
    'Prisma',
    'PostgreSQL',
    'MySQL',
    'JavaScript',
    'TypeScript',
    'Pengembangan API',
    'Manajemen Database',
    'Kontrol Versi',
    'GitHub',
    'Autentikasi Pengguna',
    'JWT',
    'Portofolio Web',
    'Pengembang Aplikasi',
    'Pengembang Website',
    'Pengembang Web Indonesia',
    'Full Stack Developer Indonesia',
    'Portofolio Developer Padang',
    'Programmer Padang',
    'Politeknik Negeri Padang'
  ],
  authors: [{
    name: 'Pito Desri Pauzi', url: 'https://github.com/PitokDf'
  }],
  openGraph: {
    title: 'Pito Desri Pauzi - Protofolio',
    description: 'Website portofolio Pito Desri Pauzi yang menampilkan berbagai karya, pengalaman, dan keahlian sebagai Full Stack Developer di bidang frontend dan backend, menggunakan teknologi seperti React, Next.js, Laravel, Node.js, dan TypeScript.',
    url: 'https://pitok.my.id',
    siteName: 'Pito Desri Pauzi - Protofolio',
    images: ['https://pitok.my.id/pito-desri-pauzi.webp'],
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    images: ['https://pitok.my.id/pito-desri-pauzi.webp'],
    card: 'summary_large_image'
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
    google: 'rn_Z6X4jvzUYXSQnplIA0HNo3mL6MhuDcpnbxwYeRgw'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Pito Desri Pauzi",
                "url": "https://pitok.my.id",
                "image": "https://pitok.my.id/pito-desri-pauzi.webp",
                "sameAs": [
                  "https://www.linkedin.com/in/pito-desri-pauzi-181052314",
                  "https://github.com/PitokDf"
                ],
                "jobTitle": "Fullstack Web Developer",
                "worksFor": {
                  "@type": "EducationalOrganization",
                  "name": "Politeknik Negeri Padang"
                },
                "alumniOf": {
                  "@type": "CollegeOrUniversity",
                  "name": "Politeknik Negeri Padang"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Padang",
                  "addressRegion": "Sumatera Barat",
                  "addressCountry": "ID"
                },
                "description": "Mahasiswa Politeknik Negeri Padang dengan minat besar di dunia full-stack development. Berpengalaman dalam pengembangan sistem backend dan frontend."
              })
            }}
          ></script>
          <DefaultLayout>
            {children}
          </DefaultLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}