'use client';

import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Device, PageGutter } from '@/shared/styles/constants';

type ContainerProps = {
    $maxWidth?: string;
    $margin?: string;
};

const StyledContainer = styled.div<ContainerProps>`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: ${(props) => props.$margin || '0'};
    max-width: ${(props) => props.$maxWidth || '1280px'};
    padding: 0 ${PageGutter.sm};
    width: 100%;

    @media ${Device.laptop} {
        padding: 0 ${PageGutter.lg};
    }
`;

export const Container = ({
    children,
    ...props
}: PropsWithChildren<ContainerProps>) => (
    <StyledContainer {...props}>{children}</StyledContainer>
);
