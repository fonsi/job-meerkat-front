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

        const { company, openJobPosts } = loaderData;
        const openCount = openJobPosts.filter(
            (job) => job.closedAt == null,
        ).length;
        const canonical = `${getSiteUrl()}/company/${params.id}/`;
        const title = `${company.name} open positions | Jobmeerkat`;
        const description =
            openCount > 0
                ? `Explore ${openCount} remote role${openCount === 1 ? '' : 's'} at ${company.name} with public salaries on Jobmeerkat.`
                : `Discover remote roles at ${company.name} with public salaries and flexible options.`;

        return {
            meta: [
                { title },
                { name: 'description', content: description },
                {
                    name: 'robots',
                    content: isProd ? 'index,follow' : 'noindex,nofollow',
                },
                { property: 'og:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:url', content: canonical },
                { property: 'og:type', content: 'website' },
            ],
            links: [{ rel: 'canonical', href: canonical }],
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
