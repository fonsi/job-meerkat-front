export type IntentSlug =
    | 'remote-jobs-with-salary'
    | 'remote-engineering-jobs-with-salary'
    | 'remote-product-jobs-with-salary'
    | 'highest-paying-remote-jobs'
    | 'companies-that-post-salaries';

export type IntentKind = 'jobs' | 'companies';

export type IntentDefinition = {
    slug: IntentSlug;
    path: `/${IntentSlug}/`;
    kind: IntentKind;
    title: string;
    h1: string;
    description: string;
};

export const INTENT_DEFINITIONS: IntentDefinition[] = [
    {
        slug: 'remote-jobs-with-salary',
        path: '/remote-jobs-with-salary/',
        kind: 'jobs',
        title: 'Remote Jobs with Public Salaries | Jobmeerkat',
        h1: 'Remote Jobs with Public Salaries',
        description:
            'Browse remote jobs that show pay upfront. Updated daily from companies tracked on Jobmeerkat.',
    },
    {
        slug: 'remote-engineering-jobs-with-salary',
        path: '/remote-engineering-jobs-with-salary/',
        kind: 'jobs',
        title: 'Remote Engineering Jobs with Public Salaries | Jobmeerkat',
        h1: 'Remote Engineering Jobs with Public Salaries',
        description:
            'Find remote engineering roles with public salaries — frontend, backend, fullstack, and more on Jobmeerkat.',
    },
    {
        slug: 'remote-product-jobs-with-salary',
        path: '/remote-product-jobs-with-salary/',
        kind: 'jobs',
        title: 'Remote Product, Design & Marketing Jobs with Salaries | Jobmeerkat',
        h1: 'Remote Product Jobs with Public Salaries',
        description:
            'Remote product, design, and marketing roles with public salaries. Browse open positions on Jobmeerkat.',
    },
    {
        slug: 'highest-paying-remote-jobs',
        path: '/highest-paying-remote-jobs/',
        kind: 'jobs',
        title: 'Highest Paying Remote Jobs | Jobmeerkat',
        h1: 'Highest Paying Remote Jobs',
        description:
            'See the highest paying remote jobs with public salaries right now on Jobmeerkat.',
    },
    {
        slug: 'companies-that-post-salaries',
        path: '/companies-that-post-salaries/',
        kind: 'companies',
        title: 'Companies That Post Salaries | Jobmeerkat',
        h1: 'Companies That Post Salaries',
        description:
            'Explore companies that publish pay in their remote job posts. Tracked on Jobmeerkat.',
    },
];

export const INTENT_PATHS = INTENT_DEFINITIONS.map((intent) => intent.path);

export const getIntentBySlug = (slug: string): IntentDefinition | null =>
    INTENT_DEFINITIONS.find((intent) => intent.slug === slug) ?? null;
