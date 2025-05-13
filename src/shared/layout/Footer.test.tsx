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
        const threadsLink = screen.getByLabelText(
            'Follow Jobmeerkat at Threads',
        ) as HTMLLinkElement;
        const linkedinLink = screen.getByLabelText(
            'Follow Jobmeerkat at Linkedin',
        ) as HTMLLinkElement;

        expect(madeByLink.href).toEqual('https://x.com/FonsiRS');
        expect(xLink.href).toEqual('https://x.com/jobmeerkat');
        expect(threadsLink.href).toEqual('https://www.threads.net/@jobmeerkat');
        expect(linkedinLink.href).toEqual(
            'https://www.linkedin.com/company/jobmeerkat',
        );
    });
});
