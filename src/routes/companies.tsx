import { createFileRoute } from '@tanstack/react-router';
import { sortCompaniesByName } from '@/company/company';
import { CompaniesPage } from '@/pageComponents/company/CompaniesPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { getCachedCompanies } from '@/shared/http/prerenderCache';
import { Container } from '@/shared/layout/Container';
import { pageSocialMeta } from '@/shared/seo/pageSocialMeta';

async function loadCompaniesData() {
    const companies = await getCachedCompanies();
    return sortCompaniesByName({ companies });
}

export const Route = createFileRoute('/companies')({
    loader: () => loadCompaniesData(),
    staleTime: Number.POSITIVE_INFINITY,
    head: () => {
        const title = 'Companies | Jobmeerkat';
        const description =
            'Explore top companies hiring for remote jobs on JobMeerkat! Browse tracked employers with public salary insights.';
        const canonical = `${getSiteUrl()}/companies/`;

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
    component: CompaniesRoute,
});

function CompaniesRoute() {
    const companies = Route.useLoaderData();

    return (
        <Container>
            <CompaniesPage companies={companies} />
        </Container>
    );
}
