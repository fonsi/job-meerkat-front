import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        // Prerendered static site: intent preload would re-run loaders (API) on hover for no gain.
        defaultPreload: false,
        // In-app data fetching is for `/jobpost/{slug}` and legacy `/job/?slug=…`.
        // Other internal links use `reloadDocument` so the browser loads prerendered HTML
        // from disk/CDN instead of SPA navigation + API loaders. Use `preserve` — `always`
        // appends `/` to the full URL and can put a trailing `/` into query values.
        trailingSlash: 'preserve',
    });
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
