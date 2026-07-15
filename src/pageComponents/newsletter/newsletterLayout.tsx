'use client';

import styled from 'styled-components';
import { Link } from '@tanstack/react-router';
import { Company } from '@/company/company';
import { CompanyImage } from '@/company/layout/CompanyImage';
import { Container } from '@/shared/layout/Container';
import { Colors, Device } from '@/shared/styles/constants';
import { OpenInNew } from '@/shared/image/icons/OpenInNew';

export const NewsletterPageWrapper = styled.div`
    max-width: 48rem;
    margin: 0 auto;
    padding: 2rem 1rem;
`;

export const NewsletterTitle = styled.h1`
    color: ${Colors.white};
    font-size: 2rem;
    margin-bottom: 2.5rem;
    text-align: center;
`;

export const SettingsHeader = styled.div`
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    margin-bottom: 2.5rem;
`;

export const SettingsTitleBlock = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

export const SettingsTitle = styled.h1`
    color: ${Colors.white};
    font-size: 2rem;
    margin: 0;
    text-align: left;
`;

export const SettingsEmail = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 14px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const NewsletterText = styled.p`
    color: ${Colors.lightGrey};
    line-height: 1.6;
    margin-bottom: 1rem;
`;

export const NewsletterBanner = styled.p<{ $variant?: 'error' | 'success' }>`
    background: ${(props) =>
        props.$variant === 'error' ? '#4a1f1f' : '#1f3a2a'};
    border-radius: 4px;
    color: ${Colors.white};
    margin-bottom: 1rem;
    padding: 12px;
`;

export const CategoryColumns = styled.div`
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;

    @media ${Device.tablet} {
        grid-template-columns: 1fr 1fr;
    }
`;

export const CategoryColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const CategoryGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const CategoryGroupTitle = styled.div`
    color: ${Colors.mediumGrey};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
`;

export const CheckboxRow = styled.label`
    align-items: center;
    color: ${Colors.lightGrey};
    display: flex;
    gap: 8px;
`;

export const CompanyGrid = styled.div`
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr;

    @media ${Device.mobileL} {
        grid-template-columns: repeat(2, 1fr);
    }

    @media ${Device.tablet} {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const CompanyOption = styled.label<{ $selected: boolean }>`
    align-items: center;
    background: ${(props) =>
        props.$selected ? Colors.darkGrey : 'transparent'};
    border: 1px solid
        ${(props) => (props.$selected ? Colors.lightGrey : Colors.darkGrey)};
    border-radius: 4px;
    color: ${Colors.lightGrey};
    cursor: pointer;
    display: flex;
    gap: 8px;
    min-width: 0;
    padding: 8px 10px;
    transition:
        background-color 0.15s ease,
        border-color 0.15s ease;

    &:hover {
        background: ${Colors.darkGrey};
        border-color: ${Colors.mediumGrey};
    }

    input {
        accent-color: ${Colors.white};
        flex-shrink: 0;
    }
`;

export const CompanyOptionImage = ({
    company,
}: {
    company: Omit<Company, 'homePage'>;
}) => <CompanyImage company={company} $width={40} $sameSize />;

export const CompanyOptionTexts = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

export const CompanyOptionLink = styled(Link).attrs({
    reloadDocument: true,
    target: '_blank',
    rel: 'noopener noreferrer',
})`
    align-items: center;
    color: ${Colors.white};
    display: inline-flex;
    gap: 4px;
    max-width: 100%;
    min-width: 0;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }

    svg {
        flex-shrink: 0;
        height: 12px;
        width: 12px;
    }
`;

export const CompanyOptionName = styled.span`
    font-size: 13px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const CompanyOptionMeta = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 11px;
`;

export const CompanyOptionOpenIcon = OpenInNew;

export const Fieldset = styled.fieldset`
    border: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 0 16px;
    padding: 0;
`;

export const SettingsRow = styled.div`
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;
    margin-bottom: 16px;

    @media ${Device.tablet} {
        grid-template-columns: 1fr 1fr;
    }

    ${Fieldset} {
        margin-bottom: 0;
    }
`;

export const Legend = styled.legend`
    align-items: center;
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.white};
    display: flex;
    flex-wrap: wrap;
    font-size: 18px;
    font-weight: 600;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 4px;
    width: 100%;
`;

export const LegendAll = styled.label`
    align-items: center;
    color: ${Colors.lightGrey};
    cursor: pointer;
    display: inline-flex;
    font-size: 13px;
    font-weight: 400;
    gap: 6px;
`;

export const NewsletterContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <Container>
        <NewsletterPageWrapper>{children}</NewsletterPageWrapper>
    </Container>
);
