import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';

export const Route = createFileRoute('/404')({
    head: () => ({
        meta: [
            { title: 'Page not found | Jobmeerkat' },
            {
                name: 'description',
                content:
                    'This page does not exist or may have been removed. Return to Jobmeerkat to find remote jobs.',
            },
            { name: 'robots', content: 'noindex,nofollow' },
        ],
        links: [{ rel: 'canonical', href: `${getSiteUrl()}/404/` }],
    }),
    component: NotFoundPage,
});
