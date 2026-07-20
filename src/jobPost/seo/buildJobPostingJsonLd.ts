import {
    JobPost,
    JobType,
    Period,
    Workplace,
} from '@/jobPost/http/getJobPosts';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';

const employmentTypeMap: Record<JobType, string | null> = {
    [JobType.FullTime]: 'FULL_TIME',
    [JobType.PartTime]: 'PART_TIME',
    [JobType.Contract]: 'CONTRACTOR',
    [JobType.Unknown]: null,
};

const unitTextMap: Record<Period, string> = {
    [Period.Year]: 'YEAR',
    [Period.Month]: 'MONTH',
    [Period.Week]: 'WEEK',
    [Period.Day]: 'DAY',
    [Period.Hour]: 'HOUR',
};

const toIsoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Google JobPosting JSON-LD for a job detail page. */
export const buildJobPostingJsonLd = (job: JobPost) => {
    const site = getSiteUrl();
    const url = `${site}/job/?slug=${encodeURIComponent(job.slug)}`;
    const employmentType = employmentTypeMap[job.type];
    const description = job.company?.name
        ? `${job.title} at ${job.company.name}. Remote job on Jobmeerkat with salary and workplace information.`
        : `${job.title}. Remote job on Jobmeerkat with salary and workplace information.`;

    const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org/',
        '@type': 'JobPosting',
        title: job.title,
        description,
        datePosted: toIsoDate(job.createdAt),
        url,
        directApply: false,
        hiringOrganization: {
            '@type': 'Organization',
            name: job.company.name,
            sameAs: `${site}/company/${encodeURIComponent(job.company.id)}/`,
            ...(job.company.logo?.url ? { logo: job.company.logo.url } : {}),
        },
        identifier: {
            '@type': 'PropertyValue',
            name: 'Jobmeerkat',
            value: job.id,
        },
    };

    if (job.closedAt != null) {
        jsonLd.validThrough = toIsoDate(job.closedAt);
    } else {
        // Open roles: hint an expiry ~90 days out so Google can refresh inventory.
        jsonLd.validThrough = toIsoDate(
            job.createdAt + 90 * 24 * 60 * 60 * 1000,
        );
    }

    if (employmentType) {
        jsonLd.employmentType = employmentType;
    }

    if (job.workplace === Workplace.Remote) {
        jsonLd.jobLocationType = 'TELECOMMUTE';
        if (job.location) {
            jsonLd.applicantLocationRequirements = {
                '@type': 'Country',
                name: job.location,
            };
        }
    } else if (job.location) {
        jsonLd.jobLocation = {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
            },
        };
    }

    if (job.salaryRange) {
        const { min, max, currency, period } = job.salaryRange;
        jsonLd.baseSalary = {
            '@type': 'MonetaryAmount',
            currency,
            value: {
                '@type': 'QuantitativeValue',
                ...(min != null ? { minValue: min } : {}),
                value: max,
                unitText: unitTextMap[period],
            },
        };
    }

    return jsonLd;
};
