import { Metadata } from 'next';
import { TermsPage } from '@/pageComponents/terms/TermsPage';

export const metadata: Metadata = {
    title: 'Terms and Conditions | Jobmeerkat',
    description:
        'Terms and conditions for using Jobmeerkat services. Read our legal agreement covering company information ownership and job post accuracy.',
    openGraph: {
        title: 'Terms and Conditions | Jobmeerkat',
        type: 'website',
    },
};

export default function Page() {
    return <TermsPage />;
}
