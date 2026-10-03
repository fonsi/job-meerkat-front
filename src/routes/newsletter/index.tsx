import { createFileRoute } from '@tanstack/react-router';
import { JoinNewsletterPage } from '@/pageComponents/newsletter/JoinNewsletterPage';
import { NEWSLETTER_META } from '@/pageComponents/newsletter/newsletterSeo';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

export const Route = createFileRoute('/newsletter/')({
    head: () => {
        const canonical = `${getSiteUrl().replace(/\/$/, '')}/newsletter/`;

        return {
            meta: [
                { title: NEWSLETTER_META.title },
                { name: 'description', content: NEWSLETTER_META.description },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
                ...pageSocialMeta({
                    title: NEWSLETTER_META.title,
                    description: NEWSLETTER_META.description,
                    url: canonical,
                }),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: JoinNewsletterPage,
});
