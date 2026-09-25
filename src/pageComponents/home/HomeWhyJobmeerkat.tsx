'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';
import {
    HomeSection,
    SectionEyebrow,
    SectionHead,
    SectionIntro,
    SectionTitle,
} from './homeLayout';

const Points = styled.ul`
    display: grid;
    gap: 0;
    grid-template-columns: 1fr;
    list-style: none;

    @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const Point = styled.li`
    border-top: 1px solid ${Colors.darkGrey};
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px 0 28px;

    @media ${Device.tablet} {
        border-right: 1px solid ${Colors.darkGrey};
        padding: 28px 24px 32px 0;

        &:nth-child(2n) {
            border-right: 0;
            padding-left: 24px;
            padding-right: 0;
        }
    }
`;

const PointIndex = styled.span`
    color: ${Colors.accent};
    font-family: var(${delaGothicVarName});
    font-size: 28px;
    line-height: 1;
`;

const PointTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
`;

const PointText = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    line-height: 1.55;
    max-width: 36ch;
`;

const InlineLink = styled(Link).attrs({ reloadDocument: true })`
    color: ${Colors.accent};
    font-weight: 600;

    &:hover {
        color: ${Colors.lightGrey};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

export const HomeWhyJobmeerkat = () => (
    <HomeSection>
        <SectionHead>
            <div>
                <SectionEyebrow>Why Jobmeerkat</SectionEyebrow>
                <SectionTitle>Built for clearer job search</SectionTitle>
            </div>
            <SectionIntro>
                Less noise, clearer pay, and a faster path to roles worth
                reading.
            </SectionIntro>
        </SectionHead>
        <Points>
            <Point>
                <PointIndex>01</PointIndex>
                <PointTitle>Tracked employers</PointTitle>
                <PointText>
                    Follow companies that hire remotely and see which ones are
                    actively posting right now.
                </PointText>
            </Point>
            <Point>
                <PointIndex>02</PointIndex>
                <PointTitle>Salaries when published</PointTitle>
                <PointText>
                    Prefer roles that show compensation upfront so you can
                    compare opportunities without guessing.
                </PointText>
            </Point>
            <Point>
                <PointIndex>03</PointIndex>
                <PointTitle>Focused browsing</PointTitle>
                <PointText>
                    Jump into a category or a curated collection when you know
                    the kind of role you want.
                </PointText>
            </Point>
            <Point>
                <PointIndex>04</PointIndex>
                <PointTitle>Daily alerts</PointTitle>
                <PointText>
                    Get new openings by email with the{' '}
                    <InlineLink to="/newsletter/">newsletter</InlineLink> so you
                    do not have to refresh the full board every day.
                </PointText>
            </Point>
        </Points>
    </HomeSection>
);
