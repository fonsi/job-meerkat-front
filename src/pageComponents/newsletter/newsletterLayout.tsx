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

export const CompanyOption = styled.div<{ $selected: boolean }>`
    align-items: stretch;
    background: transparent;
    border: 1px solid ${Colors.darkGrey};
    border-radius: 4px;
    color: ${Colors.lightGrey};
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    opacity: ${(props) => (props.$selected ? 1 : 0.4)};
    padding: 8px 10px;
    transition:
        border-color 0.15s ease,
        opacity 0.15s ease;

    &:hover {
        border-color: ${Colors.mediumGrey};
        opacity: 1;
    }

    input {
        accent-color: ${Colors.white};
        flex-shrink: 0;
    }
`;

export const CompanyOptionMain = styled.label`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: 8px;
    min-width: 0;
    width: 100%;
`;

export const CompanyOptionAction = styled.button`
    align-self: flex-start;
    background: none;
    border: none;
    color: ${Colors.mediumGrey};
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    text-align: left;
    text-decoration: underline;

    &:hover {
        color: ${Colors.white};
    }
`;

export const CompanyRuleSection = styled.div`
    background: ${Colors.darkGrey};
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0 0 16px;
    min-width: 0;
    padding: 0;
`;

export const CompanyRuleHeader = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
`;

export const CompanyRuleIdentity = styled.div`
    align-items: center;
    display: flex;
    flex: 1;
    gap: 8px;
    min-width: 0;
`;

export const CompanyRuleActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

export const RuleAction = styled.button`
    background: transparent;
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 4px;
    color: ${Colors.lightGrey};
    cursor: pointer;
    font-size: 12px;
    padding: 4px 8px;

    &:hover {
        border-color: ${Colors.lightGrey};
        color: ${Colors.white};
    }
`;

export const RuleActionDanger = styled(RuleAction)`
    border-color: ${Colors.red};
    color: ${Colors.red};

    &:hover {
        border-color: ${Colors.white};
        color: ${Colors.white};
    }
`;

export const CompanyRuleHint = styled.p`
    color: ${Colors.mediumGrey};
    font-size: 13px;
    margin: 0 0 12px;
`;

export const FilterRow = styled.div`
    border-top: 1px solid ${Colors.brokenBlack};
    display: grid;
    gap: 8px;
    padding: 12px;
`;

export const FilterRowMain = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;

    @media ${Device.tablet} {
        grid-template-columns: 9rem minmax(0, 1fr);
    }
`;

export const FilterRowLabel = styled.div`
    color: ${Colors.white};
    font-size: 13px;
    font-weight: 600;
`;

export const FilterSelect = styled.select`
    background: ${Colors.brokenBlack};
    border: 1px solid ${Colors.mediumGrey};
    border-radius: 4px;
    color: ${Colors.white};
    font-size: 13px;
    max-width: 100%;
    padding: 6px 8px;
`;

export const FilterRowExtra = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    @media ${Device.tablet} {
        margin-left: 9rem;
    }
`;

export const DimensionLabel = styled.div`
    color: ${Colors.white};
    font-size: 13px;
    font-weight: 600;
    margin-top: 12px;
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
