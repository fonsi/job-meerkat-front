import { TextDecoder, TextEncoder } from 'node:util';
import React from 'react';

if (!globalThis.TextEncoder) {
    globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}

if (!globalThis.TextDecoder) {
    globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

jest.mock('@tanstack/react-router', () => {
    const actual = jest.requireActual('@tanstack/react-router');

    const Link = React.forwardRef<
        HTMLAnchorElement,
        React.AnchorHTMLAttributes<HTMLAnchorElement> & {
            to?: string;
            reloadDocument?: boolean;
        }
    >(({ to, href, children, reloadDocument, ...rest }, ref) => {
        void reloadDocument;

        return (
            <a ref={ref} href={to ?? href} {...rest}>
                {children}
            </a>
        );
    });

    Link.displayName = 'Link';

    return {
        ...actual,
        Link,
    };
});
