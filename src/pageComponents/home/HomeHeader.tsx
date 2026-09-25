'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device, PageGutter } from '@/shared/styles/constants';

const Header = styled.header`
    flex-shrink: 0;
    margin: 0 0 64px;
    padding: 40px 0 48px;
    position: relative;
    text-wrap: pretty;
    width: 100%;

    &::before {
        background: radial-gradient(
            ellipse 90% 100% at 28% 0%,
            rgba(214, 255, 63, 0.14),
            transparent 70%
        );
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
        z-index: 0;
    }

    @media ${Device.tablet} {
        margin-bottom: 80px;
        padding: 56px 0 64px;
    }
`;

const Inner = styled.div`
    box-sizing: border-box;
    display: grid;
    gap: 28px;
    justify-items: center;
    margin: 0 auto;
    max-width: 1280px;
    padding: 0 ${PageGutter.sm};
    position: relative;
    text-align: center;
    width: 100%;
    z-index: 1;

    @media ${Device.laptop} {
        align-items: end;
        gap: 48px;
        grid-template-columns: minmax(0, 1.55fr) minmax(0, 0.85fr);
        justify-items: stretch;
        padding: 0 ${PageGutter.lg};
        text-align: left;
    }
`;

const Lead = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    @media ${Device.laptop} {
        align-items: stretch;
    }
`;

const Claim = styled.h1`
    align-items: center;
    display: flex;
    flex-direction: column;
    font-family: var(${delaGothicVarName});
    font-weight: 400;
    gap: 0;
    letter-spacing: -0.03em;
    line-height: 1;

    @media ${Device.laptop} {
        align-items: flex-start;
    }
`;

const Brand = styled.span`
    font-size: clamp(36px, 6.5vw, 64px);
    letter-spacing: -0.035em;
    line-height: 1.02;
    margin-bottom: 0.28em;
`;

const Line = styled.span`
    font-size: clamp(20px, 3.4vw, 28px);
    letter-spacing: -0.02em;
    line-height: 1.2;
`;

const Mark = styled(Line)`
    align-self: center;
    background-image: linear-gradient(
        transparent 52%,
        rgba(214, 255, 63, 0.55) 52%
    );
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    margin-top: 0.22em;
    padding: 0 0.06em;
    width: fit-content;

    @media ${Device.laptop} {
        align-self: flex-start;
    }
`;

const Text = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 17px;
    font-weight: 300;
    line-height: 1.55;
    margin: 0 auto;
    max-width: 34ch;

    @media ${Device.laptop} {
        font-size: 18px;
        margin: 0.55em 0 0;
    }
`;

const Actions = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 36px;

    @media ${Device.tablet} {
        margin-top: 44px;
    }

    @media ${Device.laptop} {
        justify-content: flex-start;
    }
`;

const CtaLink = styled(Link).attrs({ reloadDocument: true })`
    background: ${Colors.accent};
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    font-size: 15px;
    font-weight: 700;
    padding: 14px 22px;
    transition:
        transform 0.2s ease,
        background-color 0.15s ease;

    &:hover {
        background: ${Colors.lightGrey};
        color: ${Colors.brokenBlack};
        text-decoration: none;
        transform: translateY(-2px);
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 3px;
    }

    &:active {
        transform: translateY(0);
    }
`;

const SecondaryLink = styled.a`
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    font-size: 15px;
    font-weight: 600;
    padding: 8px 2px;
    transition:
        border-color 0.15s ease,
        color 0.15s ease;

    &:hover {
        border-color: ${Colors.accent};
        color: ${Colors.accent};
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 3px;
    }
`;

const SideNote = styled.div`
    border-top: 2px solid ${Colors.accent};
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 36ch;
    padding: 18px 0 0;
    width: 100%;

    @media ${Device.laptop} {
        border-left: 2px solid ${Colors.accent};
        border-top: none;
        justify-content: flex-start;
        max-width: none;
        padding: 4px 0 4px 18px;
    }
`;

export const HomeHeader = () => (
    <Header className="home-hero">
        <Inner>
            <Lead>
                <Claim>
                    <Brand>Jobmeerkat</Brand>
                    <Line>remote jobs with public salaries</Line>
                    <Mark>tracked daily</Mark>
                </Claim>
                <Actions>
                    <CtaLink to="/newsletter/">Get daily job alerts</CtaLink>
                    <SecondaryLink href="#browse-categories">
                        Browse categories
                    </SecondaryLink>
                </Actions>
            </Lead>
            <SideNote>
                <Text>
                    A focused board for remote roles with pay shown upfront.
                    Skip the noise — browse categories, collections, and
                    companies that hire with clarity.
                </Text>
            </SideNote>
        </Inner>
    </Header>
);
