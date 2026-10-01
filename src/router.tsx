import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        // Scroll happens on <main>, not the window (Page uses overflow: hidden).
        scrollToTopSelectors: ['main'],
        // Prerendered static site: intent preload would re-run loaders (API) on hover for no gain.
        defaultPreload: false,
        // Chrome nav and job pages use full document loads (`<a href>`), so Back
        // restores a real previous document instead of a soft SPA route.
        // Job pages are full document loads (`/jobpost/{slug}` → SSR Lambda).
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
