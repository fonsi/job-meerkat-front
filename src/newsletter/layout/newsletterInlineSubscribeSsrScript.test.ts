import { createElement } from 'react';
import { render } from '@testing-library/react';
import { NewsletterInlineSubscribe } from './NewsletterInlineSubscribe';
import {
    NEWSLETTER_SUBSCRIBE_FIELDS_ATTR,
    NEWSLETTER_SUBSCRIBE_FORM_ATTR,
    NEWSLETTER_SUBSCRIBE_ROOT_ATTR,
    buildNewsletterInlineSubscribeSsrScript,
} from './newsletterInlineSubscribeSsrScript';

jest.mock('@/newsletter/http/newsletterApi', () => ({
    subscribeNewsletter: jest.fn(),
}));

describe('buildNewsletterInlineSubscribeSsrScript', () => {
    it('targets the newsletter form attrs and posts to the subscribe API', () => {
        const script = buildNewsletterInlineSubscribeSsrScript(
            'https://api.example.com/',
        );

        expect(script).toContain(`[${NEWSLETTER_SUBSCRIBE_ROOT_ATTR}]`);
        expect(script).toContain(`[${NEWSLETTER_SUBSCRIBE_FIELDS_ATTR}]`);
        expect(script).toContain(`[${NEWSLETTER_SUBSCRIBE_FORM_ATTR}]`);
        expect(script).toContain('fields.remove()');
        expect(script).toContain(
            '"https://api.example.com/newsletter/subscribe"',
        );
        expect(script).toContain('jobmeerkat:newsletter-popup');
        expect(script).toContain('newsletter-sent');
        expect(script).toContain("method:'POST'");
    });
});

describe('newsletter SSR script on server-rendered markup', () => {
    const fetchMock = jest.fn();

    const mount = () => {
        // Same markup the SSR Lambda serves, without React handlers attached.
        const { container, unmount } = render(
            createElement(NewsletterInlineSubscribe, {
                title: 'Get jobs',
                description: 'Desc',
            }),
        );
        const html = container.innerHTML;
        unmount();
        document.body.innerHTML = html;
        new Function(
            buildNewsletterInlineSubscribeSsrScript('https://api.example.com'),
        )();
    };

    const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

    const submit = async (email: string, trap = '') => {
        (
            document.querySelector(
                '[data-newsletter-email]',
            ) as HTMLInputElement
        ).value = email;
        (
            document.querySelector(
                '[data-newsletter-honeypot]',
            ) as HTMLInputElement
        ).value = trap;
        document
            .querySelector('[data-newsletter-form]')!
            .dispatchEvent(new Event('submit', { cancelable: true }));
        await flush();
        await flush();
    };

    const errorEl = () =>
        document.querySelector('[data-newsletter-error]') as HTMLElement;

    beforeEach(() => {
        fetchMock.mockReset();
        global.fetch = fetchMock as unknown as typeof fetch;
        localStorage.clear();
    });

    it('renders the error hidden and shows success on 2xx', async () => {
        fetchMock.mockResolvedValue({ ok: true });
        mount();
        expect(errorEl().hidden).toBe(true);

        await submit('user@example.com');

        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
            email: 'user@example.com',
        });
        expect(document.querySelector('[data-newsletter-fields]')).toBeNull();
        expect(
            (document.querySelector('[data-newsletter-success]') as HTMLElement)
                .hidden,
        ).toBe(false);
    });

    it('shows the error on non-2xx, re-enables the button, succeeds on retry', async () => {
        fetchMock.mockResolvedValueOnce({ ok: false });
        mount();

        await submit('user@example.com');

        const button = document.querySelector(
            '[data-newsletter-submit]',
        ) as HTMLButtonElement;
        expect(errorEl().hidden).toBe(false);
        expect(button.disabled).toBe(false);
        expect(button.textContent).toBe('Send me jobs');

        fetchMock.mockResolvedValueOnce({ ok: true });
        await submit('user@example.com');

        // Success removes the fields block, error message included.
        expect(errorEl()).toBeNull();
        expect(document.querySelector('[data-newsletter-fields]')).toBeNull();
    });

    it('shows the error on a network failure', async () => {
        fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
        mount();

        await submit('user@example.com');

        expect(errorEl().hidden).toBe(false);
    });

    it('forwards a filled honeypot', async () => {
        fetchMock.mockResolvedValue({ ok: true });
        mount();

        await submit('bot@example.com', 'http://spam');

        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
            email: 'bot@example.com',
            website: 'http://spam',
        });
    });
});
