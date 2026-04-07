import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        // Preload route JS + run loaders on hover/focus so navigation often completes before click.
        defaultPreload: 'intent',
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
