import { HOME_META, buildHomeJsonLd } from './homeSeo';

describe('homeSeo', () => {
    it('builds Organization and WebSite JSON-LD without SearchAction', () => {
        const jsonLd = buildHomeJsonLd('https://jobmeerkat.com');

        expect(jsonLd).toMatchObject({
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'Organization',
                    name: 'Jobmeerkat',
                    url: 'https://jobmeerkat.com/',
                },
                {
                    '@type': 'WebSite',
                    name: 'Jobmeerkat',
                    url: 'https://jobmeerkat.com/',
                    description: HOME_META.description,
                },
            ],
        });
        expect(JSON.stringify(jsonLd)).not.toContain('SearchAction');
    });

    it('normalizes trailing slashes on the site URL', () => {
        const jsonLd = buildHomeJsonLd('https://jobmeerkat.com/');
        const organization = jsonLd['@graph'][0] as { url: string };

        expect(organization.url).toBe('https://jobmeerkat.com/');
    });
});
