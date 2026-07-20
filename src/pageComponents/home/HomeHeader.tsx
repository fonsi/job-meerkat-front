'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors } from '@/shared/styles/constants';

const Header = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 48px 0;
    min-height: 168px;
    padding: 0 8px;
    text-wrap: pretty;
`;

const Claim = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: 36px;
    font-weight: 400;
    line-height: 1.2;
    min-height: 2.4em;
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

const CtaLink = styled(Link).attrs({ reloadDocument: true })`
    background: ${Colors.white};
    border-radius: 8px;
    color: ${Colors.brokenBlack};
    font-size: 15px;
    font-weight: 600;
    margin-top: 24px;
    padding: 12px 22px;
    transition:
        background-color 0.15s ease,
        transform 0.15s ease;

    &:hover {
        background: ${Colors.lightGrey};
        color: ${Colors.brokenBlack};
    }

    &:active {
        transform: translateY(1px);
    }
`;

export const HomeHeader = () => (
    <Header className="home-hero">
        <Claim>Find Remote Jobs with Public Salaries</Claim>
        <Text>
            Discover remote opportunities with clear salaries. New jobs added
            every day.
        </Text>
        <CtaLink to="/newsletter/">Get daily job alerts</CtaLink>
    </Header>
);
