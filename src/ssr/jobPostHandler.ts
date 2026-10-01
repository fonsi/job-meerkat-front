import { type JobPost } from '@/jobPost/http/getJobPosts';
import { getJobPostPageFromCache } from '@/ssr/getJobPostPageFromCache';
import {
    getHttpMethodFromFunctionUrlEvent,
    getRawPathFromFunctionUrlEvent,
    parseJobPostSlugFromPath,
    type FunctionUrlEvent,
} from '@/ssr/parseJobPostPath';
import { renderJobPostHtml } from '@/ssr/renderJobPostHtml';

const HTML_CONTENT_TYPE = 'text/html; charset=utf-8';
const CACHE_CONTROL_OK = 'public, max-age=60, s-maxage=300';
const CACHE_CONTROL_NOT_FOUND = 'public, max-age=60, s-maxage=60';
const CACHE_CONTROL_ERROR = 'no-store';

export type JobPostLambdaResponse = {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
};

export type JobPostHandlerDeps = {
    loadJobPost: (slug: string) => Promise<JobPost | null>;
};

const htmlResponse = (
    statusCode: number,
    body: string,
    cacheControl: string,
): JobPostLambdaResponse => ({
    statusCode,
    headers: {
        'content-type': HTML_CONTENT_TYPE,
        'cache-control': cacheControl,
    },
    body,
});

export const createJobPostHandler =
    (deps: JobPostHandlerDeps) =>
    async (event: FunctionUrlEvent): Promise<JobPostLambdaResponse> => {
        const method = getHttpMethodFromFunctionUrlEvent(event);
        if (method !== 'GET' && method !== 'HEAD') {
            return {
                statusCode: 405,
                headers: {
                    allow: 'GET, HEAD',
                    'cache-control': CACHE_CONTROL_ERROR,
                },
                body: '',
            };
        }

        const slug = parseJobPostSlugFromPath(
            getRawPathFromFunctionUrlEvent(event),
        );

        try {
            const job = slug == null ? null : await deps.loadJobPost(slug);
            const body = renderJobPostHtml({ job, slug });
            const notFound = job == null;

            return htmlResponse(
                notFound ? 404 : 200,
                method === 'HEAD' ? '' : body,
                notFound ? CACHE_CONTROL_NOT_FOUND : CACHE_CONTROL_OK,
            );
        } catch (error) {
            console.error('jobPostHandler error:', error);
            const body = renderJobPostHtml({ job: null, slug });

            return htmlResponse(
                500,
                method === 'HEAD' ? '' : body,
                CACHE_CONTROL_ERROR,
            );
        }
    };

export const handler = createJobPostHandler({
    loadJobPost: getJobPostPageFromCache,
});
