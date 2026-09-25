'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import styled from 'styled-components';

const StyledMain = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;

    > * {
        flex-shrink: 0;
    }
`;

export const Main = ({ children }: PropsWithChildren) => {
    const mainRef = useRef<HTMLElement>(null);
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });
    const search = useRouterState({
        select: (state) => state.location.searchStr,
    });

    // Fallback when TanStack scroll restoration hasn't tracked <main> yet
    // (first SPA navigations e.g. list → job detail).
    useEffect(() => {
        mainRef.current?.scrollTo(0, 0);
    }, [pathname, search]);

    return <StyledMain ref={mainRef}>{children}</StyledMain>;
};
