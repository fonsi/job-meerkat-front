'use client'

import Link from 'next/link';
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
        <span>Made with love by <Link target='_blank' href='https://twitter.com/FonsiRS'>@fonsirs</Link></span>
    </StyledFooter>;