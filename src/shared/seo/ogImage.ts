import { getSiteUrl } from '@/shared/environment/getSiteUrl';

export const ASSETS_BASE_URL = 'https://assets.jobmeerkat.com';

/** Brand default OG — served from the site (`public/og.png`). Upload the same file to CDN when ready. */
export const SITE_OG_IMAGE_URL = `${getSiteUrl().replace(/\/$/, '')}/og.png`;
export const BLOG_OG_IMAGE_URL = `${ASSETS_BASE_URL}/blog/og.png`;
export const OG_IMAGE_WIDTH = '1200';
export const OG_IMAGE_HEIGHT = '630';

/** `{assets}/company/{id}/logo.png` → `{assets}/company/{id}/og.png`. */
export const companyOgImageUrl = (
    logoUrl: string | undefined,
): string | null => {
    const trimmed = logoUrl?.trim();
    if (!trimmed) return null;
    try {
        const url = new URL(trimmed);
        if (!url.pathname.endsWith('/logo.png')) return null;
        url.pathname = url.pathname.replace(/\/logo\.png$/, '/og.png');
        url.search = '';
        url.hash = '';

        return url.toString();
    } catch {
        return null;
    }
};

export const ogImageMeta = (content: string, alt: string) => [
    { property: 'og:image', content },
    { property: 'og:image:width', content: OG_IMAGE_WIDTH },
    { property: 'og:image:height', content: OG_IMAGE_HEIGHT },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:alt', content: alt },
];
