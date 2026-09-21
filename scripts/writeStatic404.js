import fs from 'node:fs';

// Keep in sync with src/ssr/toStaticErrorHtml.ts
const toStaticErrorHtml = (html) =>
    html
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>/gi, '');

const src = '.output/public/404/index.html';
const dest = '.output/public/404.html';

if (!fs.existsSync(src)) {
    console.error(`Missing prerendered 404 page at ${src}`);
    process.exit(1);
}

fs.writeFileSync(dest, toStaticErrorHtml(fs.readFileSync(src, 'utf8')));
