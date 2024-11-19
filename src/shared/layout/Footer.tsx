'use client'

import styled from 'styled-components';

const StyledFooter = styled.footer`
    align-items: center;
    font-size: 12px;
    display: flex;
    justify-content: center;
    padding: 8px 0;
    width: 100%;
`;

export const Footer = () =>
    <StyledFooter>
        <span>Made with love by @fonsirs</span>
    </StyledFooter>;