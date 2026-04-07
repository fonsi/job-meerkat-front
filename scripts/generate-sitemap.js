import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const OUTPUT_DIR = '.output/public';
const OUTPUT_FILE = 'sitemap.xml';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!apiEndpoint) {
    console.error('NEXT_PUBLIC_API_ENDPOINT is not set');
    process.exit(1);
}

const staticUrls = ['/', '/companies/', '/job/', '/privacy/', '/terms/'];

const getJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed for ${url}: ${response.status}`);
    }
    return response.json();
};

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

const main = async () => {
    const [companies, categoryTree] = await Promise.all([
        getJson(`${apiEndpoint}/company`),
        getJson(`${apiEndpoint}/category`),
    ]);

    const dynamicUrls = [
        ...companies.map(
            (company) => `/company/${encodeURIComponent(company.id)}/`,
        ),
        ...categoryTree.flatMap((group) =>
            group.categories.map(
                (category) => `/category/${encodeURIComponent(category.slug)}/`,
            ),
        ),
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
    console.log(`Generated ${OUTPUT_FILE} with ${allPaths.length} URLs`);
};

main().catch((error) => {
    console.error('Failed to generate sitemap', error);
    process.exit(1);
});
