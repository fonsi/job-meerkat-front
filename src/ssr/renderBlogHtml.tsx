import { renderToStaticMarkup } from 'react-dom/server';
import {
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterContextProvider,
} from '@tanstack/react-router';
import { ServerStyleSheet } from 'styled-components';
import { type BlogPost } from '@/blog/domain/blogPost';
import { type PaginatedBlogIndex } from '@/blog/domain/paginateBlogIndex';
import { BlogSsrDocument } from '@/ssr/blogSsrDocument';

const createSsrRouter = () => {
    const rootRoute = createRootRoute({ component: () => null });

    return createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory({ initialEntries: ['/'] }),
    });
};

export const renderBlogHtml = (
    props:
        | { kind: 'index'; page: PaginatedBlogIndex }
        | { kind: 'post'; post: BlogPost | null; slug: string | null },
): string => {
    const router = createSsrRouter();
    const sheet = new ServerStyleSheet();

    try {
        let html = renderToStaticMarkup(
            sheet.collectStyles(
                <RouterContextProvider router={router}>
                    <BlogSsrDocument {...props} />
                </RouterContextProvider>,
            ),
        );
        const styleTags = sheet.getStyleTags();
        if (styleTags) html = html.replace('</head>', `${styleTags}</head>`);

        return `<!DOCTYPE html>${html}`;
    } finally {
        sheet.seal();
    }
};

export const renderBlogSitemapXml = (site: string, slugs: string[]): string => {
    const origin = site.replace(/\/$/, '');
    const urls = [
        `${origin}/blog`,
        ...slugs.map((slug) => `${origin}/blog/${encodeURIComponent(slug)}`),
    ];
    const nodes = urls.map((url) => `<url><loc>${url}</loc></url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${nodes}
</urlset>
`;
};
