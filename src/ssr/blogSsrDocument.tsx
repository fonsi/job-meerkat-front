import { BlogIndexView } from '@/blog/layout/BlogIndexView';
import { BlogPostView } from '@/blog/layout/BlogPostView';
import { type BlogPost } from '@/blog/domain/blogPost';
import { type PaginatedBlogIndex } from '@/blog/domain/paginateBlogIndex';
import { blogIndexPath } from '@/blog/domain/paginateBlogIndex';
import { buildNewsletterInlineSubscribeSsrScript } from '@/newsletter/layout/newsletterInlineSubscribeSsrScript';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import {
    BLOG_OG_IMAGE_URL,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_WIDTH,
} from '@/shared/seo/ogImage';
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

type IndexProps = {
    kind: 'index';
    page: PaginatedBlogIndex;
};

type PostProps = {
    kind: 'post';
    post: BlogPost | null;
    slug: string | null;
};

type Props = IndexProps | PostProps;

export const BlogSsrDocument = (props: Props) => {
    const site = getSiteUrl().replace(/\/$/, '');
    const notFound = props.kind === 'post' && props.post == null;
    const title =
        props.kind === 'index'
            ? 'Jobmeerkat Blog | Remote job market from live listings'
            : notFound
              ? 'Page not found | Jobmeerkat'
              : `${props.post?.title} | Jobmeerkat Blog`;
    const description =
        props.kind === 'index'
            ? 'Monthly recaps and category analyses of remote jobs with public salaries, based on live Jobmeerkat listings.'
            : (props.post?.excerpt ??
              'Read this Jobmeerkat blog post about remote jobs with public salaries.');
    const canonical =
        props.kind === 'index'
            ? `${site}${blogIndexPath(props.page.page)}`
            : props.slug
              ? `${site}/blog/${encodeURIComponent(props.slug)}`
              : `${site}/blog`;
    const ogImage =
        props.kind === 'post' && props.post?.ogImageUrl
            ? props.post.ogImageUrl
            : BLOG_OG_IMAGE_URL;
    const robots = notFound
        ? 'noindex,nofollow'
        : isProd
          ? 'index,follow'
          : 'noindex,nofollow';
    const jsonLd =
        props.kind === 'post' && props.post
            ? {
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: props.post.title,
                  description: props.post.excerpt,
                  datePublished: props.post.publishedAt,
                  image: ogImage,
                  url: canonical,
              }
            : null;

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
                <meta
                    property="og:type"
                    content={props.kind === 'post' ? 'article' : 'website'}
                />
                <meta property="og:site_name" content="Jobmeerkat" />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
                <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:alt" content={title} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />
                <link rel="canonical" href={canonical} />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

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
                        {props.kind === 'index' ? (
                            <BlogIndexView page={props.page} />
                        ) : props.post != null ? (
                            <BlogPostView post={props.post} />
                        ) : (
                            <NotFoundPage />
                        )}
                    </Main>
                    <Footer />
                </Page>
                {props.kind === 'post' &&
                props.post != null &&
                process.env.NEXT_PUBLIC_API_ENDPOINT ? (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: buildNewsletterInlineSubscribeSsrScript(
                                process.env.NEXT_PUBLIC_API_ENDPOINT,
                            ),
                        }}
                    />
                ) : null}
            </body>
        </html>
    );
};
