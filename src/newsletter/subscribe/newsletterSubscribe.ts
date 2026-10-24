/**
 * Hidden honeypot input. Real users never see or fill it; bots that fill every
 * field do, and the API then answers 200 without storing or emailing.
 * Must match `NEWSLETTER_HONEYPOT_FIELD` in job-meerkat-backend.
 */
export const NEWSLETTER_HONEYPOT_FIELD = 'website';

/** Shown when the subscribe request fails (network error or non-2xx). */
export const NEWSLETTER_SUBSCRIBE_ERROR_MESSAGE =
    'Couldn’t sign you up just now. Please try again.';

/** Data attributes the vanilla SSR script on /jobpost pages looks up. */
export const NEWSLETTER_HONEYPOT_ATTR = 'data-newsletter-honeypot';
export const NEWSLETTER_SUBSCRIBE_ERROR_ATTR = 'data-newsletter-error';
