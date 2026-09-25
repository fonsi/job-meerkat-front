'use client';

import styled from 'styled-components';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';

export const HomeSection = styled.section`
    margin: 0 0 72px;
    padding-top: 8px;
    position: relative;
`;

export const SectionHead = styled.div`
    display: grid;
    gap: 12px;
    margin-bottom: 28px;

    @media ${Device.tablet} {
        align-items: end;
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
        gap: 24px;
        margin-bottom: 36px;
    }
`;

export const SectionEyebrow = styled.span`
    color: ${Colors.accent};
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin-bottom: 10px;
    text-transform: uppercase;
`;

export const SectionTitle = styled.h2`
    font-family: var(${delaGothicVarName});
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.1;
`;

export const SectionIntro = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 15px;
    line-height: 1.55;
    max-width: 36ch;

    @media ${Device.tablet} {
        justify-self: end;
        padding-bottom: 4px;
        text-align: right;
    }
`;
