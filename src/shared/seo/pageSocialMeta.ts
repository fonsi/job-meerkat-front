import { ogImageMeta, SITE_OG_IMAGE_URL } from '@/shared/seo/ogImage';

export const SITE_NAME = 'Jobmeerkat';

export type PageSocialMetaInput = {
    title: string;
    description: string;
    url: string;
    image?: string | null;
    imageAlt?: string;
    type?: 'website' | 'article';
};

/** Open Graph + Twitter card tags for a page. Defaults image to the site OG asset. */
export const pageSocialMeta = ({
    title,
    description,
    url,
    image,
    imageAlt,
    type = 'website',
}: PageSocialMetaInput) => {
    const imageUrl = image?.trim() || SITE_OG_IMAGE_URL;
    const alt = imageAlt ?? title;

    return [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: SITE_NAME },
        ...ogImageMeta(imageUrl, alt),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl },
    ];
};
