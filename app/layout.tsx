import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import StyledComponentsRegistry from '@/shared/styles/registry';
import { Footer } from '@/shared/layout/Footer';
import { Header } from '@/shared/layout/Header';
import { Main } from '@/shared/layout/Main';
import { Page } from '@/shared/layout/Page';
import Script from 'next/script';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const isProd = process.env.APP_ENV === 'production';
const UMAMI_ID = process.env.UMAMI_ID;

export const metadata: Metadata = {
  title: 'Jobmeerkat',
  description: 'Don\'t miss your next job',
  robots: {
    index: isProd,
    follow: isProd,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {
          isProd && UMAMI_ID ? 
            <Script strategy='afterInteractive' src='https://cloud.umami.is/script.js' data-website-id={UMAMI_ID} /> :
            null
        }
        <StyledComponentsRegistry>
          <Page>
            <Header />
            <Main>
              {children}
            </Main>
            <Footer />
          </Page>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
