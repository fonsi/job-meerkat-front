export const HOME_META = {
    title: 'Jobmeerkat | Remote job board with salaries tracked daily',
    description:
        'Discover remote jobs and transparent employers on Jobmeerkat. Browse focused collections, explore categories, and get daily alerts when new roles appear.',
};

export const buildHomeJsonLd = (siteUrl: string) => {
    const site = siteUrl.replace(/\/$/, '');

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${site}/#organization`,
                name: 'Jobmeerkat',
                url: `${site}/`,
                logo: `${site}/logo-black.svg`,
            },
            {
                '@type': 'WebSite',
                '@id': `${site}/#website`,
                name: 'Jobmeerkat',
                url: `${site}/`,
                publisher: { '@id': `${site}/#organization` },
                description: HOME_META.description,
            },
        ],
    };
};
