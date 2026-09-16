import { JobPost, JobPostDetails } from '@/jobPost/http/getJobPosts';

export const JOB_POST_DETAIL_SECTIONS = [
    { key: 'summary', title: 'About this role', kind: 'text' },
    { key: 'company', title: 'About the company', kind: 'text' },
    { key: 'team', title: 'The team', kind: 'text' },
    { key: 'stack', title: 'Stack', kind: 'chips' },
    { key: 'responsibilities', title: "What you'll do", kind: 'list' },
    { key: 'requirements', title: "What we're looking for", kind: 'list' },
    { key: 'niceToHave', title: 'Nice to have', kind: 'list' },
    { key: 'benefits', title: 'Benefits', kind: 'list' },
    { key: 'hiringProcess', title: 'Hiring process', kind: 'list' },
] as const;

type DetailSectionDef = (typeof JOB_POST_DETAIL_SECTIONS)[number];
type TextSectionKey = Extract<DetailSectionDef, { kind: 'text' }>['key'];
type ListSectionKey = Extract<
    DetailSectionDef,
    { kind: 'list' | 'chips' }
>['key'];

export type VisibleJobPostDetailSection =
    | { key: TextSectionKey; title: string; kind: 'text'; value: string }
    | {
          key: ListSectionKey;
          title: string;
          kind: 'list' | 'chips';
          value: string[];
      };

const trimmedText = (value: string | undefined): string | null => {
    const text = value?.trim();

    return text ? text : null;
};

const trimmedList = (value: string[] | undefined): string[] | null => {
    if (!Array.isArray(value)) return null;
    const items = value.map((item) => item.trim()).filter(Boolean);

    return items.length ? items : null;
};

const resolveTextValue = (
    jobPost: JobPost,
    key: TextSectionKey,
): string | null => {
    if (key === 'company') return trimmedText(jobPost.company.description);

    return trimmedText(jobPost.details?.[key]);
};

export const getVisibleJobPostDetailSections = (
    jobPost: JobPost,
): VisibleJobPostDetailSection[] => {
    const details: JobPostDetails | undefined = jobPost.details;
    const sections: VisibleJobPostDetailSection[] = [];

    for (const section of JOB_POST_DETAIL_SECTIONS) {
        if (section.kind === 'text') {
            const value = resolveTextValue(jobPost, section.key);
            if (value) sections.push({ ...section, value });
            continue;
        }

        const value = trimmedList(details?.[section.key]);
        if (value) sections.push({ ...section, value });
    }

    return sections;
};
