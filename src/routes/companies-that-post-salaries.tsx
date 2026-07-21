import { createFileRoute } from '@tanstack/react-router';
import { IntentRouteView, intentRouteOptions } from '@/intent/intentRoute';

export const Route = createFileRoute('/companies-that-post-salaries')({
    ...intentRouteOptions('companies-that-post-salaries'),
    component: function CompaniesThatPostSalariesRoute() {
        return <IntentRouteView data={Route.useLoaderData()} />;
    },
});
