import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { Company } from '../company';
import { placeholder } from '@/shared/image/placeholder';
import { Device } from '@/shared/styles/constants';

type Props = {
    company: Omit<Company, 'homePage'>;
    $width?: number;
    /**
     * Defaults to `$width` (fixed square). Pass a smaller height to allow
     * wordmarks to grow up to `$width` while icon logos stay tight.
     */
    $height?: number;
    /** When true, sm and lg use the same pixel size (no /2 on small screens). */
    $sameSize?: boolean;
    className?: string;
};

const sizePx = (
    size: number | undefined,
    sameSize?: boolean,
    fallback = 50,
) => {
    if (size == null) return `${fallback}px`;
    return `${sameSize ? size : size / 2}px`;
};

const StyledCompanyImage = styled.div<{
    $bg?: string;
    $width?: number;
    $height?: number;
    $sameSize?: boolean;
    $fit?: boolean;
}>`
    background-color: ${({ $bg }) => $bg ?? 'transparent'};
    flex-shrink: 0;
    height: ${({ $width, $height, $sameSize }) =>
        sizePx($height ?? $width, $sameSize)};
    position: relative;

    ${({ $fit, $width, $height, $sameSize }) =>
        $fit
            ? css`
                  max-width: ${sizePx($width, $sameSize, 100)};
                  min-width: ${sizePx($height ?? $width, $sameSize)};
                  width: max-content;
              `
            : css`
                  width: ${sizePx($width, $sameSize)};
              `}

    @media ${Device.tablet} {
        height: ${({ $width, $height }) =>
            sizePx($height ?? $width, true, 100)};

        ${({ $fit, $width, $height }) =>
            $fit
                ? css`
                      max-width: ${sizePx($width, true, 100)};
                      min-width: ${sizePx($height ?? $width, true, 100)};
                      width: max-content;
                  `
                : css`
                      width: ${sizePx($width, true, 100)};
                  `}
    }

    img {
        display: block;
        height: 100%;
        object-fit: contain;
        object-position: left center;
        padding: 2px 0;

        ${({ $fit }) =>
            $fit
                ? css`
                      max-width: 100%;
                      width: auto;
                  `
                : css`
                      width: 100%;
                  `}
    }
`;

/** Matches size math below so critical CSS can size the box before styled-components runs. */
const companyLogoSizeVars = (
    $width?: number,
    $height?: number,
    $sameSize?: boolean,
): CSSProperties => {
    const wLg = $width != null ? $width : 100;
    const wSm = $width != null ? ($sameSize ? $width : $width / 2) : 50;
    const hLg = $height != null ? $height : wLg;
    const hSm = $height != null ? ($sameSize ? $height : $height / 2) : wSm;
    return {
        '--logo-w-sm': `${wSm}px`,
        '--logo-w-lg': `${wLg}px`,
        '--logo-h-sm': `${hSm}px`,
        '--logo-h-lg': `${hLg}px`,
    } as CSSProperties;
};

export const CompanyImage = ({
    company,
    $width,
    $height,
    $sameSize,
    className,
}: Props) => {
    const fit = $height != null && $width != null && $height < $width;

    return (
        <StyledCompanyImage
            className={className}
            data-company-logo
            data-logo-fit={fit ? '' : undefined}
            style={companyLogoSizeVars($width, $height, $sameSize)}
            $bg={company.logo?.background}
            $width={$width}
            $height={$height}
            $sameSize={$sameSize}
            $fit={fit}
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
};
