import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        // Prerendered static site: intent preload would re-run loaders (API) on hover for no gain.
        defaultPreload: false,
        // In-app data fetching is only for `/job/?slug=…`. Other internal links use `reloadDocument`
        // so the browser loads prerendered HTML from disk/CDN instead of SPA navigation + API loaders.
        // Links use `/job/?slug=…` (slash before `?`) so S3 serves `job/index.html` without a
        // redirect that drops the query. Use `preserve` — `always` appends `/` to the full URL
        // and can put a trailing `/` into the last query value (e.g. `slug=foo/`).
        trailingSlash: 'preserve',
    });
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
