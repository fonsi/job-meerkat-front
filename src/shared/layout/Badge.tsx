'use client';

import styled from 'styled-components';
import { Colors } from '../styles/constants';

const StyledBadge = styled.span`
    align-items: center;
    background-color: ${Colors.brokenWhite};
    border-radius: 4px;
    color: ${Colors.brokenBlack};
    display: flex;
    font-size: 12px;
    padding: 4px 8px;
`;

export const Badge = StyledBadge;
