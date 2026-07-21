'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { delaGothicVarName } from '@/shared/font/constants';
import { Colors } from '@/shared/styles/constants';

type Props = {
    title: string;
    description: string;
    resultLabel: string;
};

const Header = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 48px 0 32px;
    padding: 0 8px;
    text-wrap: pretty;
`;

const Claim = styled.h1`
    font-family: var(${delaGothicVarName});
    font-size: 32px;
    font-weight: 400;
    line-height: 1.2;
    text-align: center;
`;

const Text = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 17px;
    font-weight: 300;
    margin-top: 12px;
    max-width: 560px;
    text-align: center;
`;

const ResultCount = styled.p`
    color: ${Colors.lightGrey};
    font-size: 14px;
    margin-top: 16px;
`;

const CtaLink = styled(Link).attrs({ reloadDocument: true })`
    background: ${Colors.white};
    border-radius: 8px;
    color: ${Colors.brokenBlack};
    font-size: 15px;
    font-weight: 600;
    margin-top: 24px;
    padding: 12px 22px;

    &:hover {
        background: ${Colors.lightGrey};
        color: ${Colors.brokenBlack};
    }
`;

export const IntentHeader = ({ title, description, resultLabel }: Props) => (
    <Header>
        <Claim>{title}</Claim>
        <Text>{description}</Text>
        <ResultCount>{resultLabel}</ResultCount>
        <CtaLink to="/newsletter/">Get daily job alerts</CtaLink>
    </Header>
);
