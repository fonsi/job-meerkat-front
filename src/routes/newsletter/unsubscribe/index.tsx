import { createFileRoute } from '@tanstack/react-router';
import { UnsubscribeNewsletterPage } from '@/pageComponents/newsletter/UnsubscribeNewsletterPage';

type UnsubscribeSearch = {
    t?: string;
};

export const Route = createFileRoute('/newsletter/unsubscribe/')({
    validateSearch: (search: Record<string, unknown>): UnsubscribeSearch => {
        const raw = search.t;
        if (typeof raw !== 'string' || !raw.trim()) {
            return { t: undefined };
        }

        return { t: raw.trim() };
    },
    component: UnsubscribeRoute,
});

function UnsubscribeRoute() {
    const { t } = Route.useSearch();

    return <UnsubscribeNewsletterPage token={t} />;
}
