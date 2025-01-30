import { sortCompaniesByName } from '@/company/company';
import { getCompanies } from '@/company/http/getCompanies';
import { CompaniesPage } from '@/pageComponents/company/CompaniesPage';
import { Container } from '@/shared/layout/Container';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    {},
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = ((await parent) || {}) as Metadata;

    return {
        ...parentMetadata,
        title: 'Companies | Jobmeerkat',
        description:
            'Explore top companies hiring for remote jobs on JobMeerkat! Browse a growing list of tracked employers with public salary insights and find your next career move. Join the Meerkat community and discover your perfect workplace today!',
    };
}

const Companies = async () => {
    const companies = await getCompanies({ countJobPosts: true });
    const sortedCompanies = sortCompaniesByName({ companies });

    return (
        <Container>
            <CompaniesPage companies={sortedCompanies} />
        </Container>
    );
};

export default Companies;
