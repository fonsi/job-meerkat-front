'use client'

import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';
import Link from 'next/link';

const StyledDiv = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 24px;
    justify-content: center;
    padding: 8px 0;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    max-width: 1024px;
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
    </Container>
</StyledDiv>;