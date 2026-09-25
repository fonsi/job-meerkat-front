'use client';

import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors, Device } from '@/shared/styles/constants';

type Align = 'start' | 'center';

type Props = {
    title: string;
    description?: string;
    eyebrow?: string;
    meta?: string;
    align?: Align;
    cta?: {
        to: string;
        label: string;
    };
    children?: ReactNode;
    className?: string;
};

const Header = styled.header<{ $align: Align }>`
    align-items: ${({ $align }) =>
        $align === 'center' ? 'center' : 'flex-start'};
    display: flex;
    flex-direction: column;
    margin: 40px 0 28px;
    text-align: ${({ $align }) => $align};
    text-wrap: pretty;

    @media ${Device.tablet} {
        margin: 48px 0 32px;
    }
`;

const Eyebrow = styled.span`
    color: ${Colors.accent};
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin-bottom: 12px;
    text-transform: uppercase;
`;

const Title = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0;
`;

const Description = styled.p<{ $align: Align }>`
    color: ${Colors.mediumGrey};
    font-size: 16px;
    font-weight: 300;
    line-height: 1.55;
    margin: 12px 0 0;
    max-width: 36ch;

    ${({ $align }) =>
        $align === 'center'
            ? `
        max-width: 560px;
        font-size: 17px;
    `
            : ''}
`;

const Meta = styled.p`
    color: ${Colors.lightGrey};
    font-size: 14px;
    margin: 16px 0 0;
`;

const CtaLink = styled(Link).attrs({ reloadDocument: true })`
    background: ${Colors.accent};
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    font-size: 15px;
    font-weight: 700;
    margin-top: 24px;
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

export const PageHeader = ({
    title,
    description,
    eyebrow,
    meta,
    align = 'start',
    cta,
    children,
    className,
}: Props) => (
    <Header $align={align} className={className}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Title>{title}</Title>
        {description ? (
            <Description $align={align}>{description}</Description>
        ) : null}
        {meta ? <Meta>{meta}</Meta> : null}
        {cta ? <CtaLink to={cta.to}>{cta.label}</CtaLink> : null}
        {children}
    </Header>
);
