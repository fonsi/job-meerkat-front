'use client'

import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';

const StyledDiv = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 24px;
    justify-content: center;
    padding: 8px 0;
    width: 100%;
`;

export const Header = () => <StyledDiv>Jobmeerkat</StyledDiv>;