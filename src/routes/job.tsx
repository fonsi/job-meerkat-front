import { createFileRoute } from '@tanstack/react-router';
import { JobPostDetailView } from '@/jobPost/layout/JobPostDetailView';
import { loadJobPostBySlug } from '@/jobPost/loadJobPostBySlug';
import { buildJobPostingJsonLd } from '@/jobPost/seo/buildJobPostingJsonLd';
import {
    buildJobPostSearchUrl,
    jobMetaDescription,
    jobMetaTitle,
    jobPostRobotsContent,
    normalizeSlugParam,
} from '@/jobPost/seo/jobPostPageMeta';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { Container } from '@/shared/layout/Container';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';

type JobSearch = {
    slug?: string;
};

function JobDetailPending() {
    return (
        <Container>
            <p role="status" aria-live="polite">
                Loading job…
            </p>
        </Container>
    );
}

export const Route = createFileRoute('/job')({
    validateSearch: (search: Record<string, unknown>): JobSearch => {
        const raw = search.slug;
        if (typeof raw !== 'string' || raw.length === 0) {
            return { slug: undefined };
        }
        const slug = normalizeSlugParam(raw);
        return { slug: slug.length > 0 ? slug : undefined };
    },
    // Re-key the loader when `slug` changes so loaderData/head stay in sync on client navigations
    // between `/job?slug=a` and `/job?slug=b` (same route id, different search).
    loaderDeps: ({ search }) => ({
        slug: (search as JobSearch).slug,
    }),
    loader: async ({ deps }) => {
        const slug = deps.slug;
        if (!slug) {
            return null;
        }
        return loadJobPostBySlug(slug);
    },
    pendingMs: 0,
    pendingMinMs: 0,
    pendingComponent: JobDetailPending,
    head: ({ loaderData, match }) => {
        const site = getSiteUrl();
        const slug = (match.search as JobSearch | undefined)?.slug;
        if (!slug) {
            return {
                meta: [
                    { title: 'Job | Jobmeerkat' },
                    {
                        name: 'description',
                        content:
                            'Explore remote job posts on Jobmeerkat with salary and workplace information.',
                    },
                    {
                        name: 'robots',
                        content: isProd ? 'index,follow' : 'noindex,nofollow',
                    },
                ],
                links: [{ rel: 'canonical', href: `${site}/job/` }],
            };
        }

        const canonical = buildJobPostSearchUrl(site, slug);

        // Only use loaderData when it matches this URL — avoids stale title/description after
        // navigating between jobs on the same `/job` route.
        const job =
            loaderData != null && loaderData.slug === slug
                ? loaderData
                : undefined;

        const description =
            job != null
                ? jobMetaDescription(job)
                : 'Explore this remote job post on Jobmeerkat with salary and workplace information.';

        const title = job != null ? jobMetaTitle(job) : 'Job | Jobmeerkat';
        const robots = jobPostRobotsContent(job?.closedAt != null);

        return {
            meta: [
                { title },
                { name: 'description', content: description },
                { name: 'robots', content: robots },
                { property: 'og:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:url', content: canonical },
                { property: 'og:type', content: 'website' },
                ...(job != null
                    ? [{ 'script:ld+json': buildJobPostingJsonLd(job) }]
                    : []),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: JobRoute,
});

function JobRoute() {
    const jobPost = Route.useLoaderData();

    if (jobPost === null) {
        return <NotFoundPage />;
    }

    return <JobPostDetailView jobPost={jobPost} />;
}
