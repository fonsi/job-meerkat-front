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
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

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
                ...pageSocialMeta({
                    title: HOME_META.title,
                    description: HOME_META.description,
                    url: canonical,
                }),
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
