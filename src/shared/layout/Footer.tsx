'use client'

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 4px 0;
    width: 100%;
`;

export const Footer = ({ children }: PropsWithChildren) => <StyledFooter>{children}</StyledFooter>;