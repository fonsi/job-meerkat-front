'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { X } from '../image/icons/X';
import { Threads } from '../image/icons/Threads';
import { Linkedin } from '../image/icons/Linkedin';
import { Container } from './Container';
import { Colors } from '../styles/constants';

const StyledFooter = styled.footer`
    align-items: center;
    border-top: 1px solid ${Colors.mediumGrey};
    display: flex;
    font-size: 12px;
    justify-content: center;
    padding: 8px 0;
    width: 100%;
`;

const StyledMadeBy = styled.div`
    line-height: 1.2;
    text-align: center;

    @media (max-width: 767px) {
        display: none;
    }
`;

const StyledLinks = styled.nav`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    line-height: 1;
    min-height: 24px;
`;

const Separator = styled.span`
    color: ${Colors.mediumGrey};
    line-height: 1;
`;

const FooterLink = styled(Link).attrs({ reloadDocument: true })`
    align-items: center;
    color: ${Colors.lightGrey};
    display: inline-flex;
    line-height: 1;
    transition: color 0.2s ease-in;

    &:hover {
        color: ${Colors.white};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const StyledSocial = styled.div`
    align-items: center;
    display: flex;
    gap: 12px;
    min-height: 24px;

    svg {
        display: block;
        height: 24px;
        width: 24px;
    }
`;

const SocialLink = styled.a`
    align-items: center;
    display: flex;
    transition: color 0.2s ease-in;

    &:hover {
        color: ${Colors.lightGrey};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const StyledContainer = styled(Container)`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
`;

export const Footer = () => (
    <StyledFooter>
        <StyledContainer>
            <StyledLinks>
                <FooterLink to="/newsletter/">Newsletter</FooterLink>
                <Separator aria-hidden="true">|</Separator>
                <FooterLink to="/terms/">Terms</FooterLink>
                <Separator aria-hidden="true">|</Separator>
                <FooterLink to="/privacy/">Privacy</FooterLink>
            </StyledLinks>
            <StyledMadeBy>
                Made with love by{' '}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://x.com/FonsiRS"
                >
                    @fonsirs
                </a>
            </StyledMadeBy>
            <StyledSocial>
                <SocialLink
                    aria-label="Follow Jobmeerkat at Threads"
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.threads.net/@jobmeerkat"
                >
                    <Threads />
                </SocialLink>
                <SocialLink
                    aria-label="Follow Jobmeerkat at X"
                    target="_blank"
                    rel="noreferrer"
                    href="https://x.com/jobmeerkat"
                >
                    <X />
                </SocialLink>
                <SocialLink
                    aria-label="Follow Jobmeerkat at Linkedin"
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.linkedin.com/company/jobmeerkat"
                >
                    <Linkedin />
                </SocialLink>
            </StyledSocial>
        </StyledContainer>
    </StyledFooter>
);
