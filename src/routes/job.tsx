import { notFound } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { JobPostDetailView } from '@/jobPost/layout/JobPostDetailView';
import { getJobPostBySlug, type JobPost } from '@/jobPost/http/getJobPosts';
import { buildJobPostingJsonLd } from '@/jobPost/seo/buildJobPostingJsonLd';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { ApiRequestError } from '@/shared/http/apiRequestError';
import { Container } from '@/shared/layout/Container';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';

type JobSearch = {
    slug?: string;
};

/** `trailingSlash: 'always'` can append `/` after the query string; it may end up in `slug`. */
function normalizeSlugParam(raw: string): string {
    return raw.replace(/\/+$/, '').trim();
}

function jobMetaDescription(job: JobPost): string {
    const company = job.company?.name;
    const role = job.title;
    if (company) {
        return `${role} at ${company}. Remote job on Jobmeerkat with salary and workplace information.`;
    }
    return `${role}. Remote job on Jobmeerkat with salary and workplace information.`;
}

async function loadJobPostBySlug(slug: string) {
    try {
        return await getJobPostBySlug(slug);
    } catch (error) {
        if (error instanceof ApiRequestError && error.status === 404) {
            throw notFound();
        }
        throw error;
    }
}

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

        const canonical = `${site}/job/?slug=${encodeURIComponent(slug)}`;

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

        const title = `${job?.title ?? 'Job'} | Jobmeerkat`;
        const isClosed = job?.closedAt != null;
        const robots =
            !isProd || isClosed ? 'noindex,nofollow' : 'index,follow';

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
