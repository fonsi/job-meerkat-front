import { createFileRoute } from '@tanstack/react-router';
import { TermsPage } from '@/pageComponents/terms/TermsPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';

export const Route = createFileRoute('/terms')({
    head: () => ({
        meta: [
            { title: 'Terms and Conditions | Jobmeerkat' },
            {
                name: 'description',
                content:
                    'Terms and conditions for using Jobmeerkat services and legal agreement details.',
            },
            {
                property: 'og:title',
                content: 'Terms and Conditions | Jobmeerkat',
            },
        ],
        links: [{ rel: 'canonical', href: `${getSiteUrl()}/terms/` }],
    }),
    component: TermsRoute,
});

function TermsRoute() {
    return <TermsPage />;
}
