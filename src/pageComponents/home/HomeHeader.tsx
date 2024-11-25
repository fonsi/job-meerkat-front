'use client'

import { Colors } from '@/shared/styles/constants';
import styled from 'styled-components';

const Header = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 48px 0;
    padding: 0 8px;
`;

const Claim = styled.h1`
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

export const HomeHeader = () =>
    <Header>
        <Claim>Don&apos;t miss your next job</Claim>
        <Text>Daily updated job posts. Stay tunned and follow your dream companies.</Text>
    </Header>;