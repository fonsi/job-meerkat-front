import { apiRequest } from '@/shared/http/apiRequest';
import { JobPost } from '../jobPost';

export const getJobPosts = (): Promise<JobPost[]> => {
    return apiRequest<JobPost[], void>({
        path: '/jobPost',
    }).catch((error) => {
        console.error('getJobPosts error:', error);
        throw error;
    });
};
