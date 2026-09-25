'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { INTENT_DEFINITIONS } from '@/intent/intentDefinitions';
import { Colors, Device } from '@/shared/styles/constants';
import {
    HomeSection,
    SectionEyebrow,
    SectionHead,
    SectionIntro,
    SectionTitle,
} from './homeLayout';

const List = styled.ul`
    border-top: 1px solid ${Colors.darkGrey};
    display: flex;
    flex-direction: column;
    list-style: none;
`;

const Item = styled.li`
    border-bottom: 1px solid ${Colors.darkGrey};
`;

const CollectionLink = styled(Link).attrs({ reloadDocument: true })`
    display: grid;
    gap: 10px;
    padding: 22px 4px;
    transition: background-color 0.15s ease;

    @media ${Device.tablet} {
        align-items: baseline;
        gap: 24px;
        grid-template-columns: 48px minmax(0, 1.1fr) minmax(0, 1.2fr);
        padding: 28px 8px;
    }

    &:hover {
        background: linear-gradient(
            90deg,
            rgba(214, 255, 63, 0.08),
            transparent 55%
        );
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const Index = styled.span`
    color: ${Colors.accent};
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
`;

const CollectionTitle = styled.span`
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    transition: color 0.15s ease;

    ${CollectionLink}:hover & {
        color: ${Colors.accent};
    }

    @media ${Device.tablet} {
        font-size: 24px;
    }
`;

const CollectionDescription = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    line-height: 1.5;
`;

export const HomeCollections = () => (
    <HomeSection>
        <SectionHead>
            <div>
                <SectionEyebrow>Collections</SectionEyebrow>
                <SectionTitle>Start from a sharper list</SectionTitle>
            </div>
            <SectionIntro>
                Shortcut lists for public salaries, top pay, and transparent
                employers.
            </SectionIntro>
        </SectionHead>
        <List>
            {INTENT_DEFINITIONS.map((intent, index) => (
                <Item key={intent.slug}>
                    <CollectionLink to={intent.path}>
                        <Index>{String(index + 1).padStart(2, '0')}</Index>
                        <CollectionTitle>{intent.h1}</CollectionTitle>
                        <CollectionDescription>
                            {intent.description}
                        </CollectionDescription>
                    </CollectionLink>
                </Item>
            ))}
        </List>
    </HomeSection>
);
