import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPage } from '@/pageComponents/privacy/PrivacyPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';

export const Route = createFileRoute('/privacy')({
    head: () => ({
        meta: [
            { title: 'Privacy Policy | Jobmeerkat' },
            {
                name: 'description',
                content:
                    "Learn about Jobmeerkat's privacy practices, cookies, analytics, and how we protect your data.",
            },
            { property: 'og:title', content: 'Privacy Policy | Jobmeerkat' },
        ],
        links: [{ rel: 'canonical', href: `${getSiteUrl()}/privacy/` }],
    }),
    component: PrivacyPage,
});
