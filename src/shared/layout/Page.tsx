'use client';

import styled from 'styled-components';
import { Colors } from '../styles/constants';
import { PropsWithChildren } from 'react';

const StyledPage = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    color: ${Colors.brokenWhite};
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    width: 100%;
`;

export const Page = ({ children }: PropsWithChildren) => (
    <StyledPage>{children}</StyledPage>
);
