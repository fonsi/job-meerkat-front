import { getCompanies } from '@/company/http/getCompanies';
import { getCompany } from '@/company/http/getCompany';
import { CompanyHome } from '@/pageComponents/company/CompanyHome';
import { Container } from '@/shared/layout/Container';

export async function generateStaticParams() {
    const companies = await getCompanies();

    return companies.map((company) => ({
        id: company.id,
    }))
}

const Company = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;
    const companyData = await getCompany(id);
    const { company, openJobPosts } = companyData;

    return <Container>
        <CompanyHome company={company} openJobPosts={openJobPosts} />
    </Container>
}

export default Company;