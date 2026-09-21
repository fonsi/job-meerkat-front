import { notFound } from '@tanstack/react-router';
import { getJobPostBySlug } from '@/jobPost/http/getJobPosts';
import { ApiRequestError } from '@/shared/http/apiRequestError';

export async function loadJobPostBySlug(slug: string) {
    try {
        return await getJobPostBySlug(slug);
    } catch (error) {
        if (error instanceof ApiRequestError && error.status === 404) {
            throw notFound();
        }
        throw error;
    }
}
