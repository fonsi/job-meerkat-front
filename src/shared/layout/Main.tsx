'use client';

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledMain = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
`;

export const Main = ({ children }: PropsWithChildren) => (
    <StyledMain>{children}</StyledMain>
);
