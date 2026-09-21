import {
    JobType,
    Workplace,
    type JobPost,
    type SalaryRange,
} from '@/jobPost/http/getJobPosts';
import { isProd } from '@/shared/environment/isProd';

/** `trailingSlash: 'always'` can append `/` after the query string; it may end up in `slug`. */
export const normalizeSlugParam = (raw: string): string =>
    raw.replace(/\/+$/, '').trim();

const compactAmount = (amount: number): string =>
    amount >= 1000 ? `${Math.round(amount / 1000)}K` : `${Math.round(amount)}`;

const jobTypeLabel = (type: JobType): string | null => {
    if (type === JobType.FullTime) return 'Full-time';
    if (type === JobType.PartTime) return 'Part-time';
    if (type === JobType.Contract) return 'Contract';

    return null;
};

const workplaceLabel = (workplace: Workplace): string | null => {
    if (workplace === Workplace.Remote) return 'Remote';
    if (workplace === Workplace.OnSite) return 'On-site';
    if (workplace === Workplace.Hybrid) return 'Hybrid';

    return null;
};

const formatSalaryForMeta = (salaryRange: SalaryRange): string | null => {
    const currency = salaryRange.currency.toUpperCase();
    const period = salaryRange.period;
    const min =
        salaryRange.min != null && salaryRange.min > 0 ? salaryRange.min : null;
    const max = salaryRange.max > 0 ? salaryRange.max : null;
    if (min != null && max != null) {
        return `${compactAmount(min)}–${compactAmount(max)} ${currency} / ${period}`;
    }
    if (max != null)
        return `Up to ${compactAmount(max)} ${currency} / ${period}`;
    if (min != null)
        return `From ${compactAmount(min)} ${currency} / ${period}`;

    return null;
};

const typeAndPlace = (job: JobPost): string | null => {
    const place = [workplaceLabel(job.workplace), job.location?.trim()]
        .filter(Boolean)
        .join(' — ');
    const clause = [jobTypeLabel(job.type), place].filter(Boolean).join(' · ');

    return clause || null;
};

const jobHeadline = (job: JobPost): string => {
    const company = job.company?.name?.trim();

    return company ? `${job.title} at ${company}` : job.title;
};

export const jobMetaTitle = (job: JobPost): string => {
    const salary = job.salaryRange
        ? formatSalaryForMeta(job.salaryRange)
        : null;
    const headline = jobHeadline(job);

    return `${salary ? `${headline} (${salary})` : headline} | Jobmeerkat`;
};

export const jobMetaDescription = (job: JobPost): string => {
    const salary = job.salaryRange
        ? formatSalaryForMeta(job.salaryRange)
        : null;
    const clauses = [jobHeadline(job), typeAndPlace(job), salary].filter(
        Boolean,
    );

    return `${clauses.join('. ')}.`;
};

export const buildJobPostSearchUrl = (site: string, slug: string): string =>
    `${site}/job/?slug=${encodeURIComponent(slug)}`;

export const buildJobPostPath = (slug: string): string =>
    `/jobpost/${encodeURIComponent(slug)}`;

export const buildJobPostPathUrl = (site: string, slug: string): string =>
    `${site}${buildJobPostPath(slug)}`;

export const jobPostRobotsContent = (isClosed: boolean): string =>
    !isProd || isClosed ? 'noindex,nofollow' : 'index,follow';
