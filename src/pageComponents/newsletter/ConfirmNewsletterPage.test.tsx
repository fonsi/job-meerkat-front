import { render, screen, waitFor } from '@testing-library/react';
import { ConfirmNewsletterPage } from './ConfirmNewsletterPage';
import {
    confirmNewsletter,
    parseTokenError,
} from '@/newsletter/http/newsletterApi';
import { trackNewsletterConfirmFailed } from '@/newsletter/analytics/trackNewsletterPopup';

const mockNavigate = jest.fn();

jest.mock('@tanstack/react-router', () => ({
    ...jest.requireActual('@tanstack/react-router'),
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
    useNavigate: () => mockNavigate,
}));

jest.mock('@/newsletter/http/newsletterApi', () => ({
    confirmNewsletter: jest.fn(),
    parseTokenError: jest.fn(),
    subscribeNewsletter: jest.fn(),
}));

jest.mock('@/newsletter/analytics/trackNewsletterPopup', () => ({
    trackNewsletterConfirmed: jest.fn(),
    trackNewsletterConfirmFailed: jest.fn(),
}));

const confirmMock = confirmNewsletter as jest.Mock;
const parseMock = parseTokenError as jest.Mock;
const trackFailedMock = trackNewsletterConfirmFailed as jest.Mock;

describe('ConfirmNewsletterPage', () => {
    beforeEach(() => jest.clearAllMocks());

    it.each([
        ['token_expired', 'Confirmation link expired'],
        ['token_invalid', 'This confirmation link doesn’t work'],
    ])(
        'keeps the %s failure after the token is stripped from the URL',
        async (reason, title) => {
            confirmMock.mockRejectedValue(new Error('401'));
            parseMock.mockReturnValue(reason);

            const { rerender } = render(<ConfirmNewsletterPage token="t" />);
            await screen.findByText(title);

            // replaceState drops ?token, so the route re-renders without it.
            rerender(<ConfirmNewsletterPage token={undefined} />);

            await waitFor(() => expect(screen.getByText(title)).toBeTruthy());
            expect(trackFailedMock).toHaveBeenCalledTimes(1);
            expect(trackFailedMock).toHaveBeenCalledWith(reason);
        },
    );

    it('tracks "missing" when opened without a token', async () => {
        render(<ConfirmNewsletterPage token={undefined} />);

        await screen.findByText('This confirmation link doesn’t work');
        expect(trackFailedMock).toHaveBeenCalledWith('missing');
        expect(confirmMock).not.toHaveBeenCalled();
    });
});
