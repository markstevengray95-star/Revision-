import Script from 'next/script';
import '../../shared/revision-shell.css';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en" style={{colorScheme:'dark'}}>
    <body className="revision-marking">
      {children}
      <Script src="/shared/revision-supabase.js" strategy="afterInteractive" />
      <Script src="/shared/spark-access.js" strategy="afterInteractive" />
    </body>
  </html>;
}
