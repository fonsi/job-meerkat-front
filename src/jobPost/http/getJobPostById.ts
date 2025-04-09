import { apiRequest } from '@/shared/http/apiRequest';
import { JobPost } from '../jobPost';

export const getJobPostById = (
    companyId: string,
    id: string,
): Promise<JobPost> => {
    return apiRequest<JobPost, void>({
        path: `/company/${companyId}/jobPost/${id}`,
    }).catch((error) => {
        console.error('getJobPostById error:', error);
        throw error;
    });
};
