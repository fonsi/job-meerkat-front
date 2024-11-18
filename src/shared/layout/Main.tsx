'use client'

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledMain = styled.main`
    display: flex;
    flex-direction: column;
    max-width: 1024px;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
`;

export const Main = ({ children }: PropsWithChildren) => <StyledMain>{ children }</StyledMain>;