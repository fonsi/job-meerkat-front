import { blogHandler } from '@/ssr/blogHandler';
import { handler as jobPostHandler } from '@/ssr/jobPostHandler';
import {
    getRawPathFromFunctionUrlEvent,
    type FunctionUrlEvent,
} from '@/ssr/parseJobPostPath';
import { isBlogPath } from '@/ssr/parseBlogPath';

export const handler = async (event: FunctionUrlEvent) => {
    const path = getRawPathFromFunctionUrlEvent(event);
    if (isBlogPath(path)) return blogHandler(event);

    return jobPostHandler(event);
};
