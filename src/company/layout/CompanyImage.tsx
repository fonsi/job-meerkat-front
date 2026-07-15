import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { Company } from '../company';
import { placeholder } from '@/shared/image/placeholder';
import { Device } from '@/shared/styles/constants';

type Props = {
    company: Omit<Company, 'homePage'>;
    $width?: number;
    /** When true, sm and lg use the same pixel size (no /2 on small screens). */
    $sameSize?: boolean;
    className?: string;
};

const StyledCompanyImage = styled.div<{
    $bg?: string;
    $width?: number;
    $sameSize?: boolean;
}>`
    background-color: ${({ $bg }) => $bg ?? 'transparent'};
    flex-shrink: 0;
    position: relative;
    width: ${({ $width, $sameSize }) =>
        $width ? `${$sameSize ? $width : $width / 2}px` : '50px'};

    @media ${Device.tablet} {
        width: ${({ $width }) => ($width ? `${$width}px` : '100px')};
    }

    img {
        height: 100%;
        object-fit: contain;
        padding: 4px;
        width: 100%;
    }
`;

/** Matches width math below so critical CSS can size the box before styled-components runs. */
const companyLogoSizeVars = (
    $width?: number,
    $sameSize?: boolean,
): CSSProperties => {
    const wLg = $width != null ? $width : 100;
    const wSm = $width != null ? ($sameSize ? $width : $width / 2) : 50;
    return {
        '--logo-w-sm': `${wSm}px`,
        '--logo-w-lg': `${wLg}px`,
    } as CSSProperties;
};

export const CompanyImage = ({
    company,
    $width,
    $sameSize,
    className,
}: Props) => (
    <StyledCompanyImage
        className={className}
        data-company-logo
        style={companyLogoSizeVars($width, $sameSize)}
        $bg={company.logo?.background}
        $width={$width}
        $sameSize={$sameSize}
    >
        <img
            alt={`${company.name} logo`}
            src={company.logo?.url || placeholder}
            onError={(props) => {
                props.currentTarget.src = placeholder;
            }}
        />
    </StyledCompanyImage>
);
