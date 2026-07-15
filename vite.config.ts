import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';

type CompanyDto = { id: string };
type CategoryGroupDto = { categories: Array<{ slug: string }> };

const getJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json() as Promise<T>;
};

const toPath = (parts: string[]): string =>
    `/${parts.map((part) => encodeURIComponent(part)).join('/')}`;

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiEndpoint = env.NEXT_PUBLIC_API_ENDPOINT || '';

    const processEnv = {
        NEXT_PUBLIC_APP_ENV: env.NEXT_PUBLIC_APP_ENV,
        NEXT_PUBLIC_API_ENDPOINT: env.NEXT_PUBLIC_API_ENDPOINT,
        NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS:
            env.NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS,
        NEXT_PUBLIC_ADSENSE_ID: env.NEXT_PUBLIC_ADSENSE_ID,
        NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
        NEXT_PUBLIC_GA_MEASUREMENT_ID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        NEXT_PUBLIC_SUGGEST_COMPANIES_FORM:
            env.NEXT_PUBLIC_SUGGEST_COMPANIES_FORM,
        UMAMI_ID: env.UMAMI_ID,
    };

    const pages = [
        { path: '/' },
        { path: '/companies/' },
        { path: '/job/' },
        { path: '/privacy/' },
        { path: '/terms/' },
        { path: '/newsletter/' },
        { path: '/newsletter/settings/' },
        { path: '/newsletter/confirm/' },
        { path: '/newsletter/unsubscribe/' },
    ];

    if (apiEndpoint) {
        const [companies, categoryTree] = await Promise.all([
            getJson<CompanyDto[]>(`${apiEndpoint}/company`),
            getJson<CategoryGroupDto[]>(`${apiEndpoint}/category`),
        ]);

        pages.push(
            ...companies.map((company) => ({
                path: `${toPath(['company', company.id])}/`,
            })),
        );
        pages.push(
            ...categoryTree.flatMap((group) =>
                group.categories.map((category) => ({
                    path: `${toPath(['category', category.slug])}/`,
                })),
            ),
        );
    }

    return {
        // Root-relative asset URLs (/assets/...) so CSS/JS resolve on nested routes (S3/SPA reloads).
        base: '/',
        // TanStack Start defaults to `dist/client` for the static bundle + prerendered HTML.
        // S3 deploy and sitemap/ads scripts use `.output/public`; align the client outDir.
        build: {
            outDir: '.output',
        },
        environments: {
            client: {
                build: {
                    outDir: '.output/public',
                },
            },
        },
        plugins: [
            TanStackRouterVite(),
            tanstackStart({
                server: {
                    entry: './server.tsx',
                },
                pages,
                prerender: {
                    enabled: true,
                    concurrency: 4,
                    crawlLinks: false,
                },
            }),
            react({
                plugins: [
                    [
                        '@swc/plugin-styled-components',
                        {
                            ssr: true,
                            displayName: mode === 'development',
                        },
                    ],
                ],
            }),
        ],
        resolve: {
            tsconfigPaths: true,
        },
        ssr: {
            noExternal: ['styled-components'],
        },
        define: {
            'process.env': JSON.stringify(processEnv),
        },
    };
});
