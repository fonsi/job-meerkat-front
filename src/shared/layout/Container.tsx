'use client'

import { PropsWithChildren } from 'react';
import styled from 'styled-components'

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 1280px;
    width: 100%;
`;


export const Container = ({ children }: PropsWithChildren) => <StyledContainer>{ children }</StyledContainer>