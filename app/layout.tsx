import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import StyledComponentsRegistry from '@/shared/styles/registry';
import { Footer } from '@/shared/layout/Footer';
import { Header } from '@/shared/layout/Header';
import { Main } from '@/shared/layout/Main';
import { Page } from '@/shared/layout/Page';
import { delaGothicOne } from '@/shared/font/constants';
import { isProd } from '@/shared/environment/isProd';

const UMAMI_ID = process.env.UMAMI_ID;

export const metadata: Metadata = {
    title: 'Jobmeerkat',
    description:
        'Find the best remote jobs with JobMeerkat! Discover handpicked opportunities with public salaries, flexible work options, and your next career move—all in one place. Join the Meerkat community and land your dream job today!',
    robots: {
        index: isProd,
        follow: isProd,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${delaGothicOne.variable}`}>
                {isProd && UMAMI_ID ? (
                    <Script
                        strategy="afterInteractive"
                        src="https://cloud.umami.is/script.js"
                        data-website-id={UMAMI_ID}
                    />
                ) : null}
                <StyledComponentsRegistry>
                    <Page>
                        <Header />
                        <Main>{children}</Main>
                        <Footer />
                    </Page>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
