import { companyOgImageUrl, SITE_OG_IMAGE_URL } from './ogImage';

describe('ogImage', () => {
    it('points the site card at the assets root', () => {
        expect(SITE_OG_IMAGE_URL).toBe('https://assets.jobmeerkat.com/og.png');
    });

    it('swaps a company logo path for the og card', () => {
        expect(
            companyOgImageUrl(
                'https://assets.jobmeerkat.com/company/co-1/logo.png',
            ),
        ).toBe('https://assets.jobmeerkat.com/company/co-1/og.png');
    });

    it('returns null when the logo url is missing', () => {
        expect(companyOgImageUrl('')).toBeNull();
        expect(companyOgImageUrl(undefined)).toBeNull();
    });
});
