import { fireEvent, render, screen } from '@testing-library/react';
import { UserMenu } from './UserMenu';
import { PropsWithChildren } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { redirect } from 'next/navigation';

jest.mock('@aws-amplify/ui-react', () => {
    return {
        Authenticator: {
            Provider: ({ children }: PropsWithChildren) => <>{children}</>,
        },
        useAuthenticator: jest.fn(),
    };
});
jest.mock('next/navigation');

const signOut = jest.fn();

describe('UserMenu', () => {
    beforeEach(() => {
        (useAuthenticator as jest.Mock).mockReturnValue({
            authStatus: 'unauthenticated',
            signOut,
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should not render if user is not logged in', () => {
        render(<UserMenu />);

        expect(screen.queryByTestId('PersonIcon')).toBeNull();
    });

    describe('authenticated user', () => {
        beforeEach(() => {
            (useAuthenticator as jest.Mock).mockReturnValue({
                authStatus: 'authenticated',
                signOut,
            });
        });

        test('should render', () => {
            render(<UserMenu />);

            screen.getByTestId('PersonIcon');
            expect(screen.queryByRole('list')).toBeNull();
        });

        test('should toggle menu options on person icon click', () => {
            render(<UserMenu />);

            const personIcon = screen.getByTestId('PersonIcon');
            fireEvent.click(personIcon); // click to show options list

            screen.getByRole('list');
            let options = screen.getAllByRole('listitem');
            const dashboardOption = options[0];
            const logOutOption = options[1];

            expect(options.length).toEqual(2);
            expect(dashboardOption.textContent).toEqual('Dashboard');
            expect(logOutOption.textContent).toEqual('Log out');

            fireEvent.click(personIcon); // click again to hide options list

            const list = screen.queryByRole('list');
            options = screen.queryAllByRole('listitem');
            expect(list).toBeNull();
            expect(options.length).toEqual(0);
        });

        test('should redirect to dashboard url when Dashboard option clicked', () => {
            render(<UserMenu />);

            const personIcon = screen.getByTestId('PersonIcon');
            fireEvent.click(personIcon);

            const options = screen.getAllByRole('listitem');
            const dashboardOption = options[0];

            fireEvent.click(dashboardOption);

            expect(redirect).toHaveBeenCalledWith('/dashboard');
        });

        test('should signout when Log out option clicked', () => {
            render(<UserMenu />);

            const personIcon = screen.getByTestId('PersonIcon');
            fireEvent.click(personIcon);

            const options = screen.getAllByRole('listitem');
            const logOutOption = options[1];

            fireEvent.click(logOutOption);

            expect(signOut).toHaveBeenCalled();
        });
    });
});
