import { createFileRoute } from '@tanstack/react-router';
import { ConfirmNewsletterPage } from '@/pageComponents/newsletter/ConfirmNewsletterPage';

type ConfirmSearch = {
    token?: string;
};

export const Route = createFileRoute('/newsletter/confirm/')({
    validateSearch: (search: Record<string, unknown>): ConfirmSearch => {
        const raw = search.token;
        if (typeof raw !== 'string' || !raw.trim()) {
            return { token: undefined };
        }

        return { token: raw.trim() };
    },
    head: () => ({
        meta: [
            { title: 'Confirm newsletter | Jobmeerkat' },
            { name: 'robots', content: 'noindex,nofollow' },
        ],
    }),
    component: ConfirmRoute,
});

function ConfirmRoute() {
    const { token } = Route.useSearch();

    return <ConfirmNewsletterPage token={token} />;
}
