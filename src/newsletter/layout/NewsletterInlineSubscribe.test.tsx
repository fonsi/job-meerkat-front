import { act, fireEvent, render, screen } from '@testing-library/react';
import { subscribeNewsletter } from '@/newsletter/http/newsletterApi';
import { NEWSLETTER_SUBSCRIBE_ERROR_MESSAGE } from '@/newsletter/subscribe/newsletterSubscribe';
import { NewsletterInlineSubscribe } from './NewsletterInlineSubscribe';

jest.mock('@/newsletter/http/newsletterApi', () => ({
    subscribeNewsletter: jest.fn(),
}));
jest.mock('@/newsletter/analytics/trackNewsletterPopup', () => ({
    trackNewsletterSent: jest.fn(),
}));

const subscribe = subscribeNewsletter as jest.Mock;

const renderCard = () =>
    render(<NewsletterInlineSubscribe title="Get jobs" description="Desc" />);

const submit = async (email = 'user@example.com') => {
    fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: email },
    });
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Send me jobs' }));
    });
};

describe('NewsletterInlineSubscribe', () => {
    beforeEach(() => {
        subscribe.mockReset();
        localStorage.clear();
    });

    it('shows an error when subscribe fails and lets the user retry', async () => {
        subscribe.mockRejectedValueOnce(new Error('500'));
        renderCard();

        await submit();

        const alert = screen.getByRole('alert');
        expect(alert.textContent).toBe(NEWSLETTER_SUBSCRIBE_ERROR_MESSAGE);
        expect(alert.hidden).toBe(false);
        expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe(
            'user@example.com',
        );

        subscribe.mockResolvedValueOnce({ ok: true });
        await act(async () => {
            fireEvent.click(
                screen.getByRole('button', { name: 'Send me jobs' }),
            );
        });

        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.getByText('Check your inbox')).toBeTruthy();
        expect(subscribe).toHaveBeenCalledTimes(2);
    });

    it('sends an empty honeypot for real users', async () => {
        subscribe.mockResolvedValueOnce({ ok: true });
        renderCard();

        await submit(' user@example.com ');

        expect(subscribe).toHaveBeenCalledWith('user@example.com', '');
    });

    it('passes the honeypot value when a bot fills it', async () => {
        subscribe.mockResolvedValueOnce({ ok: true });
        const { container } = renderCard();

        const trap = container.querySelector(
            'input[name="website"]',
        ) as HTMLInputElement;
        expect(trap.tabIndex).toBe(-1);
        fireEvent.change(trap, { target: { value: 'http://spam' } });
        await submit();

        expect(subscribe).toHaveBeenCalledWith(
            'user@example.com',
            'http://spam',
        );
    });
});
