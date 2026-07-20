'use client';

import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';
import { Link } from '@tanstack/react-router';
import { LogoText } from '../image/LogoText';

const StyledDiv = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 24px;
    min-height: 54px;
    justify-content: center;
    padding: 8px;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1280px;
    width: 100%;
`;

const LogoContainer = styled.div`
    display: flex;
`;

const StyledLink = styled(Link).attrs({ reloadDocument: true })`
    font-size: unset;

    svg {
        height: 20px;
        width: 186px;
    }
`;

const HeaderLinks = styled.nav`
    align-items: center;
    display: flex;
    font-size: 14px;
    gap: 20px;
`;

const NavLink = styled(Link).attrs({ reloadDocument: true })`
    color: ${Colors.brokenWhite};
    transition: color 0.2s ease-in;

    &:hover {
        color: ${Colors.lightGrey};
    }
`;

export const Header = () => (
    <StyledDiv>
        <Container>
            <LogoContainer>
                <StyledLink to="/">
                    <LogoText fill="#fff" />
                </StyledLink>
            </LogoContainer>
            <HeaderLinks>
                <NavLink to="/companies/">Companies</NavLink>
                <NavLink to="/newsletter/">Newsletter</NavLink>
            </HeaderLinks>
        </Container>
    </StyledDiv>
);
