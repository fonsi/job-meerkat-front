import { JobPost } from '@/jobPost/http/getJobPosts';
import { apiRequest } from '@/shared/http/apiRequest';

type CompanyResponse = {
    company: {
        id: string;
        name: string;
        homePage: string;
    },
    openJobPosts: JobPost[]
}

export const getCompany = (companyId: string): Promise<CompanyResponse> =>
    apiRequest<CompanyResponse, void>({
        path: `/company/${companyId}`
    });