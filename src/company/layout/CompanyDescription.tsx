'use client';

import styled from 'styled-components';
import { Colors, Device } from '@/shared/styles/constants';

type Props = {
    description: string;
};

const Description = styled.p`
    color: ${Colors.lightGrey};
    font-size: 15px;
    line-height: 1.55;
    margin: 0;

    @media ${Device.tablet} {
        font-size: 16px;
    }
`;

export const CompanyDescription = ({ description }: Props) => (
    <Description>{description}</Description>
);
