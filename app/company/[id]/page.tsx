import { getCompanies } from '@/company/http/getCompanies';
import { getCompany } from '@/company/http/getCompany';
import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { CompanyHome } from '@/pageComponents/company/CompanyHome';
import { Container } from '@/shared/layout/Container';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: Promise<{ id: string }>
  }

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const companyData = await getCompany(id);
    const { company } = companyData;

    const parentMetadata = (await parent || {}) as Metadata;

    return {
        ...parentMetadata,
        title: `${company.name} open positions | Jobmeerkat`,
        description: `Explore open positions at ${company.name}. Find here the next step in your career.`,
    }
}

export async function generateStaticParams() {
    const companies = await getCompanies();

    return companies.map((company) => ({
        id: company.id,
    }))
}

const Company = async ({ params }: Props) => {
    const { id } = await params;
    const companyData = await getCompany(id);
    const { company, openJobPosts } = companyData;
    const sortedJobPosts = getSortedJobPosts(openJobPosts);

    return <Container>
        <CompanyHome company={company} openJobPosts={sortedJobPosts} />
    </Container>
}

export default Company;