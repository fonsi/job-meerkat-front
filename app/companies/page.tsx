import { sortCompaniesByName } from '@/company/company';
import { getCompanies } from '@/company/http/getCompanies';
import { CompaniesPage } from '@/pageComponents/company/CompaniesPage';
import { Container } from '@/shared/layout/Container';
import { Metadata } from 'next';
import { isProd } from '@/shared/environment/isProd';

export async function generateMetadata(): Promise<Metadata> {
    console.log('Generating metadata for companies page');

    return {
        title: 'Companies | Jobmeerkat',
        description:
            'Explore top companies hiring for remote jobs on JobMeerkat! Browse a growing list of tracked employers with public salary insights and find your next career move. Join the Meerkat community and discover your perfect workplace today!',
        robots: {
            index: isProd,
            follow: isProd,
        },
    };
}

const Companies = async () => {
    console.log('Rendering companies page');
    const companies = await getCompanies({ countJobPosts: true });
    const sortedCompanies = sortCompaniesByName({ companies });

    return (
        <Container>
            <CompaniesPage companies={sortedCompanies} />
        </Container>
    );
};

export default Companies;
