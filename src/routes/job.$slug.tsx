import { notFound } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { JobPostDetailView } from '@/jobPost/layout/JobPostDetailView';
import { getJobPostBySlug } from '@/jobPost/http/getJobPosts';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { ApiRequestError } from '@/shared/http/apiRequestError';
import { Container } from '@/shared/layout/Container';

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

export const Route = createFileRoute('/job/$slug')({
    loader: async ({ params }) => loadJobPostBySlug(params.slug),
    // Show loading UI immediately (router defaults would wait ~1s before pending UI).
    pendingMs: 0,
    pendingMinMs: 0,
    pendingComponent: JobDetailPending,
    head: ({ loaderData, params }) => ({
        meta: [
            { title: `${loaderData?.title || 'Job'} | Jobmeerkat` },
            {
                name: 'description',
                content:
                    'Explore this remote job post on Jobmeerkat with salary and workplace information.',
            },
            {
                name: 'robots',
                content: isProd ? 'index,follow' : 'noindex,nofollow',
            },
        ],
        links: [
            { rel: 'canonical', href: `${getSiteUrl()}/job/${params.slug}` },
        ],
    }),
    component: JobRoute,
});

function JobRoute() {
    const jobPost = Route.useLoaderData();

    return <JobPostDetailView jobPost={jobPost} />;
}
