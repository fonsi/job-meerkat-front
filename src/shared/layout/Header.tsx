'use client'

import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';
import Link from 'next/link';
import { UserMenu } from './UserMenu';

const StyledDiv = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 24px;
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

export const Header = () => <StyledDiv>
    <Container>
        <LogoContainer>
            <Link href='/'>Jobmeerkat</Link>
        </LogoContainer>
        <UserMenu />
    </Container>
</StyledDiv>;