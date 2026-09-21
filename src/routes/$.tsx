import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';

export const Route = createFileRoute('/$')({
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
    }),
    component: NotFoundPage,
});
