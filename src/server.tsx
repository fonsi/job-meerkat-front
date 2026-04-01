import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import {
    createStartHandler,
    defineHandlerCallback,
    StartServer,
} from '@tanstack/react-start/server';

/**
 * String SSR + styled-components ServerStyleSheet so all component CSS is emitted
 * in <head> (avoids late JS-injected styles and layout shift from streaming SSR).
 */
const styledSsrHandler = defineHandlerCallback(
    async ({ router, responseHeaders }) => {
        const sheet = new ServerStyleSheet();
        try {
            let html = ReactDOMServer.renderToString(
                sheet.collectStyles(<StartServer router={router} />),
            );
            router.serverSsr?.setRenderFinished();
            const injectedHtml = router.serverSsr?.takeBufferedHtml();
            if (injectedHtml) {
                html = html.replace('</body>', () => `${injectedHtml}</body>`);
            }
            const styleTags = sheet.getStyleTags();
            if (styleTags) {
                html = html.replace('</head>', () => `${styleTags}</head>`);
            }
            return new Response(`<!DOCTYPE html>${html}`, {
                status: router.stores.statusCode.state,
                headers: responseHeaders,
            });
        } catch (error) {
            console.error('Render to string error:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: responseHeaders,
            });
        } finally {
            router.serverSsr?.cleanup();
            sheet.seal();
        }
    },
);

const fetch = createStartHandler(styledSsrHandler);

export default { fetch };
