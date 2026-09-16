import styled from 'styled-components';
import { JobPost } from '@/jobPost/http/getJobPosts';
import { Badge } from '@/shared/layout/Badge';
import { Warning } from '@/shared/image/icons/Warning';
import { Colors } from '@/shared/styles/constants';
import { JobPostOriginalApplyLink } from '@/jobPost/layout/JobPostOriginalApplyLink';
import { getVisibleJobPostDetailSections } from './jobPostDetailSectionCatalog';

type Props = {
    jobPost: JobPost;
};

const Sections = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 24px;
`;

const Section = styled.section``;

const SectionTitle = styled.h2`
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
`;

const SectionText = styled.p`
    color: ${Colors.brokenWhite};
    font-size: 15px;
    font-weight: 300;
    line-height: 1.5;
    margin: 0;
`;

const SectionList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding-left: 18px;
`;

const NumberedSectionList = styled.ol`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding-left: 18px;
`;

const SectionListItem = styled.li`
    color: ${Colors.brokenWhite};
    font-size: 15px;
    font-weight: 300;
    line-height: 1.5;
`;

const ChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const noticeAmber = '#e8b84a';

const Disclaimer = styled.div`
    align-items: center;
    background-color: rgba(232, 184, 74, 0.12);
    border-radius: 4px;
    color: #ece5c2;
    display: flex;
    font-size: 13px;
    font-weight: 300;
    gap: 12px;
    line-height: 1.4;
    margin: 0;
    padding: 8px 12px;

    svg {
        color: ${noticeAmber};
        flex-shrink: 0;
        height: 18px;
        width: 18px;
    }
`;

const DisclaimerLink = styled(JobPostOriginalApplyLink)`
    color: #ece5c2;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
        color: ${noticeAmber};
    }
`;

export const JobPostDetailSections = ({ jobPost }: Props) => {
    const sections = getVisibleJobPostDetailSections(jobPost);

    if (!sections.length) return null;

    return (
        <Sections>
            <Disclaimer>
                <Warning />
                <span>
                    These details were extracted automatically from the original
                    listing. They may not be complete or fully up to date — it's
                    worth checking the{' '}
                    <DisclaimerLink jobPost={jobPost}>
                        original job post
                    </DisclaimerLink>
                    .
                </span>
            </Disclaimer>
            {sections.map((section) => (
                <Section key={section.key}>
                    <SectionTitle>{section.title}</SectionTitle>
                    {section.kind === 'text' ? (
                        <SectionText>{section.value}</SectionText>
                    ) : section.kind === 'chips' ? (
                        <ChipRow>
                            {section.value.map((item) => (
                                <Badge key={item}>{item}</Badge>
                            ))}
                        </ChipRow>
                    ) : section.key === 'hiringProcess' ? (
                        <NumberedSectionList>
                            {section.value.map((item, index) => (
                                <SectionListItem key={`${item}-${index}`}>
                                    {item}
                                </SectionListItem>
                            ))}
                        </NumberedSectionList>
                    ) : (
                        <SectionList>
                            {section.value.map((item, index) => (
                                <SectionListItem key={`${item}-${index}`}>
                                    {item}
                                </SectionListItem>
                            ))}
                        </SectionList>
                    )}
                </Section>
            ))}
        </Sections>
    );
};
