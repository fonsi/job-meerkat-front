import { createFileRoute } from '@tanstack/react-router';
import { sortCompaniesByName } from '@/company/company';
import { CompaniesPage } from '@/pageComponents/company/CompaniesPage';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import { isProd } from '@/shared/environment/isProd';
import { getCachedCompanies } from '@/shared/http/prerenderCache';
import { Container } from '@/shared/layout/Container';

async function loadCompaniesData() {
    const companies = await getCachedCompanies();
    return sortCompaniesByName({ companies });
}

export const Route = createFileRoute('/companies')({
    loader: () => loadCompaniesData(),
    head: () => ({
        meta: [
            { title: 'Companies | Jobmeerkat' },
            {
                name: 'description',
                content:
                    'Explore top companies hiring for remote jobs on JobMeerkat! Browse tracked employers with public salary insights.',
            },
            {
                name: 'robots',
                content: isProd ? 'index,follow' : 'noindex,nofollow',
            },
        ],
        links: [{ rel: 'canonical', href: `${getSiteUrl()}/companies/` }],
    }),
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
