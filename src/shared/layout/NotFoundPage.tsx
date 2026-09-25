'use client';

import styled from 'styled-components';
import { Link } from '@tanstack/react-router';
import { Container } from '@/shared/layout/Container';
import { PageHeader } from '@/shared/layout/PageHeader';
import { Colors } from '@/shared/styles/constants';

const Wrap = styled.div`
    margin-bottom: 48px;
    max-width: 560px;
`;

const HomeLink = styled(Link).attrs({ reloadDocument: true })`
    background: ${Colors.accent};
    border-radius: 2px;
    color: ${Colors.brokenBlack};
    display: inline-block;
    font-size: 15px;
    font-weight: 700;
    margin-top: 8px;
    padding: 14px 22px;
    text-decoration: none;
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
`;

export const NotFoundPage = () => (
    <Container>
        <Wrap>
            <PageHeader
                title="Page not found"
                description="This page does not exist or may have been removed. Check the URL or return to the home page."
            />
            <HomeLink to="/">Back to home</HomeLink>
        </Wrap>
    </Container>
);
