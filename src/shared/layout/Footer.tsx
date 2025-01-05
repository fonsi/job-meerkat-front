'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { X } from '../image/icons/X';
import { Bluesky } from '../image/icons/Bluesky';
import { Linkedin } from '../image/icons/Linkedin';
import { Container } from './Container';
import { Colors } from '../styles/constants';

const StyledFooter = styled.footer`
    align-items: center;
    border-top: 1px solid ${Colors.mediumGrey};
    font-size: 12px;
    display: flex;
    justify-content: center;
    padding: 8px 4px;
    width: 100%;
`;

const StyledMadeBy = styled.div``;

const StyledSocial = styled.div`
    display: flex;
    gap: 12px;

    svg {
        width: 24px;
        height: 24px;
    }
`;

const SocialLink = styled(Link)`
    align-items: center;
    display: flex;
    transition: color 0.2s ease-in;

    :hover {
        color: ${Colors.lightGrey};
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
            <StyledMadeBy>
                Made with love by{' '}
                <Link target="_blank" href="https://x.com/FonsiRS">
                    @fonsirs
                </Link>
            </StyledMadeBy>
            <StyledSocial>
                <SocialLink
                    aria-label="Follow Jobmeerkat at X"
                    target="_blank"
                    href="https://x.com/jobmeerkat"
                >
                    <X />
                </SocialLink>
                <SocialLink
                    aria-label="Follow Jobmeerkat at Bluesky"
                    target="_blank"
                    href="https://bsky.app/profile/jobmeerkat.bsky.social"
                >
                    <Bluesky />
                </SocialLink>
                <SocialLink
                    aria-label="Follow Jobmeerkat at Linkedin"
                    target="_blank"
                    href="https://www.linkedin.com/company/jobmeerkat"
                >
                    <Linkedin />
                </SocialLink>
            </StyledSocial>
        </StyledContainer>
    </StyledFooter>
);
