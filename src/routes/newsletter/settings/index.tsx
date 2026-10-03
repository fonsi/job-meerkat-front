import { createFileRoute } from '@tanstack/react-router';
import { SettingsNewsletterPage } from '@/pageComponents/newsletter/SettingsNewsletterPage';

type SettingsSearch = {
    token?: string;
};

export const Route = createFileRoute('/newsletter/settings/')({
    validateSearch: (search: Record<string, unknown>): SettingsSearch => {
        const raw = search.token;
        if (typeof raw !== 'string' || !raw.trim()) {
            return { token: undefined };
        }

        return { token: raw.trim() };
    },
    head: () => ({
        meta: [
            { title: 'Newsletter settings | Jobmeerkat' },
            { name: 'robots', content: 'noindex,nofollow' },
        ],
    }),
    component: SettingsRoute,
});

function SettingsRoute() {
    const { token } = Route.useSearch();

    return <SettingsNewsletterPage token={token} />;
}
