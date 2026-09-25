'use client';

import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { Company, createCompanyLink } from '@/company/company';
import { CompanyImage } from '@/company/layout/CompanyImage';
import { Colors, Device } from '@/shared/styles/constants';
import {
    HomeSection,
    SectionEyebrow,
    SectionHead,
    SectionIntro,
    SectionTitle,
} from './homeLayout';
import { HomeTiltCard, HomeTiltRoot } from './homeTiltCard';

type Props = {
    companies: Company[];
};

const HeaderExtras = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media ${Device.tablet} {
        align-items: flex-end;
        justify-self: end;
        text-align: right;
    }
`;

const Intro = styled(SectionIntro)`
    @media ${Device.tablet} {
        justify-self: auto;
    }
`;

const AllLink = styled(Link).attrs({ reloadDocument: true })`
    color: ${Colors.accent};
    font-size: 14px;
    font-weight: 700;

    &:hover {
        color: ${Colors.lightGrey};
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const Grid = styled.ul`
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
    list-style: none;

    @media (max-width: 599px) {
        grid-template-columns: 1fr;
    }

    @media ${Device.laptop} {
        grid-template-columns: repeat(6, 1fr);
    }
`;

const Item = styled.li<{ $featured?: boolean }>`
    @media ${Device.laptop} {
        grid-column: ${({ $featured }) => ($featured ? 'span 2' : 'span 1')};
    }
`;

const CompanyCard = styled(Link).attrs({ reloadDocument: true })<{
    $featured?: boolean;
}>`
    background:
        linear-gradient(
            155deg,
            rgba(214, 255, 63, 0.06),
            rgba(255, 255, 255, 0.02) 42%,
            transparent 72%
        ),
        ${Colors.brokenBlack};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 18px;
    height: 100%;
    min-height: 150px;
    padding: 22px;
    position: relative;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;

    @media ${Device.laptop} {
        align-items: ${({ $featured }) =>
            $featured ? 'center' : 'flex-start'};
        flex-direction: ${({ $featured }) => ($featured ? 'row' : 'column')};
        gap: ${({ $featured }) => ($featured ? '18px' : '14px')};
        min-height: ${({ $featured }) => ($featured ? '150px' : '148px')};
        padding: ${({ $featured }) => ($featured ? '22px' : '16px')};
    }

    ${HomeTiltRoot}[data-tilting='true'] & {
        background:
            linear-gradient(
                155deg,
                rgba(214, 255, 63, 0.1),
                rgba(255, 255, 255, 0.03) 42%,
                transparent 72%
            ),
            ${Colors.darkGrey};
        border-color: rgba(214, 255, 63, 0.45);
        box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        text-decoration: none;
    }

    &:hover {
        text-decoration: none;
    }

    &:focus-visible {
        outline: 2px solid ${Colors.accent};
        outline-offset: 2px;
    }
`;

const Texts = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
`;

const Name = styled.span<{ $featured?: boolean }>`
    font-size: 20px;
    font-weight: 700;
    line-height: 1.15;

    @media ${Device.laptop} {
        font-size: ${({ $featured }) => ($featured ? '24px' : '15px')};
    }
`;

const Count = styled.span`
    color: ${Colors.mediumGrey};
    font-size: 13px;
`;

const CountAccent = styled.span`
    color: ${Colors.accent};
    font-weight: 700;
`;

export const HomeFeaturedCompanies = ({ companies }: Props) => {
    if (companies.length === 0) return null;

    return (
        <HomeSection>
            <SectionHead>
                <div>
                    <SectionEyebrow>Companies</SectionEyebrow>
                    <SectionTitle>Hiring right now</SectionTitle>
                </div>
                <HeaderExtras>
                    <Intro>Employers actively posting on Jobmeerkat.</Intro>
                    <AllLink to="/companies/">View all companies</AllLink>
                </HeaderExtras>
            </SectionHead>
            <Grid>
                {companies.map((company, index) => {
                    const featured =
                        index === 0 || index === companies.length - 1;

                    return (
                        <Item key={company.id} $featured={featured}>
                            <HomeTiltCard>
                                <CompanyCard
                                    $featured={featured}
                                    to={createCompanyLink({
                                        companyId: company.id,
                                    })}
                                >
                                    <CompanyImage
                                        company={company}
                                        $width={100}
                                        $height={48}
                                        $sameSize
                                    />
                                    <Texts>
                                        <Name $featured={featured}>
                                            {company.name}
                                        </Name>
                                        <Count>
                                            <CountAccent>
                                                {company.jobPostsCount}
                                            </CountAccent>
                                            {` open job${company.jobPostsCount === 1 ? '' : 's'}`}
                                        </Count>
                                    </Texts>
                                </CompanyCard>
                            </HomeTiltCard>
                        </Item>
                    );
                })}
            </Grid>
        </HomeSection>
    );
};
