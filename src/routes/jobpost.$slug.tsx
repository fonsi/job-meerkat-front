import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import {
    buildJobPostPath,
    normalizeSlugParam,
} from '@/jobPost/seo/jobPostPageMeta';

// Job HTML is served by the jobPostPage Lambda (CloudFront `jobpost*`).
// Soft SPA navigations must hard-load so the browser hits CloudFront/SSR.
function HardNavigateToJobPost() {
    const { slug: rawSlug } = Route.useParams();

    useEffect(() => {
        const slug = normalizeSlugParam(rawSlug);
        if (!slug) return;
        window.location.replace(buildJobPostPath(slug));
    }, [rawSlug]);

    return null;
}

export const Route = createFileRoute('/jobpost/$slug')({
    component: HardNavigateToJobPost,
});
