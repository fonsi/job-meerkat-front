'use client';

import { delaGothicVarName } from '@/shared/font/constants';
import { Colors } from '@/shared/styles/constants';
import styled from 'styled-components';

const Header = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 48px 0;
    padding: 0 8px;
    text-wrap: pretty;
`;

const Claim = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: 36px;
    font-weight: 400;
    text-align: center;
`;

const Text = styled.h2`
    color: ${Colors.mediumGrey};
    font-size: 18px;
    font-weight: 300;
    margin-top: 12px;
    max-width: 500px;
    text-align: center;
`;

export const HomeHeader = () => (
    <Header>
        <Claim>Find Remote Jobs with Public Salaries</Claim>
        <Text>
            Discover remote opportunities with clear salaries. New jobs added
            every day.
        </Text>
    </Header>
);
