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
    loader: async ({ params }) => loadCategoryPageData(params.slug),
    head: ({ loaderData, params }) => {
        if (!loaderData) {
            return {};
        }

        return {
            meta: [
                {
                    title: `${loaderData.category.name} open positions | Jobmeerkat`,
                },
                {
                    name: 'description',
                    content: `Explore top ${loaderData.category.name} jobs with JobMeerkat and discover remote opportunities with public salaries.`,
                },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
            ],
            links: [
                {
                    rel: 'canonical',
                    href: `${getSiteUrl()}/category/${params.slug}/`,
                },
            ],
        };
    },
    component: CategoryRoute,
});

function CategoryRoute() {
    const data = Route.useLoaderData();

    if (!data) {
        throw notFound();
    }

    return (
        <Container>
            <CategoryPage
                jobPosts={data.sortedJobPosts}
                categoryTree={data.categoryTree}
            />
        </Container>
    );
}
