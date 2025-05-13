import { PrivacyPage } from '@/pageComponents/privacy/PrivacyPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Jobmeerkat',
    description:
        "Learn about Jobmeerkat's privacy practices, including our use of cookies, analytics, and how we protect your data. Find information about Google Analytics, Google Ads, and how to manage your cookie preferences.",
    openGraph: {
        title: 'Privacy Policy | Jobmeerkat',
        description:
            "Learn about Jobmeerkat's privacy practices, including our use of cookies, analytics, and how we protect your data.",
        type: 'website',
    },
};

export default PrivacyPage;
