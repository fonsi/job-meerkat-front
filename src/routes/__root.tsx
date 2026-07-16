import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
} from '@tanstack/react-router';
import { NewsletterPopup } from '@/newsletter/layout/NewsletterPopup';
import { Footer } from '@/shared/layout/Footer';
import { Header } from '@/shared/layout/Header';
import { Main } from '@/shared/layout/Main';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';
import { Page } from '@/shared/layout/Page';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import '@/styles/globals.css';
import { CRITICAL_CSS } from '@/styles/criticalCss';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const GOOGLE_ADSENSE_ACCOUNT = process.env.NEXT_PUBLIC_ADSENSE_ID || '';
const UMAMI_ID = process.env.UMAMI_ID || '';

export const Route = createRootRoute({
    notFoundComponent: NotFoundPage,
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            { title: 'Jobmeerkat' },
            {
                name: 'description',
                content:
                    'Find the best remote jobs with JobMeerkat! Discover handpicked opportunities with public salaries, flexible work options, and your next career move.',
            },
            ...(isProd
                ? [
                      {
                          name: 'google-adsense-account',
                          content: GOOGLE_ADSENSE_ACCOUNT,
                      },
                  ]
                : []),
        ],
        links: [
            {
                rel: 'icon',
                href: '/logo-black.svg',
                type: 'image/svg+xml',
            },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossOrigin: 'anonymous',
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
            },
            { rel: 'canonical', href: getSiteUrl() },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
    return (
        <html lang="en">
            <head>
                <base href="/" />
                <style
                    dangerouslySetInnerHTML={{
                        __html: CRITICAL_CSS,
                    }}
                />
                <HeadContent />
                {isProd && GA_MEASUREMENT_ID ? (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                        />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
                            }}
                        />
                    </>
                ) : null}
                {isProd && UMAMI_ID ? (
                    <script
                        async
                        src="https://cloud.umami.is/script.js"
                        data-website-id={UMAMI_ID}
                    />
                ) : null}
            </head>
            <body>
                <Page>
                    <Header />
                    <Main>
                        <Outlet />
                    </Main>
                    <Footer />
                    <NewsletterPopup />
                </Page>
                <Scripts />
            </body>
        </html>
    );
}
