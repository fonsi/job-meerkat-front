import {
    getBlogIndexFromCache,
    getBlogPostFromCache,
} from '@/ssr/getBlogFromCache';
import {
    getHttpMethodFromFunctionUrlEvent,
    getRawPathFromFunctionUrlEvent,
    type FunctionUrlEvent,
} from '@/ssr/parseJobPostPath';
import { parseBlogRoute } from '@/ssr/parseBlogPath';
import { paginateBlogIndex } from '@/blog/domain/paginateBlogIndex';
import { renderBlogHtml, renderBlogSitemapXml } from '@/ssr/renderBlogHtml';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';
import type { JobPostLambdaResponse } from '@/ssr/jobPostHandler';

const HTML_CONTENT_TYPE = 'text/html; charset=utf-8';
const XML_CONTENT_TYPE = 'application/xml; charset=utf-8';
const CACHE_CONTROL_OK = 'public, max-age=60, s-maxage=300';
const CACHE_CONTROL_NOT_FOUND = 'public, max-age=60, s-maxage=60';
const CACHE_CONTROL_ERROR = 'no-store';

const htmlResponse = (
    statusCode: number,
    body: string,
    cacheControl: string,
    contentType = HTML_CONTENT_TYPE,
): JobPostLambdaResponse => ({
    statusCode,
    headers: {
        'content-type': contentType,
        'cache-control': cacheControl,
    },
    body,
});

export const createBlogHandler =
    (deps: {
        loadIndex: typeof getBlogIndexFromCache;
        loadPost: typeof getBlogPostFromCache;
    }) =>
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

        const route = parseBlogRoute(
            getRawPathFromFunctionUrlEvent(event),
            event,
        );

        try {
            if (route.kind === 'sitemap') {
                const index = await deps.loadIndex();
                const xml = renderBlogSitemapXml(
                    getSiteUrl(),
                    index.posts.map((post) => post.slug),
                );

                return htmlResponse(
                    200,
                    method === 'HEAD' ? '' : xml,
                    CACHE_CONTROL_OK,
                    XML_CONTENT_TYPE,
                );
            }

            if (route.kind === 'index') {
                const index = await deps.loadIndex();
                const page = paginateBlogIndex(index, route.page);
                const body = renderBlogHtml({ kind: 'index', page });

                return htmlResponse(
                    200,
                    method === 'HEAD' ? '' : body,
                    CACHE_CONTROL_OK,
                );
            }

            const slug = route.kind === 'post' ? route.slug : null;
            const post = slug == null ? null : await deps.loadPost(slug);
            const body = renderBlogHtml({ kind: 'post', post, slug });
            const notFound = post == null;

            return htmlResponse(
                notFound ? 404 : 200,
                method === 'HEAD' ? '' : body,
                notFound ? CACHE_CONTROL_NOT_FOUND : CACHE_CONTROL_OK,
            );
        } catch (error) {
            console.error('blogHandler error:', error);
            const body = renderBlogHtml({
                kind: 'post',
                post: null,
                slug: null,
            });

            return htmlResponse(
                500,
                method === 'HEAD' ? '' : body,
                CACHE_CONTROL_ERROR,
            );
        }
    };

export const blogHandler = createBlogHandler({
    loadIndex: getBlogIndexFromCache,
    loadPost: getBlogPostFromCache,
});
