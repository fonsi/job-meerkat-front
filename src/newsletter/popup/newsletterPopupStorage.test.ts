import {
    NEWSLETTER_POPUP_COOLDOWN_MS,
    NEWSLETTER_POPUP_STORAGE_KEY,
    hasNewsletterPopupStorage,
    isNewsletterPopupExcludedPath,
    markNewsletterPopupDismissed,
    markNewsletterPopupSubscribed,
    readNewsletterPopupStorage,
    shouldShowNewsletterPopup,
    writeNewsletterPopupStorage,
} from './newsletterPopupStorage';

describe('newsletterPopupStorage', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('hasNewsletterPopupStorage is false when key is missing', () => {
        expect(hasNewsletterPopupStorage()).toBe(false);
    });

    test('shows again after cooldown when dismissed and not subscribed', () => {
        writeNewsletterPopupStorage({
            lastShownAt: 1_700_000_000_000 - NEWSLETTER_POPUP_COOLDOWN_MS,
            subscribed: false,
        });

        expect(shouldShowNewsletterPopup('/')).toBe(true);
        expect(shouldShowNewsletterPopup('/companies/')).toBe(true);
    });

    test('hides within cooldown after dismiss', () => {
        writeNewsletterPopupStorage({
            lastShownAt: 1_700_000_000_000 - NEWSLETTER_POPUP_COOLDOWN_MS + 1,
            subscribed: false,
        });

        expect(shouldShowNewsletterPopup('/')).toBe(false);
    });

    test('never shows after subscribe, even when cooldown elapsed', () => {
        writeNewsletterPopupStorage({
            lastShownAt: 0,
            subscribed: true,
        });

        expect(shouldShowNewsletterPopup('/')).toBe(false);
    });

    test('markNewsletterPopupDismissed writes lastShownAt and keeps subscribed', () => {
        markNewsletterPopupDismissed(1_700_000_000_000);

        expect(readNewsletterPopupStorage()).toEqual({
            lastShownAt: 1_700_000_000_000,
            subscribed: false,
        });
        expect(
            localStorage.getItem(NEWSLETTER_POPUP_STORAGE_KEY),
        ).not.toBeNull();
    });

    test('markNewsletterPopupSubscribed sets subscribed true', () => {
        markNewsletterPopupSubscribed(1_700_000_000_000);

        expect(readNewsletterPopupStorage()).toEqual({
            lastShownAt: 1_700_000_000_000,
            subscribed: true,
        });
    });

    test('corrupt storage is treated as dismissable after cooldown', () => {
        localStorage.setItem(NEWSLETTER_POPUP_STORAGE_KEY, 'not-json');

        expect(hasNewsletterPopupStorage()).toBe(true);
        expect(readNewsletterPopupStorage()).toEqual({
            lastShownAt: 0,
            subscribed: false,
        });
        expect(shouldShowNewsletterPopup('/')).toBe(true);
    });

    test.each([
        '/newsletter',
        '/newsletter/',
        '/newsletter/settings/',
        '/newsletter/confirm/',
        '/newsletter/unsubscribe/',
        '/terms',
        '/terms/',
        '/privacy',
        '/privacy/',
        '/404',
        '/404/',
    ])('excludes path %s', (pathname) => {
        expect(isNewsletterPopupExcludedPath(pathname)).toBe(true);
        expect(shouldShowNewsletterPopup(pathname)).toBe(false);
    });

    test.each(['/', '/companies/', '/job/', '/category/engineering/'])(
        'allows path %s when storage is empty',
        (pathname) => {
            expect(isNewsletterPopupExcludedPath(pathname)).toBe(false);
            expect(shouldShowNewsletterPopup(pathname)).toBe(true);
        },
    );
});
