import { parseBlogRoute } from './parseBlogPath';

jest.mock('@/shared/http/apiRequest', () => ({
    apiRequest: jest.fn(),
}));

describe('parseBlogRoute', () => {
    it('reads the index and query page', () => {
        expect(parseBlogRoute('/blog')).toEqual({ kind: 'index', page: 1 });
        expect(parseBlogRoute('/blog/', { rawQueryString: 'page=3' })).toEqual({
            kind: 'index',
            page: 3,
        });
    });

    it('reads /blog/page/N', () => {
        expect(parseBlogRoute('/blog/page/2')).toEqual({
            kind: 'index',
            page: 2,
        });
    });

    it('reads a post slug', () => {
        expect(parseBlogRoute('/blog/remote-job-market-2026-10')).toEqual({
            kind: 'post',
            slug: 'remote-job-market-2026-10',
        });
    });

    it('reads the sitemap', () => {
        expect(parseBlogRoute('/blog/sitemap.xml')).toEqual({
            kind: 'sitemap',
        });
    });
});
