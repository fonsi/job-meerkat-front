import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { getSitemapSourcesPath } from './sitemapSourcesPath.js';

dotenv.config({ path: '.env.local' });

const OUTPUT_DIR = '.output/public';
const OUTPUT_FILE = 'sitemap.xml';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const staticUrls = [
    '/',
    '/companies/',
    '/job/',
    '/newsletter/',
    '/privacy/',
    '/terms/',
];

const escapeXml = (input) =>
    input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');

const toUrlNode = (url) => {
    return `<url><loc>${escapeXml(url)}</loc></url>`;
};

const readSitemapSources = () => {
    const sourcesPath = getSitemapSourcesPath();
    if (!fs.existsSync(sourcesPath)) {
        throw new Error(
            `Missing ${sourcesPath}. Run \`vite build\` first so sitemap sources (company ids, category slugs, job slugs) are written during config.`,
        );
    }

    const parsed = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    if (
        !Array.isArray(parsed.companyIds) ||
        !Array.isArray(parsed.categorySlugs) ||
        !Array.isArray(parsed.jobSlugs)
    ) {
        throw new Error(
            `Invalid sitemap sources at ${sourcesPath}: expected companyIds, categorySlugs, and jobSlugs arrays.`,
        );
    }

    return {
        ...parsed,
        intentPaths: Array.isArray(parsed.intentPaths)
            ? parsed.intentPaths
            : [],
    };
};

const main = () => {
    const { companyIds, categorySlugs, jobSlugs, intentPaths } =
        readSitemapSources();

    const activeJobUrls = jobSlugs.map(
        (slug) => `/job/?slug=${encodeURIComponent(slug)}`,
    );

    const dynamicUrls = [
        ...companyIds.map((id) => `/company/${encodeURIComponent(id)}/`),
        ...categorySlugs.map(
            (slug) => `/category/${encodeURIComponent(slug)}/`,
        ),
        ...(Array.isArray(intentPaths) ? intentPaths : []),
        ...activeJobUrls,
    ];

    const allPaths = [...staticUrls, ...dynamicUrls];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths.map((pathName) => toUrlNode(`${siteUrl}${pathName}`)).join('\n')}
</urlset>
`;

    const outDir = path.join(process.cwd(), OUTPUT_DIR);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outDir, OUTPUT_FILE), xml);
    console.log(
        `Generated ${OUTPUT_FILE} with ${allPaths.length} URLs (${activeJobUrls.length} active jobs) from build-cache slugs`,
    );
};

try {
    main();
} catch (error) {
    console.error('Failed to generate sitemap', error);
    process.exit(1);
}
