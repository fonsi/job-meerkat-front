import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

const REQUIRE_BANNER =
    "import { createRequire as __ssrCreateRequire } from 'node:module'; const require = __ssrCreateRequire(import.meta.url);";

/** Serverless Framework esbuild overlay: `@/` aliases + Node ESM styled-components. */
export default () => ({
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    banner: { js: REQUIRE_BANNER },
    alias: {
        '@': path.join(root, 'src'),
        'styled-components': path.join(
            root,
            'node_modules/styled-components/dist/styled-components.esm.js',
        ),
    },
});
