'use client';

import { PageHeader } from '@/shared/layout/PageHeader';

type Props = {
    title: string;
    description: string;
    resultLabel: string;
};

export const IntentHeader = ({ title, description, resultLabel }: Props) => (
    <PageHeader
        align="center"
        title={title}
        description={description}
        meta={resultLabel}
        cta={{ to: '/newsletter/', label: 'Get daily job alerts' }}
    />
);
