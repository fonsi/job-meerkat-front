import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPage } from '@/pageComponents/privacy/PrivacyPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

export const Route = createFileRoute('/privacy')({
    head: () => {
        const title = 'Privacy Policy | Jobmeerkat';
        const description =
            "Learn about Jobmeerkat's privacy practices, cookies, analytics, and how we protect your data.";
        const canonical = `${getSiteUrl()}/privacy/`;

        return {
            meta: [
                { title },
                { name: 'description', content: description },
                ...pageSocialMeta({ title, description, url: canonical }),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: PrivacyPage,
});
