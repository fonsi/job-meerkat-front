import { apiRequest } from '@/shared/http/apiRequest';
import { JobPost } from '../jobPost';

export const getJobPostBySlug = (slug: string): Promise<JobPost> => {
    return apiRequest<JobPost, void>({
        path: `/jobpost/${slug}`,
    }).catch((error) => {
        console.error('getJobPostBySlug error:', error);
        throw error;
    });
};
