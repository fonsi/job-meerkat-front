import { getCompanies } from '@/company/http/getCompanies';
import { getCompany } from '@/company/http/getCompany';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { JobPostRow } from '@/jobPost/layout/JobPostRow';

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

    return <div>
        <p>{company.name}</p>
        <JobPostsList>
        {
            openJobPosts.map(jobPost =>
                <JobPostRow key={jobPost.id} jobPost={jobPost} />
            )
        }
        </JobPostsList>
    </div>;
}

export default Company;