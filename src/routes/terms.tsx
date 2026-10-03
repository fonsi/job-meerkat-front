import { createFileRoute } from '@tanstack/react-router';
import { TermsPage } from '@/pageComponents/terms/TermsPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

export const Route = createFileRoute('/terms')({
    head: () => {
        const title = 'Terms and Conditions | Jobmeerkat';
        const description =
            'Terms and conditions for using Jobmeerkat services and legal agreement details.';
        const canonical = `${getSiteUrl()}/terms/`;

        return {
            meta: [
                { title },
                { name: 'description', content: description },
                ...pageSocialMeta({ title, description, url: canonical }),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: TermsRoute,
});

function TermsRoute() {
    return <TermsPage />;
}
