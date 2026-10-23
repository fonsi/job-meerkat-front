import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { renderSsrHtmlResponse } from '@tanstack/react-router/ssr/server';
import {
    createServerEntry,
    createStartHandler,
    defineHandlerCallback,
    StartServer,
} from '@tanstack/react-start/server';

/**
 * String SSR + styled-components ServerStyleSheet so all component CSS is emitted
 * in <head> (avoids late JS-injected styles and layout shift from streaming SSR).
 *
 * `renderSsrHtmlResponse` (TanStack Start >= 1.169) adds the doctype, injects the
 * router's hydration scripts, picks the SSR status and cleans up the request,
 * replacing the removed `serverSsr.takeBufferedHtml()` bookkeeping.
 */
const styledSsrHandler = defineHandlerCallback(
    ({ router, responseHeaders }) => {
        const sheet = new ServerStyleSheet();

        return renderSsrHtmlResponse({
            router,
            responseHeaders,
            render: () => {
                const html = ReactDOMServer.renderToString(
                    sheet.collectStyles(<StartServer router={router} />),
                );
                const styleTags = sheet.getStyleTags();
                return styleTags
                    ? html.replace('</head>', () => `${styleTags}</head>`)
                    : html;
            },
        }).finally(() => sheet.seal());
    },
);

const fetch = createStartHandler(styledSsrHandler);

// Since TanStack Start 1.169 (stable), `createStartHandler` rethrows errors;
// `createServerEntry` keeps the request scope and turns them into responses.
export default createServerEntry({ fetch });
