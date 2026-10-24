import { confirmFailureCopy } from './confirmFailureCopy';

describe('confirmFailureCopy', () => {
    it('explains the 7-day window for expired links', () => {
        const copy = confirmFailureCopy('token_expired');

        expect(copy.title).toBe('Confirmation link expired');
        expect(copy.text).toContain('7 days');
    });

    it.each(['token_invalid', 'not_found', 'missing', 'invalid'])(
        'uses the broken-link copy for %s',
        (reason) => {
            expect(confirmFailureCopy(reason).title).toBe(
                'This confirmation link doesn’t work',
            );
        },
    );
});
