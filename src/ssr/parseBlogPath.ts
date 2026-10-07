import { normalizeSlugParam } from '@/jobPost/seo/jobPostPageMeta';
import {
    getRawQueryStringFromFunctionUrlEvent,
    type FunctionUrlEvent,
} from '@/ssr/parseJobPostPath';

const BLOG_INDEX = /^\/blog\/?$/;
const BLOG_PAGE = /^\/blog\/page\/(\d+)\/?$/;
const BLOG_SITEMAP = /^\/blog\/sitemap\.xml\/?$/;
const BLOG_POST = /^\/blog\/([^/]+)\/?$/;

export type BlogRoute =
    | { kind: 'index'; page: number }
    | { kind: 'post'; slug: string }
    | { kind: 'sitemap' }
    | { kind: 'invalid' };

const pageFromQuery = (event: FunctionUrlEvent): number | null => {
    const raw = getRawQueryStringFromFunctionUrlEvent(event);
    const fromQuery = new URLSearchParams(raw).get('page');
    const fromParams = event.queryStringParameters?.page;
    const value = fromQuery ?? fromParams;
    if (value == null) return null;
    const page = Number(value);

    return Number.isFinite(page) ? page : null;
};

export const parseBlogRoute = (
    rawPath: string | undefined | null,
    event?: FunctionUrlEvent,
): BlogRoute => {
    if (rawPath == null || rawPath.length === 0) return { kind: 'invalid' };
    const path = rawPath.split('?')[0] ?? '';

    if (BLOG_SITEMAP.test(path)) return { kind: 'sitemap' };
    if (BLOG_INDEX.test(path)) {
        return { kind: 'index', page: pageFromQuery(event ?? {}) ?? 1 };
    }
    const pageMatch = path.match(BLOG_PAGE);
    if (pageMatch?.[1]) {
        return { kind: 'index', page: Number(pageMatch[1]) };
    }
    const postMatch = path.match(BLOG_POST);
    if (postMatch?.[1] && postMatch[1] !== 'page') {
        let decoded = postMatch[1];
        try {
            decoded = decodeURIComponent(postMatch[1]);
        } catch {
            return { kind: 'invalid' };
        }
        const slug = normalizeSlugParam(decoded);

        return slug.length > 0 ? { kind: 'post', slug } : { kind: 'invalid' };
    }

    return { kind: 'invalid' };
};

export const isBlogPath = (rawPath: string): boolean => {
    const path = rawPath.split('?')[0] ?? '';
    return path === '/blog' || path.startsWith('/blog/');
};
