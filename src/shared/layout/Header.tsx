'use client';

import styled from 'styled-components';
import { Colors, Device, PageGutter } from '@/shared/styles/constants';
import { LogoMark } from '../image/LogoMark';

const StyledDiv = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 24px;
    min-height: 54px;
    justify-content: center;
    padding: 8px 0;
    width: 100%;
`;

const Container = styled.div`
    align-items: center;
    box-sizing: border-box;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    max-width: 1280px;
    padding: 0 ${PageGutter.sm};
    width: 100%;

    @media ${Device.laptop} {
        padding: 0 ${PageGutter.lg};
    }
`;

const LogoContainer = styled.div`
    display: flex;
    flex-shrink: 0;
`;

const StyledLink = styled.a`
    display: block;
    font-size: unset;
    line-height: 0;

    svg {
        display: block;
        height: 28px;
        width: 28px;
    }

    @media ${Device.tablet} {
        svg {
            height: 32px;
            width: 32px;
        }
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 3px;
    }
`;

const HeaderLinks = styled.nav`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 13px;
    gap: 14px;

    @media ${Device.tablet} {
        font-size: 14px;
        gap: 20px;
    }
`;

const NavLink = styled.a`
    color: ${Colors.brokenWhite};
    text-decoration: none;
    transition: color 0.2s ease-in;

    &:hover {
        color: ${Colors.accent};
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 3px;
    }
`;

export const Header = () => (
    <StyledDiv>
        <Container>
            <LogoContainer>
                <StyledLink href="/" aria-label="Jobmeerkat home">
                    <LogoMark />
                </StyledLink>
            </LogoContainer>
            <HeaderLinks>
                <NavLink href="/companies/">Companies</NavLink>
                <NavLink href="/newsletter/">Newsletter</NavLink>
            </HeaderLinks>
        </Container>
    </StyledDiv>
);
