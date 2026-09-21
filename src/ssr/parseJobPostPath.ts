import { normalizeSlugParam } from '@/jobPost/seo/jobPostPageMeta';

const JOBPOST_SLUG_PATH = /^\/jobpost\/([^/]+)\/?$/;

export type FunctionUrlEvent = {
    rawPath?: string;
    requestContext?: {
        http?: {
            method?: string;
            path?: string;
        };
    };
};

export const getRawPathFromFunctionUrlEvent = (
    event: FunctionUrlEvent,
): string => event.rawPath ?? event.requestContext?.http?.path ?? '';

export const getHttpMethodFromFunctionUrlEvent = (
    event: FunctionUrlEvent,
): string => event.requestContext?.http?.method?.toUpperCase() ?? 'GET';

export const parseJobPostSlugFromPath = (
    rawPath: string | undefined | null,
): string | null => {
    if (rawPath == null || rawPath.length === 0) return null;
    const path = rawPath.split('?')[0] ?? '';
    const match = path.match(JOBPOST_SLUG_PATH);
    if (!match?.[1]) return null;

    let decoded = match[1];
    try {
        decoded = decodeURIComponent(match[1]);
    } catch {
        return null;
    }

    const slug = normalizeSlugParam(decoded);

    return slug.length > 0 ? slug : null;
};
