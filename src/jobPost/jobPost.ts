import { CompanyLogo } from '@/company/company';

export enum JobType {
    FullTime = 'fullTime',
    PartTime = 'partTime',
    Contract = 'contract',
    Unknown = 'unknown',
}
export enum Workplace {
    Remote = 'remote',
    OnSite = 'onSite',
    Hybrid = 'hybrid',
    Unknown = 'unknown',
}
export enum Period {
    Year = 'year',
    Month = 'month',
    Week = 'week',
    Day = 'day',
    Hour = 'hour',
}
export type SalaryRange = {
    min?: number;
    max: number;
    currency: string;
    period: Period;
};

export type JobPost = {
    id: string;
    title: string;
    url: string;
    type: JobType;
    company: {
        id: string;
        name: string;
        logo: CompanyLogo;
    };
    salaryRange: SalaryRange | null;
    workplace: Workplace;
    location: string;
    createdAt: number;
    category: string;
    slug: string;
};
