import { tracker } from '@/shared/analytics/tracker';
import { NewsletterTokenError } from '../newsletter';

const NEWSLETTER_SHOWN_EVENT = 'newsletter-shown';
const NEWSLETTER_SENT_EVENT = 'newsletter-sent';
const NEWSLETTER_CONFIRMED_EVENT = 'newsletter-confirmed';
const NEWSLETTER_CONFIRM_FAILED_EVENT = 'newsletter-confirm-failed';
const NEWSLETTER_DISMISSED_EVENT = 'newsletter-dismissed';

export const trackNewsletterShown = (): void => {
    tracker.trackEvent({ event: NEWSLETTER_SHOWN_EVENT });
};

export const trackNewsletterSent = (): void => {
    tracker.trackEvent({ event: NEWSLETTER_SENT_EVENT });
};

export const trackNewsletterConfirmed = (): void => {
    tracker.trackEvent({ event: NEWSLETTER_CONFIRMED_EVENT });
};

export const trackNewsletterConfirmFailed = (
    reason: NewsletterTokenError | 'missing' | 'unknown',
): void => {
    tracker.trackEvent({
        event: NEWSLETTER_CONFIRM_FAILED_EVENT,
        data: { reason },
    });
};

export const trackNewsletterDismissed = (): void => {
    tracker.trackEvent({ event: NEWSLETTER_DISMISSED_EVENT });
};
