'use client'

import { PropsWithChildren } from 'react';
import styled from 'styled-components'

const StyledJobPostsList = styled.ul`
    display: flex;
    flex-direction: column;
`;

export const JobPostsList = ({ children }: PropsWithChildren) => <StyledJobPostsList>{ children }</StyledJobPostsList>