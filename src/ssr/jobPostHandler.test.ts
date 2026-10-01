/**
 * @jest-environment node
 */
import { createJobPostHandler } from '@/ssr/jobPostHandler';
import { renderJobPostHtml } from '@/ssr/renderJobPostHtml';
import type { JobPost } from '@/jobPost/http/getJobPosts';

jest.mock('@/shared/environment/getSiteUrl', () => ({
    getSiteUrl: () => 'https://jobmeerkat.com',
}));

jest.mock('@/shared/environment/isProd', () => ({
    isProd: true,
}));

jest.mock('@/shared/http/apiRequest', () => ({
    apiRequest: jest.fn(),
    buildApiRequestUrl: (path: string) => path,
    Method: {
        HEAD: 'head',
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'delete',
    },
}));

jest.mock('@/ssr/getJobPostPageFromCache', () => ({
    getJobPostPageFromCache: jest.fn(),
}));

const fixtureJob = {
    id: 'job-1',
    slug: 'staff-devops-phantom',
    title: 'Staff DevOps Engineer',
    url: 'https://example.com/jobs/1',
    type: 'fullTime',
    company: {
        id: 'co-1',
        name: 'Phantom',
        logo: { url: 'https://cdn.example.com/logo.png' },
    },
    salaryRange: {
        min: 200000,
        max: 250000,
        currency: 'USD',
        period: 'year',
    },
    workplace: 'remote',
    location: 'US, EU, UK',
    createdAt: Date.UTC(2026, 6, 15),
    closedAt: null,
    category: 'devops',
} as JobPost;

describe('renderJobPostHtml', () => {
    it('renders job HTML with /jobpost canonical, OG tags, and JSON-LD', () => {
        const html = renderJobPostHtml({
            job: fixtureJob,
            slug: fixtureJob.slug,
        });

        expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
        expect(html).toContain(
            'Staff DevOps Engineer at Phantom (200K–250K USD / year) | Jobmeerkat',
        );
        expect(html).toContain(
            'https://jobmeerkat.com/jobpost/staff-devops-phantom',
        );
        expect(html).toContain('property="og:title"');
        expect(html).toContain(
            'property="og:image" content="https://cdn.example.com/company/co-1/jobpost/job-1/og.png"',
        );
        expect(html).toContain('property="og:image:width" content="1200"');
        expect(html).toContain('property="og:image:height" content="630"');
        expect(html).toContain('application/ld+json');
        expect(html).toContain('"@type":"JobPosting"');
        expect(html).toContain('Staff DevOps Engineer');
        expect(html).toContain('Phantom');
        expect(html).not.toContain('<script src="/assets/');
    });

    it('renders a noindex not-found page when the job is missing', () => {
        const html = renderJobPostHtml({
            job: null,
            slug: 'missing-role',
        });

        expect(html).toContain('Page not found | Jobmeerkat');
        expect(html).toContain('noindex,nofollow');
        expect(html).toContain(
            'property="og:image" content="https://assets.jobmeerkat.com/og.png"',
        );
        expect(html).toContain('This page does not exist');
    });
});

describe('createJobPostHandler', () => {
    it('returns 200 HTML for a found job', async () => {
        const handler = createJobPostHandler({
            loadJobPost: async () => fixtureJob,
        });
        const response = await handler({
            rawPath: '/jobpost/staff-devops-phantom',
            requestContext: { http: { method: 'GET' } },
        });

        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe(
            'public, max-age=60, s-maxage=300',
        );
        expect(response.body).toContain('Staff DevOps Engineer');
    });

    it('returns 404 noindex HTML when the job is missing from cache', async () => {
        const handler = createJobPostHandler({
            loadJobPost: async () => null,
        });
        const response = await handler({
            rawPath: '/jobpost/missing-role',
            requestContext: { http: { method: 'GET' } },
        });

        expect(response.statusCode).toBe(404);
        expect(response.headers['cache-control']).toBe(
            'public, max-age=60, s-maxage=60',
        );
        expect(response.body).toContain('noindex,nofollow');
        expect(response.body).toContain('Page not found');
    });

    it('returns 404 HTML when the path has no slug', async () => {
        const loadJobPost = jest.fn();
        const handler = createJobPostHandler({ loadJobPost });
        const response = await handler({
            rawPath: '/jobpost/',
            requestContext: { http: { method: 'GET' } },
        });

        expect(loadJobPost).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(404);
        expect(response.body).toContain('Page not found');
    });
});
