/** Drop client JS so S3/CloudFront error documents are not hydrated as another route. */
export const toStaticErrorHtml = (html: string): string =>
    html
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>/gi, '');
