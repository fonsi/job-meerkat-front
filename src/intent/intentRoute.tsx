import { notFound } from '@tanstack/react-router';
import { IntentSlug } from '@/intent/intents';
import {
    IntentPageData,
    loadIntentPageData,
} from '@/intent/loadIntentPageData';
import { IntentPage } from '@/pageComponents/intent/IntentPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { Container } from '@/shared/layout/Container';
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

export const intentRouteOptions = (slug: IntentSlug) => ({
    loader: async () => loadIntentPageData(slug),
    staleTime: Number.POSITIVE_INFINITY,
    head: ({ loaderData }: { loaderData?: IntentPageData | null }) => {
        if (!loaderData) {
            return {};
        }

        const { intent, resultCount } = loaderData;
        const countHint =
            intent.kind === 'companies'
                ? `${resultCount} companies`
                : `${resultCount} open roles`;
        const description = `${intent.description} Currently ${countHint}.`;
        const canonical = `${getSiteUrl()}${intent.path}`;

        return {
            meta: [
                { title: intent.title },
                { name: 'description', content: description },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
                ...pageSocialMeta({
                    title: intent.title,
                    description: intent.description,
                    url: canonical,
                }),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
});

export const IntentRouteView = ({ data }: { data: IntentPageData | null }) => {
    if (!data) {
        throw notFound();
    }

    if (data.kind === 'companies') {
        return (
            <Container>
                <IntentPage
                    intent={data.intent}
                    kind="companies"
                    companies={data.companies}
                    resultCount={data.resultCount}
                />
            </Container>
        );
    }

    return (
        <Container>
            <IntentPage
                intent={data.intent}
                kind="jobs"
                jobPosts={data.sortedJobPosts}
                categoryTree={data.categoryTree}
                resultCount={data.resultCount}
            />
        </Container>
    );
};
