import path from 'node:path';

/** Written by vite.config during build; consumed by generate-sitemap.js (not deployed). */
export const SITEMAP_SOURCES_DIR = '.build-cache';
export const SITEMAP_SOURCES_FILE = 'sitemap-sources.json';

export const getSitemapSourcesPath = (cwd = process.cwd()) =>
    path.join(cwd, SITEMAP_SOURCES_DIR, SITEMAP_SOURCES_FILE);
