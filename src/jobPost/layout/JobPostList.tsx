'use client';

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

type Props = {
    className?: string;
};

const StyledJobPostsList = styled.ul`
    display: flex;
    flex-direction: column;
`;

export const JobPostsList = ({
    children,
    className,
}: PropsWithChildren<Props>) => (
    <StyledJobPostsList className={className}>{children}</StyledJobPostsList>
);
