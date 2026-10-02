import {
    NEWSLETTER_SUBSCRIBE_FIELDS_ATTR,
    NEWSLETTER_SUBSCRIBE_FORM_ATTR,
    NEWSLETTER_SUBSCRIBE_ROOT_ATTR,
    buildNewsletterInlineSubscribeSsrScript,
} from './newsletterInlineSubscribeSsrScript';

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
