import { sortCompaniesByName } from '@/company/company';
import { getCompanies } from '@/company/http/getCompanies';
import { CompaniesPage } from '@/pageComponents/company/CompaniesPage';
import { CompanyHome } from '@/pageComponents/company/CompanyHome';
import { Container } from '@/shared/layout/Container';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = ((await parent) || {}) as Metadata;

    return {
        ...parentMetadata,
        title: `Companies | Jobmeerkat`,
        description: `List of remote companies with public salaries. Find here the next step in your career.`,
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
