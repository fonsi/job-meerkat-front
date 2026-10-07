/**
 * @jest-environment node
 */
import { createBlogHandler } from '@/ssr/blogHandler';
import { renderBlogHtml } from '@/ssr/renderBlogHtml';
import { BlogPostType, type BlogPost } from '@/blog/domain/blogPost';

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

const originalApiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

beforeAll(() => {
    process.env.NEXT_PUBLIC_API_ENDPOINT = 'https://api.jobmeerkat.com';
});

afterAll(() => {
    process.env.NEXT_PUBLIC_API_ENDPOINT = originalApiEndpoint;
});

const fixturePost: BlogPost = {
    slug: 'remote-job-market-2026-10',
    type: BlogPostType.MonthlyRecap,
    title: 'October remote job recap',
    excerpt: 'New remote jobs with public salaries.',
    publishedAt: '2026-10-01T00:00:00.000Z',
    asOf: '2026-10-01T00:00:00.000Z',
    paragraphs: ['The market added new roles.'],
    listings: [],
    newsletterUrl:
        'https://jobmeerkat.com/newsletter?utm_source=blog&utm_campaign=remote-job-market-2026-10',
    jobsUrl:
        'https://jobmeerkat.com/remote-jobs-with-salary?utm_source=blog&utm_campaign=remote-job-market-2026-10',
    ogImageUrl:
        'https://assets.jobmeerkat.com/blog/remote-job-market-2026-10/og.png',
};

describe('renderBlogHtml', () => {
    it('renders post OG tags and the as-of line', () => {
        const html = renderBlogHtml({
            kind: 'post',
            post: fixturePost,
            slug: fixturePost.slug,
        });

        expect(html).toContain('October remote job recap | Jobmeerkat Blog');
        expect(html).toContain(
            'https://jobmeerkat.com/blog/remote-job-market-2026-10',
        );
        expect(html).toContain('property="og:image"');
        expect(html).toContain(fixturePost.ogImageUrl);
        expect(html).toContain('Based on Jobmeerkat listings as of 2026-10-01');
        expect(html).toContain('utm_source=blog');
    });
});

describe('createBlogHandler', () => {
    it('serves a paginated index', async () => {
        const handler = createBlogHandler({
            loadIndex: async () => ({
                posts: Array.from({ length: 13 }, (_, i) => ({
                    slug: `post-${i}`,
                    type: BlogPostType.MonthlyRecap,
                    title: `Post ${i}`,
                    excerpt: 'e',
                    publishedAt: '2026-10-01T00:00:00.000Z',
                    ogImageUrl: 'https://assets.jobmeerkat.com/blog/og.png',
                })),
            }),
            loadPost: async () => null,
        });
        const result = await handler({
            rawPath: '/blog/page/2',
            requestContext: { http: { method: 'GET' } },
        });

        expect(result.statusCode).toBe(200);
        expect(result.body).toContain('Post 12');
        expect(result.body).toContain('Previous');
    });

    it('serves the blog sitemap', async () => {
        const handler = createBlogHandler({
            loadIndex: async () => ({
                posts: [
                    {
                        slug: 'remote-job-market-2026-10',
                        type: BlogPostType.MonthlyRecap,
                        title: 't',
                        excerpt: 'e',
                        publishedAt: '2026-10-01T00:00:00.000Z',
                        ogImageUrl: 'https://assets.jobmeerkat.com/blog/og.png',
                    },
                ],
            }),
            loadPost: async () => null,
        });
        const result = await handler({
            rawPath: '/blog/sitemap.xml',
            requestContext: { http: { method: 'GET' } },
        });

        expect(result.statusCode).toBe(200);
        expect(result.headers['content-type']).toContain('xml');
        expect(result.body).toContain(
            'https://jobmeerkat.com/blog/remote-job-market-2026-10',
        );
    });
});
