import { JobPostDetailView } from '@/jobPost/layout/JobPostDetailView';
import { buildJobPostingJsonLd } from '@/jobPost/seo/buildJobPostingJsonLd';
import {
    buildJobPostPathUrl,
    jobMetaDescription,
    jobMetaTitle,
    jobPostRobotsContent,
} from '@/jobPost/seo/jobPostPageMeta';
import { type JobPost } from '@/jobPost/http/getJobPosts';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { Footer } from '@/shared/layout/Footer';
import { Header } from '@/shared/layout/Header';
import { Main } from '@/shared/layout/Main';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';
import { Page } from '@/shared/layout/Page';
import { CRITICAL_CSS } from '@/styles/criticalCss';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const GOOGLE_ADSENSE_ACCOUNT = process.env.NEXT_PUBLIC_ADSENSE_ID || '';
const UMAMI_ID = process.env.UMAMI_ID || '';

const SSR_GLOBALS_CSS = `
a {
  color: inherit;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
`.trim();

const jsonLdScript = (jsonLd: Record<string, unknown>): string =>
    JSON.stringify(jsonLd).replace(/</g, '\\u003c');

type Props = {
    job: JobPost | null;
    slug: string | null;
};

export const JobPostSsrDocument = ({ job, slug }: Props) => {
    const site = getSiteUrl();
    const canonical =
        slug != null && slug.length > 0
            ? buildJobPostPathUrl(site, slug)
            : `${site}/jobpost`;
    const notFound = job == null;
    const description =
        job != null
            ? jobMetaDescription(job)
            : 'Explore this remote job post on Jobmeerkat with salary and workplace information.';
    const title = notFound ? 'Page not found | Jobmeerkat' : jobMetaTitle(job);
    const robots = notFound
        ? 'noindex,nofollow'
        : jobPostRobotsContent(job.closedAt != null);
    const jsonLd =
        job != null ? { ...buildJobPostingJsonLd(job), url: canonical } : null;

    return (
        <html lang="en">
            <head>
                <base href="/" />
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="robots" content={robots} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonical} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={canonical} />
                <link rel="icon" href="/logo-black.svg" type="image/svg+xml" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap"
                />
                {isProd && GOOGLE_ADSENSE_ACCOUNT ? (
                    <meta
                        name="google-adsense-account"
                        content={GOOGLE_ADSENSE_ACCOUNT}
                    />
                ) : null}
                <style
                    dangerouslySetInnerHTML={{
                        __html: `${CRITICAL_CSS}\n${SSR_GLOBALS_CSS}`,
                    }}
                />
                {jsonLd != null ? (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: jsonLdScript(jsonLd),
                        }}
                    />
                ) : null}
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
                        {job != null ? (
                            <JobPostDetailView jobPost={job} />
                        ) : (
                            <NotFoundPage />
                        )}
                    </Main>
                    <Footer />
                </Page>
            </body>
        </html>
    );
};
