import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
    test('should render', () => {
        render(<Footer />);

        screen.getByText('Made with love by');
        const xLink = screen.getByRole('link', {
            name: '@fonsirs',
        }) as HTMLLinkElement;

        expect(xLink.href).toEqual('https://twitter.com/FonsiRS');
    });
});
