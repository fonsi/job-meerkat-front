'use client'

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { Person } from '../image/icons/Person';
import styled from 'styled-components';
import { Colors } from '../styles/constants';
import { redirect } from 'next/navigation';

const UserIcon = styled.button`
    align-items: center;
    background-color: ${Colors.white};
    border-radius: 50%;
    color: ${Colors.mediumGrey};
    cursor: pointer;
    display: flex;
    height: 35px;
    justify-content: center;
    padding: 2px;
    position: relative;
    width: 35px;

    svg {
        :hover {
            opacity: .9;
        }
    }
`;

const UserOptions = styled.ul`
    background-color: ${Colors.brokenWhite};
    list-style-type: none;
    position: absolute;
    right: 0;
    top: 40px;

    :hover {
        background-color: ${Colors.mediumGrey};
        color: ${Colors.brokenWhite};
    }
`;

const UserOption = styled.li`
    color: ${Colors.brokenBlack};
    font-size: 14px;
    padding: 4px 12px;
    text-align: right;

    :not(:last-child) {
        border-bottom: 1px solid ${Colors.mediumGrey};
    }
`;

const Menu = () => {
    const { authStatus, signOut } = useAuthenticator(context => [context.authStatus]);
    const [ isOpen, setIsOpen ] = useState(false);

    const handleIconClick = () => {
        setIsOpen(!isOpen);
    }

    const handleOnDashboard = () => {
        redirect('/dashboard');
    }

    const handleLogOut = () => {
        signOut();
    }

    return authStatus !== 'authenticated' ? null : <>
        <UserIcon onClick={handleIconClick}>
            <Person></Person>
            {
                isOpen ?
                    <UserOptions>
                        <UserOption onClick={handleOnDashboard}>Dashboard</UserOption>
                        <UserOption onClick={handleLogOut}>Log out</UserOption>
                    </UserOptions> :
                    null
            }
        </UserIcon>
    </>;
}

export const UserMenu = () =>
    <Authenticator.Provider>
        <Menu />
    </Authenticator.Provider>;
    