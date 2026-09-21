import {
    getHttpMethodFromFunctionUrlEvent,
    getRawPathFromFunctionUrlEvent,
    parseJobPostSlugFromPath,
} from './parseJobPostPath';

jest.mock('@/shared/http/apiRequest', () => ({
    apiRequest: jest.fn(),
}));

describe('parseJobPostSlugFromPath', () => {
    it('reads the slug from /jobpost/{slug}', () => {
        expect(parseJobPostSlugFromPath('/jobpost/staff-devops-phantom')).toBe(
            'staff-devops-phantom',
        );
    });

    it('strips a trailing slash and query string', () => {
        expect(
            parseJobPostSlugFromPath('/jobpost/staff-devops-phantom/?utm=1'),
        ).toBe('staff-devops-phantom');
    });

    it('decodes a percent-encoded slug', () => {
        expect(parseJobPostSlugFromPath('/jobpost/foo%20bar')).toBe('foo bar');
    });

    it('returns null when the path is not a job post URL', () => {
        expect(parseJobPostSlugFromPath('/jobpost')).toBeNull();
        expect(parseJobPostSlugFromPath('/jobpost/')).toBeNull();
        expect(parseJobPostSlugFromPath('/job/?slug=x')).toBeNull();
        expect(parseJobPostSlugFromPath('')).toBeNull();
    });
});

describe('function URL event helpers', () => {
    it('prefers rawPath', () => {
        expect(
            getRawPathFromFunctionUrlEvent({
                rawPath: '/jobpost/a',
                requestContext: { http: { path: '/other' } },
            }),
        ).toBe('/jobpost/a');
    });

    it('reads the HTTP method', () => {
        expect(
            getHttpMethodFromFunctionUrlEvent({
                requestContext: { http: { method: 'head' } },
            }),
        ).toBe('HEAD');
    });
});
