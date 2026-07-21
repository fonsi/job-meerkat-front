import { JobPost, Period, SalaryRange } from '@/jobPost/http/getJobPosts';

const DAY_MS = 24 * 60 * 60 * 1000;

const toAnnual = (salary: number, period: Period): number => {
    switch (period) {
        case Period.Year:
            return salary;
        case Period.Month:
            return salary * 12;
        case Period.Week:
            return salary * 52;
        case Period.Day:
            return salary * 260;
        case Period.Hour:
            return salary * 2080;
        default:
            return salary;
    }
};

const salaryMidpoint = (salaryRange: SalaryRange): number => {
    const max = toAnnual(salaryRange.max, salaryRange.period);
    if (salaryRange.min == null) {
        return max;
    }
    return (toAnnual(salaryRange.min, salaryRange.period) + max) / 2;
};

const median = (values: number[]): number | null => {
    if (values.length === 0) {
        return null;
    }
    const sorted = [...values].toSorted((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
};

export type CompanyCategoryCount = {
    category: string;
    count: number;
};

export type CompanySalaryStats = {
    currency: string;
    min: number;
    max: number;
    median: number;
    jobsWithSalary: number;
};

export type CompanyJobStats = {
    openCount: number;
    categories: CompanyCategoryCount[];
    salary: CompanySalaryStats | null;
    postedLast30Days: number;
};

const buildSalaryStats = (jobs: JobPost[]): CompanySalaryStats | null => {
    const withSalary = jobs.filter((job) => job.salaryRange != null);
    if (withSalary.length === 0) {
        return null;
    }

    const currencyCounts = new Map<string, number>();
    for (const job of withSalary) {
        const currency = job.salaryRange!.currency.toUpperCase();
        currencyCounts.set(currency, (currencyCounts.get(currency) ?? 0) + 1);
    }

    let dominantCurrency = 'USD';
    let dominantCount = 0;
    for (const [currency, count] of currencyCounts) {
        if (count > dominantCount) {
            dominantCurrency = currency;
            dominantCount = count;
        }
    }

    const sameCurrency = withSalary.filter(
        (job) => job.salaryRange!.currency.toUpperCase() === dominantCurrency,
    );

    const annualMins: number[] = [];
    const annualMaxes: number[] = [];
    const midpoints: number[] = [];

    for (const job of sameCurrency) {
        const range = job.salaryRange!;
        const max = toAnnual(range.max, range.period);
        const min = range.min != null ? toAnnual(range.min, range.period) : max;
        annualMins.push(min);
        annualMaxes.push(max);
        midpoints.push(salaryMidpoint(range));
    }

    const medianValue = median(midpoints);
    if (medianValue == null) {
        return null;
    }

    return {
        currency: dominantCurrency,
        min: Math.min(...annualMins),
        max: Math.max(...annualMaxes),
        median: medianValue,
        jobsWithSalary: sameCurrency.length,
    };
};

export const getCompanyJobStats = (
    jobPosts: JobPost[],
    now = Date.now(),
): CompanyJobStats => {
    const openJobs = jobPosts.filter((job) => job.closedAt == null);

    const categoryMap = new Map<string, number>();
    for (const job of openJobs) {
        const key = job.category || 'other';
        categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
    }

    const categories = [...categoryMap.entries()]
        .map(([category, count]) => ({ category, count }))
        .toSorted(
            (a, b) => b.count - a.count || a.category.localeCompare(b.category),
        );

    return {
        openCount: openJobs.length,
        categories,
        salary: buildSalaryStats(openJobs),
        postedLast30Days: openJobs.filter(
            (job) => now - job.createdAt < 30 * DAY_MS,
        ).length,
    };
};

/** Compact salary for meta / UI, e.g. `90K USD`. */
export const formatSalaryCompact = (
    amount: number,
    currency: string,
): string => {
    const rounded =
        amount >= 1000
            ? `${Math.round(amount / 1000)}K`
            : `${Math.round(amount)}`;
    return `${rounded} ${currency}`;
};

export const buildCompanyMetaDescription = ({
    companyName,
    stats,
    companyDescription,
}: {
    companyName: string;
    stats: CompanyJobStats;
    companyDescription?: string | null;
}): string => {
    const statsDescription = (() => {
        if (stats.openCount === 0) {
            return `Discover remote roles at ${companyName} with public salaries and flexible options.`;
        }

        const rolePart = `${stats.openCount} remote role${stats.openCount === 1 ? '' : 's'}`;
        if (stats.salary) {
            const { min, max, currency } = stats.salary;
            return `Explore ${rolePart} at ${companyName}. Public salaries from ${formatSalaryCompact(min, currency)}–${formatSalaryCompact(max, currency)} / year on Jobmeerkat.`;
        }

        return `Explore ${rolePart} at ${companyName} with public salaries on Jobmeerkat.`;
    })();

    const blurb = companyDescription?.trim();
    if (!blurb) {
        return statsDescription;
    }

    const combined = `${blurb} ${statsDescription}`;
    if (combined.length <= 160) {
        return combined;
    }

    return blurb.length <= 160 ? blurb : `${blurb.slice(0, 157)}...`;
};

export const buildCompanyMetaTitle = ({
    companyName,
    stats,
}: {
    companyName: string;
    stats: CompanyJobStats;
}): string => {
    if (stats.openCount === 0) {
        return `${companyName} open positions | Jobmeerkat`;
    }

    if (stats.salary) {
        const { min, max, currency } = stats.salary;
        return `${companyName} — ${stats.openCount} remote roles, ${formatSalaryCompact(min, currency)}–${formatSalaryCompact(max, currency)} | Jobmeerkat`;
    }

    return `${companyName} — ${stats.openCount} remote roles | Jobmeerkat`;
};
