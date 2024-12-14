import styled from 'styled-components';
import Image from 'next/image';
import { Company } from '../company'
import { placeholder } from '@/shared/image/placeholder';
import { Device } from '@/shared/styles/constants';

type Props = {
    company: Omit<Company, 'homePage'>;
    $width?: number;
}

const StyledCompanyImage = styled.div<{ $bg?: string, $width?: number }>`
    background-color: ${({ $bg }) => $bg ?? 'transparent' };
    flex-shrink: 0;
    position: relative;
    width: ${ ({ $width }) => $width ? `${$width / 2}px` : '50px'};

    @media ${Device.tablet} { 
        width: ${ ({ $width }) => $width  ? `${$width}px` :  '100px'};
    }

    img {
        object-fit: contain;
        padding: 4px;
    }
`;

export const CompanyImage = ({ company, $width }: Props) =>
    <StyledCompanyImage $bg={ company.logo?.background } $width={$width}>
        <Image
            alt={`${company.name} logo`}
            fill={true}
            src={company.logo?.url}
            placeholder='empty'
            blurDataURL={placeholder}
            onError={(props) => {
                props.currentTarget.src = placeholder;
            }}
        />
    </StyledCompanyImage>