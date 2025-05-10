import { Metadata } from 'next';
import { getCompanies } from '@/company/http/getCompanies';
import { getCompany } from '@/company/http/getCompany';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { CompanyHome } from '@/pageComponents/company/CompanyHome';
import { Container } from '@/shared/layout/Container';
import { isProd } from '@/shared/environment/isProd';

type Props = {
    params: Promise<{ id: string; name: string }>;
};

const wait = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    console.log('Generating metadata for company ID:', id);

    const randomDelay = Math.floor(Math.random() * 200 + 10) * 100;
    await wait(randomDelay);

    const companyData = await getCompany(id);
    const { company } = companyData;

    return {
        title: `${company.name} open positions | Jobmeerkat`,
        description: `Discover remote job opportunities at ${company.name} with JobMeerkat! Browse open roles with public salaries and find the perfect fit for your skills. Join the Meerkat community and take the next step in your career with ${company.name} today!`,
        robots: {
            index: isProd,
            follow: isProd,
        },
    };
}

export async function generateStaticParams() {
    console.log('Generating static params for company pages');
    const companies = await getCompanies();

    return companies.map((company, index) => ({
        id: company.id,
        name: company.name,
        index,
    }));
}

const Company = async ({ params }: Props) => {
    const { id } = await params;
    console.log('Rendering company page', id);

    const randomDelay = Math.floor(Math.random() * 200 + 10) * 100;
    await wait(randomDelay);

    const companyData = await getCompany(id);
    const { company, openJobPosts } = companyData;
    const sortedJobPosts = getSortedJobPosts(openJobPosts);

    return (
        <Container>
            <CompanyHome company={company} openJobPosts={sortedJobPosts} />
        </Container>
    );
};

export default Company;
