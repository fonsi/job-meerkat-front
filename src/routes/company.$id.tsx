import { notFound } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import {
    buildCompanyMetaDescription,
    buildCompanyMetaTitle,
    getCompanyJobStats,
} from '@/company/getCompanyJobStats';
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
        const stats = getCompanyJobStats(openJobPosts);
        const canonical = `${getSiteUrl()}/company/${params.id}/`;
        const title = buildCompanyMetaTitle({
            companyName: company.name,
            stats,
        });
        const description = buildCompanyMetaDescription({
            companyName: company.name,
            stats,
            companyDescription: company.description,
        });

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
