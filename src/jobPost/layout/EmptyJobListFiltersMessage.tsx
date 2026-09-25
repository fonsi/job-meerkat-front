'use client';

import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';

const Message = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    line-height: 1.5;
    margin: 8px 0 24px;
    padding: 0;
`;

type Props = {
    className?: string;
};

export const EmptyJobListFiltersMessage = ({ className }: Props) => (
    <Message className={className} role="status">
        No job offers match these filters. Try widening salary or workplace.
    </Message>
);
