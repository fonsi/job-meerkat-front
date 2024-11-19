'use client'

import styled from 'styled-components';

const Header = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 48px 0;
`;

const Logo = styled.div`
    font-size: 100px;
`;

const Claim = styled.h1`
    font-size: 24px;
    font-weight: 400;
`;

export const HomeHeader = () =>
    <Header>
        <Logo>Jobmeerkat</Logo>
        <Claim>Don't miss your next job</Claim>
    </Header>;