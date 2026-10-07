# CloudFront: `/blog` HTML origin

The static site stays on S3. Blog HTML is rendered by the same `jobPostPage` Lambda Function URL as job posts (`npm run deploy:ssr:prod`). New posts do not require a web or SSR deploy — the API writes JSON to the cache bucket.

Start fresh: do not import old `blog.jobmeerkat.com` posts. Point the subdomain at `/blog` or retire it.

## Behavior

1. **Origin** — reuse the job-post Function URL origin (empty origin path so the Lambda sees `/blog` and `/blog/{slug}`).
2. **Path pattern:** `blog*`
3. **Cache:** cache on URL path. Path-based pagination is `/blog/page/{n}` so you do not need to forward the `page` query string. Honor origin `Cache-Control`.
4. **Lambda responses**
   - Index / post found: `200`, `Cache-Control: public, max-age=60, s-maxage=300`
   - Missing post: `404`
   - `/blog/sitemap.xml`: `application/xml`

Leave `blog*` off any CloudFront custom error that maps 404 → `/index.html`.

## Subdomain

301 `blog.jobmeerkat.com` and `blog.jobmeerkat.com/*` to `https://jobmeerkat.com/blog`. Do not preserve old slugs.

## Content

The Lambda reads `index.json` and `{slug}.json` from the private `${stage}-blog-cache` bucket (separate from job-post cache). OG images live at `https://assets.jobmeerkat.com/blog/og.png` (index) and `https://assets.jobmeerkat.com/blog/{slug}/og.png` (posts).
