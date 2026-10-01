import { createFileRoute, redirect } from '@tanstack/react-router';
import {
    buildJobPostPath,
    normalizeSlugParam,
} from '@/jobPost/seo/jobPostPageMeta';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';

type JobSearch = {
    slug?: string;
};

export const Route = createFileRoute('/job')({
    validateSearch: (search: Record<string, unknown>): JobSearch => {
        const raw = search.slug;
        if (typeof raw !== 'string' || raw.length === 0) {
            return { slug: undefined };
        }
        const slug = normalizeSlugParam(raw);
        return { slug: slug.length > 0 ? slug : undefined };
    },
    loaderDeps: ({ search }) => ({
        slug: (search as JobSearch).slug,
    }),
    loader: ({ deps }) => {
        if (!deps.slug) return null;

        throw redirect({
            href: buildJobPostPath(deps.slug),
            reloadDocument: true,
            statusCode: 301,
        });
    },
    head: () => {
        const site = getSiteUrl();

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
    },
    component: NotFoundPage,
});
