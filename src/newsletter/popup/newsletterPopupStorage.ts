export const NEWSLETTER_POPUP_STORAGE_KEY = 'jobmeerkat:newsletter-popup';

export type NewsletterPopupStorage = {
    lastShownAt: number;
    subscribed: boolean;
};

const isBrowser = () => typeof window !== 'undefined';

export const hasNewsletterPopupStorage = (): boolean => {
    if (!isBrowser()) return false;
    return localStorage.getItem(NEWSLETTER_POPUP_STORAGE_KEY) !== null;
};

export const readNewsletterPopupStorage = (): NewsletterPopupStorage | null => {
    if (!isBrowser()) return null;

    const raw = localStorage.getItem(NEWSLETTER_POPUP_STORAGE_KEY);
    if (raw === null) return null;

    try {
        const parsed = JSON.parse(raw) as Partial<NewsletterPopupStorage>;
        return {
            lastShownAt:
                typeof parsed.lastShownAt === 'number' ? parsed.lastShownAt : 0,
            subscribed: Boolean(parsed.subscribed),
        };
    } catch {
        return { lastShownAt: 0, subscribed: false };
    }
};

export const writeNewsletterPopupStorage = (
    state: NewsletterPopupStorage,
): void => {
    if (!isBrowser()) return;
    localStorage.setItem(NEWSLETTER_POPUP_STORAGE_KEY, JSON.stringify(state));
};

export const markNewsletterPopupDismissed = (
    lastShownAt = Date.now(),
): void => {
    const existing = readNewsletterPopupStorage();
    writeNewsletterPopupStorage({
        lastShownAt,
        subscribed: existing?.subscribed ?? false,
    });
};

export const markNewsletterPopupSubscribed = (
    lastShownAt = Date.now(),
): void => {
    const existing = readNewsletterPopupStorage();
    writeNewsletterPopupStorage({
        lastShownAt: existing?.lastShownAt ?? lastShownAt,
        subscribed: true,
    });
};

export const isNewsletterPopupExcludedPath = (pathname: string): boolean => {
    const normalized =
        pathname.length > 1 && pathname.endsWith('/')
            ? pathname.slice(0, -1)
            : pathname;

    return (
        normalized === '/newsletter' ||
        normalized.startsWith('/newsletter/') ||
        normalized === '/terms' ||
        normalized.startsWith('/terms/') ||
        normalized === '/privacy' ||
        normalized.startsWith('/privacy/')
    );
};

export const shouldShowNewsletterPopup = (pathname: string): boolean => {
    if (hasNewsletterPopupStorage()) return false;
    if (isNewsletterPopupExcludedPath(pathname)) return false;
    return true;
};
