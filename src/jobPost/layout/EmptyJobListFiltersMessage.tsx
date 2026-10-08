'use client';

import styled from 'styled-components';
import { Mascot } from '@/shared/image/Mascot';
import { Colors } from '@/shared/styles/constants';

const Wrap = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 8px 0 24px;
`;

const MascotWrap = styled.div`
    max-width: 96px;
    width: 100%;

    img {
        display: block;
        height: auto;
        width: 100%;
    }
`;

const Message = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
`;

type Props = {
    className?: string;
};

export const EmptyJobListFiltersMessage = ({ className }: Props) => (
    <Wrap className={className} role="status">
        <MascotWrap>
            <Mascot pose="sleeping" alt="" />
        </MascotWrap>
        <Message>
            No job offers match these filters. Try widening salary or workplace.
        </Message>
    </Wrap>
);
