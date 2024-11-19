import { getCompanies } from '@/company/http/getCompanies';
import { getCompany } from '@/company/http/getCompany';
import { CompanyHome } from '@/pages/company/CompanyHome';

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

    return <CompanyHome company={company} openJobPosts={openJobPosts} />;
}

export default Company;