import { toStaticErrorHtml } from './toStaticErrorHtml';

describe('toStaticErrorHtml', () => {
    it('removes scripts and modulepreload, keeps styles and body', () => {
        const html = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="/assets/app.css"/>
<link rel="modulepreload" href="/assets/index.js"/>
<title>Page not found | Jobmeerkat</title>
</head><body>
<div class="app-shell"><h1>Page not found</h1></div>
<script type="module" src="/assets/index.js"></script>
<script class="$tsr">self.$_TSR={}</script>
</body></html>`;

        const result = toStaticErrorHtml(html);

        expect(result).toContain('Page not found | Jobmeerkat');
        expect(result).toContain('class="app-shell"');
        expect(result).toContain('href="/assets/app.css"');
        expect(result).not.toContain('<script');
        expect(result).not.toContain('modulepreload');
        expect(result).not.toContain('/assets/index.js');
    });
});
