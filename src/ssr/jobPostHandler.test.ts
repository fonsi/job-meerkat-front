/**
 * @jest-environment node
 */
import { ApiRequestError } from '@/shared/http/apiRequestError';
import { createJobPostHandler } from '@/ssr/jobPostHandler';
import { renderJobPostHtml } from '@/ssr/renderJobPostHtml';
import type { JobPost } from '@/jobPost/http/getJobPosts';

jest.mock('@/shared/environment/getSiteUrl', () => ({
    getSiteUrl: () => 'https://jobmeerkat.com',
}));

jest.mock('@/shared/environment/isProd', () => ({
    isProd: true,
}));

jest.mock('@/jobPost/http/getJobPosts', () => ({
    JobType: {
        FullTime: 'fullTime',
        PartTime: 'partTime',
        Contract: 'contract',
        Unknown: 'unknown',
    },
    Period: {
        Year: 'year',
        Month: 'month',
        Week: 'week',
        Day: 'day',
        Hour: 'hour',
    },
    Workplace: {
        Remote: 'remote',
        OnSite: 'onSite',
        Hybrid: 'hybrid',
        Unknown: 'unknown',
    },
    getJobPostBySlug: jest.fn(),
    getJobPosts: jest.fn(),
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
        expect(html).toContain('This page does not exist');
    });
});

describe('createJobPostHandler', () => {
    it('returns 200 HTML for a found job', async () => {
        const handler = createJobPostHandler({
            getJobPostBySlug: async () => fixtureJob,
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

    it('returns 404 noindex HTML when the API 404s', async () => {
        const handler = createJobPostHandler({
            getJobPostBySlug: async () => {
                throw new ApiRequestError('missing', 404);
            },
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
        const getJobPostBySlug = jest.fn();
        const handler = createJobPostHandler({ getJobPostBySlug });
        const response = await handler({
            rawPath: '/jobpost/',
            requestContext: { http: { method: 'GET' } },
        });

        expect(getJobPostBySlug).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(404);
        expect(response.body).toContain('Page not found');
    });
});
