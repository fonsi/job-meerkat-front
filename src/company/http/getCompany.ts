import { JobPost } from '@/jobPost/http/getJobPosts';
import { apiRequest } from '@/shared/http/apiRequest';
import { Company } from '../company';

type CompanyResponse = {
    company: Company;
    openJobPosts: JobPost[];
};

export const getCompany = (companyId: string): Promise<CompanyResponse> => {
    return apiRequest<CompanyResponse, void>({
        path: `/company/${companyId}`,
    }).catch((error) => {
        console.error(`getCompany ${companyId} error:`, error);
        throw error;
    });
};
