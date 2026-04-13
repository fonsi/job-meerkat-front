import { notFound } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { CompanyHome } from '@/pageComponents/company/CompanyHome';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import {
    getCachedCompanyDetail,
    getCachedJobPosts,
} from '@/shared/http/prerenderCache';
import { Container } from '@/shared/layout/Container';

async function loadCompanyData(id: string) {
    const [company, jobPosts] = await Promise.all([
        getCachedCompanyDetail(id),
        getCachedJobPosts(),
    ]);

    if (!company) {
        return null;
    }

    return {
        company,
        openJobPosts: jobPosts.filter(
            (jobPost) => jobPost.company?.id === company.id,
        ),
    };
}

export const Route = createFileRoute('/company/$id')({
    loader: async ({ params }) => loadCompanyData(params.id),
    staleTime: Number.POSITIVE_INFINITY,
    head: ({ loaderData, params }) => {
        if (!loaderData) {
            return {};
        }

        return {
            meta: [
                {
                    title: `${loaderData.company.name} open positions | Jobmeerkat`,
                },
                {
                    name: 'description',
                    content: `Discover remote roles at ${loaderData.company.name} with public salaries and flexible options.`,
                },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
            ],
            links: [
                {
                    rel: 'canonical',
                    href: `${getSiteUrl()}/company/${params.id}/`,
                },
            ],
        };
    },
    component: CompanyRoute,
});

function CompanyRoute() {
    const companyData = Route.useLoaderData();
    if (!companyData) {
        throw notFound();
    }

    return (
        <Container>
            <CompanyHome
                company={companyData.company}
                openJobPosts={getSortedJobPosts(companyData.openJobPosts)}
            />
        </Container>
    );
}
