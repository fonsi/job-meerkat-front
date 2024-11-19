import { JobPost } from '@/jobPost/http/getJobPosts';
import { apiRequest } from '@/shared/http/apiRequest';
import { Company } from '../company';

type CompanyResponse = {
    company: Company;
    openJobPosts: JobPost[]
}

export const getCompany = (companyId: string): Promise<CompanyResponse> =>
    apiRequest<CompanyResponse, void>({
        path: `/company/${companyId}`
    });