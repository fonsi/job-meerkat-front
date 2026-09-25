import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/pageComponents/home/HomePage';
import { HOME_META } from '@/pageComponents/home/homeSeo';
import { selectHomeContent } from '@/pageComponents/home/selectHomeContent';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import {
    getCachedCategories,
    getCachedCompanies,
    getCachedJobPosts,
} from '@/shared/http/prerenderCache';

async function loadHomeData() {
    const [jobPosts, categoryTree, companies] = await Promise.all([
        getCachedJobPosts(),
        getCachedCategories(),
        getCachedCompanies(),
    ]);
    const { freshPicks, featuredCompanies } = selectHomeContent({
        jobPosts,
        companies,
    });

    return {
        categoryTree,
        freshPicks,
        featuredCompanies,
    };
}

export const Route = createFileRoute('/')({
    loader: () => loadHomeData(),
    // Static prerender: data comes from HTML; avoid client reloads refetching the API.
    staleTime: Number.POSITIVE_INFINITY,
    head: () => {
        const siteUrl = getSiteUrl().replace(/\/$/, '');
        const canonical = `${siteUrl}/`;

        return {
            meta: [
                { title: HOME_META.title },
                { name: 'description', content: HOME_META.description },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
                { property: 'og:title', content: HOME_META.title },
                {
                    property: 'og:description',
                    content: HOME_META.description,
                },
                { property: 'og:url', content: canonical },
                { property: 'og:type', content: 'website' },
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: HomeRoute,
});

function HomeRoute() {
    const { categoryTree, freshPicks, featuredCompanies } =
        Route.useLoaderData();

    return (
        <HomePage
            categoryTree={categoryTree}
            freshPicks={freshPicks}
            featuredCompanies={featuredCompanies}
        />
    );
}
