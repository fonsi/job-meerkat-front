import { createFileRoute } from '@tanstack/react-router';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { HomePage } from '@/pageComponents/home/HomePage';
import { Container } from '@/shared/layout/Container';
import {
    getCachedCategories,
    getCachedCompanies,
    getCachedJobPosts,
} from '@/shared/http/prerenderCache';

async function loadHomeData() {
    void getCachedCompanies();

    const [jobPosts, categoryTree] = await Promise.all([
        getCachedJobPosts(),
        getCachedCategories(),
    ]);

    return {
        sortedJobPosts: getSortedJobPosts(jobPosts),
        categoryTree,
    };
}

export const Route = createFileRoute('/')({
    loader: () => loadHomeData(),
    // Static prerender: data comes from HTML; avoid client reloads refetching the API.
    staleTime: Number.POSITIVE_INFINITY,
    component: HomeRoute,
});

function HomeRoute() {
    const { sortedJobPosts, categoryTree } = Route.useLoaderData();

    return (
        <Container>
            <HomePage jobPosts={sortedJobPosts} categoryTree={categoryTree} />
        </Container>
    );
}
