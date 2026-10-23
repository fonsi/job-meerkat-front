/**
 * @jest-environment node
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
    class NoSuchKey extends Error {
        constructor() {
            super('The specified key does not exist.');
            this.name = 'NoSuchKey';
        }
    }

    return {
        NoSuchKey,
        S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
        GetObjectCommand: jest
            .fn()
            .mockImplementation((input: unknown) => ({ input })),
    };
});

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

import { getJobPostPageFromCache } from '@/ssr/getJobPostPageFromCache';
import { createJobPostHandler } from '@/ssr/jobPostHandler';

const s3Error = (name: string, httpStatusCode: number) =>
    Object.assign(new Error(name), {
        name,
        $metadata: { httpStatusCode },
    });

const originalBucket = process.env.JOB_POST_CACHE_BUCKET;

beforeEach(() => {
    mockSend.mockReset();
    process.env.JOB_POST_CACHE_BUCKET = 'test-job-post-cache';
});

afterAll(() => {
    process.env.JOB_POST_CACHE_BUCKET = originalBucket;
});

describe('getJobPostPageFromCache', () => {
    it('reads jobpost/{slug}.json from the cache bucket', async () => {
        mockSend.mockResolvedValue({
            Body: {
                transformToString: async () =>
                    JSON.stringify({ id: 'job-1', slug: 'a-role' }),
            },
        });

        await expect(getJobPostPageFromCache('a-role')).resolves.toEqual({
            id: 'job-1',
            slug: 'a-role',
        });
        expect(mockSend.mock.calls[0][0].input).toEqual({
            Bucket: 'test-job-post-cache',
            Key: 'jobpost/a-role.json',
        });
    });

    it('returns null when S3 reports NoSuchKey', async () => {
        mockSend.mockRejectedValue(s3Error('NoSuchKey', 404));

        await expect(getJobPostPageFromCache('gone')).resolves.toBeNull();
    });

    it('rethrows AccessDenied so real permission problems stay 500s', async () => {
        mockSend.mockRejectedValue(s3Error('AccessDenied', 403));

        await expect(getJobPostPageFromCache('gone')).rejects.toThrow(
            'AccessDenied',
        );
    });
});

describe('jobPostHandler with the S3 cache loader', () => {
    const handler = createJobPostHandler({
        loadJobPost: getJobPostPageFromCache,
    });
    const event = {
        rawPath: '/jobpost/nonexistent-xyz-123',
        requestContext: { http: { method: 'GET' } },
    };

    it('returns 404 noindex HTML for a slug missing from the cache', async () => {
        mockSend.mockRejectedValue(s3Error('NoSuchKey', 404));

        const response = await handler(event);

        expect(response.statusCode).toBe(404);
        expect(response.headers['cache-control']).toBe(
            'public, max-age=60, s-maxage=60',
        );
        expect(response.body).toContain('noindex,nofollow');
        expect(response.body).toContain('Page not found');
    });

    it('returns an uncached 500 for unexpected S3 failures', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        mockSend.mockRejectedValue(s3Error('InternalError', 500));

        const response = await handler(event);

        expect(response.statusCode).toBe(500);
        expect(response.headers['cache-control']).toBe('no-store');
    });
});

describe('serverless.yml SSR permissions', () => {
    // S3 only returns 404 NoSuchKey for a missing key when the caller can
    // list the bucket; otherwise it returns 403 AccessDenied, which the
    // handler turns into a 500.
    const serverlessYml = readFileSync(
        path.join(__dirname, '../../serverless.yml'),
        'utf8',
    );

    it('grants s3:ListBucket on the job post and blog cache buckets', () => {
        expect(serverlessYml).toContain('s3:ListBucket');
        expect(serverlessYml).toMatch(
            /arn:aws:s3:::\$\{sls:stage\}-job-post-cache\s*$/m,
        );
        expect(serverlessYml).toMatch(
            /arn:aws:s3:::\$\{sls:stage\}-blog-cache\s*$/m,
        );
    });
});
