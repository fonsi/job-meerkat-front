'use client';

import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';
import Link from 'next/link';
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

const StyledLink = styled(Link)`
    font-size: unset;

    svg {
        height: 20px;
        width: 186px;
    }
`;

const HeaderLinks = styled.nav`
    font-size: 14px;
`;

export const Header = () => (
    <StyledDiv>
        <Container>
            <LogoContainer>
                <StyledLink href="/">
                    <LogoText fill="#fff" />
                </StyledLink>
            </LogoContainer>
            <HeaderLinks>
                <Link href="/companies">Companies</Link>
            </HeaderLinks>
        </Container>
    </StyledDiv>
);
