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

        return {
            meta: [
                { title: intent.title },
                {
                    name: 'description',
                    content: `${intent.description} Currently ${countHint}.`,
                },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
                { property: 'og:title', content: intent.title },
                {
                    property: 'og:description',
                    content: intent.description,
                },
                {
                    property: 'og:url',
                    content: `${getSiteUrl()}${intent.path}`,
                },
                { property: 'og:type', content: 'website' },
            ],
            links: [
                {
                    rel: 'canonical',
                    href: `${getSiteUrl()}${intent.path}`,
                },
            ],
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
