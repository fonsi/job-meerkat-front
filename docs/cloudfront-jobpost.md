# CloudFront: `/jobpost/{slug}` HTML origin

The static site stays on S3. Job HTML is rendered by the `jobPostPage` Lambda Function URL in eu-west-1 (`npm run deploy:ssr:prod`). The daily CI deploy does not publish this function. Wire that URL into the existing distribution by hand.

## After `serverless deploy`

Copy the Function URL from the CLI output (`https://<id>.lambda-url.eu-west-1.on.aws/`). The principal that runs `deploy:ssr` needs CloudFormation, Lambda, IAM, and Logs. The S3 sync principal does not.

## Cache behavior

1. **Origin**
   - Origin domain: Function URL host only (no `https://`, no path)
   - Protocol: HTTPS only
   - Origin path: **empty** (the Lambda must see `/jobpost/{slug}`)
   - HTTP port 443
   - Do not forward the viewer `Host` header; CloudFront should send the Function URL host
2. **Behavior**
   - Path pattern: `jobpost*`
   - Origin: the Function URL origin
   - Viewer protocol: redirect HTTP to HTTPS
   - Allowed methods: GET, HEAD, OPTIONS
   - Cache policy: cache on URL path (no cookies). Honor origin `Cache-Control`
3. **What the Lambda sends**
   - Found job: `200`, `Cache-Control: public, max-age=60, s-maxage=300`
   - Missing job / bad path: **`404`** with the noindex not-found HTML
   - Upstream failure: `500`, `Cache-Control: no-store`

## SPA custom errors

CloudFront custom error responses are distribution-wide. If 403/404 are mapped to `/index.html` with HTTP 200, Lambda 404s become the SPA shell.

Do **not** use those custom errors once this origin returns 404. Keep the SPA fallback on S3 only (website hosting error document `404.html`, the prerendered branded page) or a CloudFront Function on the default (`*`) behavior. Leave `jobpost*` alone so the Lambda status and HTML pass through.

## Trial

Internal job links go to `/jobpost/{slug}`. Keep sitemap, JSON-LD, and `/job/?slug=` canonicals until crawlers look right. Then switch those and add a 301 if you want.
