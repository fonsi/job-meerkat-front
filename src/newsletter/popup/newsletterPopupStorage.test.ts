import {
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

    test('anyone with the key is discarded from seeing the popup', () => {
        writeNewsletterPopupStorage({
            lastShownAt: 123,
            subscribed: false,
        });

        expect(hasNewsletterPopupStorage()).toBe(true);
        expect(shouldShowNewsletterPopup('/')).toBe(false);
        expect(shouldShowNewsletterPopup('/companies/')).toBe(false);
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

    test('corrupt storage still counts as having the key', () => {
        localStorage.setItem(NEWSLETTER_POPUP_STORAGE_KEY, 'not-json');

        expect(hasNewsletterPopupStorage()).toBe(true);
        expect(shouldShowNewsletterPopup('/')).toBe(false);
        expect(readNewsletterPopupStorage()).toEqual({
            lastShownAt: 0,
            subscribed: false,
        });
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
