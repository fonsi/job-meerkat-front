import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
    test('should render', () => {
        render(<Footer />);

        screen.getByText('Made with love by');
        const madeByLink = screen.getByRole('link', {
            name: '@fonsirs',
        }) as HTMLLinkElement;
        const xLink = screen.getByLabelText(
            'Follow Jobmeerkat at X',
        ) as HTMLLinkElement;
        const blueskyLink = screen.getByLabelText(
            'Follow Jobmeerkat at Bluesky',
        ) as HTMLLinkElement;
        const linkedinLink = screen.getByLabelText(
            'Follow Jobmeerkat at Linkedin',
        ) as HTMLLinkElement;

        expect(madeByLink.href).toEqual('https://x.com/FonsiRS');
        expect(xLink.href).toEqual('https://x.com/jobmeerkat');
        expect(blueskyLink.href).toEqual(
            'https://bsky.app/profile/jobmeerkat.bsky.social',
        );
        expect(linkedinLink.href).toEqual(
            'https://www.linkedin.com/company/jobmeerkat',
        );
    });
});
