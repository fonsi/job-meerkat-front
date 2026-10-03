import { notFound } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { getWebCategoryBySlug } from '@/category/category';
import { getJobPostsByCategory } from '@/jobPost/getJobPostsByCategory';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { CategoryPage } from '@/pageComponents/category/CategoryPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import {
    getCachedCategories,
    getCachedJobPosts,
} from '@/shared/http/prerenderCache';
import { Container } from '@/shared/layout/Container';
import { NotFoundPage } from '@/shared/layout/NotFoundPage';
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

async function loadCategoryPageData(slug: string) {
    const [categoryTree, jobPosts] = await Promise.all([
        getCachedCategories(),
        getCachedJobPosts(),
    ]);
    const category = getWebCategoryBySlug({
        categories: categoryTree,
        slug,
    });

    if (!category) {
        return null;
    }

    const categoryJobPosts = getJobPostsByCategory({
        jobPosts,
        category: category.name,
    });

    return {
        category,
        categoryTree,
        sortedJobPosts: getSortedJobPosts(categoryJobPosts),
    };
}

export const Route = createFileRoute('/category/$slug')({
    loader: async ({ params }) => {
        const data = await loadCategoryPageData(params.slug);
        if (!data) throw notFound();

        return data;
    },
    notFoundComponent: NotFoundPage,
    staleTime: Number.POSITIVE_INFINITY,
    head: ({ loaderData, params }) => {
        if (!loaderData) {
            return {};
        }

        const title = `${loaderData.category.name} open positions | Jobmeerkat`;
        const description = `Explore top ${loaderData.category.name} jobs with JobMeerkat and discover remote opportunities with public salaries.`;
        const canonical = `${getSiteUrl()}/category/${params.slug}/`;

        return {
            meta: [
                { title },
                { name: 'description', content: description },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
                ...pageSocialMeta({ title, description, url: canonical }),
            ],
            links: [{ rel: 'canonical', href: canonical }],
        };
    },
    component: CategoryRoute,
});

function CategoryRoute() {
    const data = Route.useLoaderData();

    return (
        <Container>
            <CategoryPage
                category={data.category}
                jobPosts={data.sortedJobPosts}
                categoryTree={data.categoryTree}
            />
        </Container>
    );
}
