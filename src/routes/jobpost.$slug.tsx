import { createFileRoute, notFound } from '@tanstack/react-router';
import { JobPostDetailView } from '@/jobPost/layout/JobPostDetailView';
import { loadJobPostBySlug } from '@/jobPost/loadJobPostBySlug';
import { buildJobPostingJsonLd } from '@/jobPost/seo/buildJobPostingJsonLd';
import {
    buildJobPostPathUrl,
    JOB_POST_OG_IMAGE_HEIGHT,
    JOB_POST_OG_IMAGE_WIDTH,
    jobMetaDescription,
    jobMetaTitle,
    jobPostOgImageUrl,
    jobPostRobotsContent,
    normalizeSlugParam,
} from '@/jobPost/seo/jobPostPageMeta';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { Container } from '@/shared/layout/Container';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';

function JobDetailPending() {
    return (
        <Container>
            <p role="status" aria-live="polite">
                Loading job…
            </p>
        </Container>
    );
}

export const Route = createFileRoute('/jobpost/$slug')({
    loader: async ({ params }) => {
        const slug = normalizeSlugParam(params.slug);
        if (!slug) throw notFound();

        return loadJobPostBySlug(slug);
    },
    pendingMs: 0,
    pendingMinMs: 0,
    pendingComponent: JobDetailPending,
    notFoundComponent: NotFoundPage,
    head: ({ loaderData, params }) => {
        const site = getSiteUrl();
        const slug = normalizeSlugParam(params.slug);
        const canonical = buildJobPostPathUrl(site, slug);
        const job = loaderData;
        const description =
            job != null
                ? jobMetaDescription(job)
                : 'Explore this remote job post on Jobmeerkat with salary and workplace information.';
        const title = job != null ? jobMetaTitle(job) : 'Job | Jobmeerkat';
        const robots = jobPostRobotsContent(job?.closedAt != null);
        const ogImage = job != null ? jobPostOgImageUrl(job) : null;

        return {
            meta: [
                { title },
                { name: 'description', content: description },
                { name: 'robots', content: robots },
                { property: 'og:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:url', content: canonical },
                { property: 'og:type', content: 'website' },
                ...(ogImage != null
                    ? [
                          { property: 'og:image', content: ogImage },
                          {
                              property: 'og:image:width',
                              content: String(JOB_POST_OG_IMAGE_WIDTH),
                          },
                          {
                              property: 'og:image:height',
                              content: String(JOB_POST_OG_IMAGE_HEIGHT),
                          },
                          { property: 'og:image:type', content: 'image/png' },
                          { property: 'og:image:alt', content: title },
                      ]
                    : []),
                ...(job != null
                    ? [
                          {
                              'script:ld+json': {
                                  ...buildJobPostingJsonLd(job),
                                  url: canonical,
                              },
                          },
                      ]
                    : []),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: JobPostRoute,
});

function JobPostRoute() {
    const jobPost = Route.useLoaderData();

    return <JobPostDetailView jobPost={jobPost} />;
}
