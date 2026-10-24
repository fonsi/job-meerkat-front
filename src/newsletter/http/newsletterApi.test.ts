// p-retry ships ESM only, which this jest setup can't load. Same contract:
// call `fn`, retry up to `retries` times on failure.
jest.mock('p-retry', () => ({
    __esModule: true,
    default: async (
        fn: () => Promise<unknown>,
        { retries = 0 }: { retries?: number } = {},
    ) => {
        let lastError: unknown;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await fn();
            } catch (e) {
                lastError = e;
            }
        }
        throw lastError;
    },
}));

import { subscribeNewsletter } from './newsletterApi';

describe('subscribeNewsletter', () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
        fetchMock.mockReset();
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true }),
        });
        global.fetch = fetchMock as unknown as typeof fetch;
    });

    const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body);

    it('sends only the email when the honeypot is empty', async () => {
        await subscribeNewsletter('user@example.com');

        expect(sentBody()).toEqual({ email: 'user@example.com' });
    });

    it('adds the honeypot field when it is filled', async () => {
        await subscribeNewsletter('user@example.com', 'http://spam');

        expect(sentBody()).toEqual({
            email: 'user@example.com',
            website: 'http://spam',
        });
    });

    it('throws on a non-2xx response', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error',
        });

        await expect(subscribeNewsletter('user@example.com')).rejects.toThrow(
            'Internal Server Error',
        );
    });
});

describe('subscribeNewsletter network failure', () => {
    it('rejects without retrying (retries would multiply confirm emails)', async () => {
        const fetchMock = jest.fn().mockRejectedValue(new TypeError('offline'));
        global.fetch = fetchMock as unknown as typeof fetch;

        await expect(subscribeNewsletter('user@example.com')).rejects.toThrow(
            'offline',
        );
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
