import { SITE_OG_IMAGE_URL } from '@/shared/seo/ogImage';
import { pageSocialMeta, SITE_NAME } from './pageSocialMeta';

describe('pageSocialMeta', () => {
    it('includes og, site_name, and twitter card tags with the site image by default', () => {
        const meta = pageSocialMeta({
            title: 'Title',
            description: 'Description',
            url: 'https://jobmeerkat.com/newsletter/',
        });

        expect(meta).toEqual(
            expect.arrayContaining([
                { property: 'og:title', content: 'Title' },
                { property: 'og:description', content: 'Description' },
                {
                    property: 'og:url',
                    content: 'https://jobmeerkat.com/newsletter/',
                },
                { property: 'og:type', content: 'website' },
                { property: 'og:site_name', content: SITE_NAME },
                { property: 'og:image', content: SITE_OG_IMAGE_URL },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'Title' },
                { name: 'twitter:description', content: 'Description' },
                { name: 'twitter:image', content: SITE_OG_IMAGE_URL },
            ]),
        );
    });

    it('uses a custom image when provided', () => {
        const meta = pageSocialMeta({
            title: 'Job',
            description: 'Desc',
            url: 'https://jobmeerkat.com/jobpost/foo',
            image: 'https://assets.jobmeerkat.com/company/1/jobpost/2/og.png',
            imageAlt: 'Job card',
        });

        expect(meta).toEqual(
            expect.arrayContaining([
                {
                    property: 'og:image',
                    content:
                        'https://assets.jobmeerkat.com/company/1/jobpost/2/og.png',
                },
                { property: 'og:image:alt', content: 'Job card' },
                {
                    name: 'twitter:image',
                    content:
                        'https://assets.jobmeerkat.com/company/1/jobpost/2/og.png',
                },
            ]),
        );
    });
});
