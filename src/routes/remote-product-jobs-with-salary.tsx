import { createFileRoute } from '@tanstack/react-router';
import { IntentRouteView, intentRouteOptions } from '@/intent/intentRoute';

export const Route = createFileRoute('/remote-product-jobs-with-salary')({
    ...intentRouteOptions('remote-product-jobs-with-salary'),
    component: function RemoteProductJobsWithSalaryRoute() {
        return <IntentRouteView data={Route.useLoaderData()} />;
    },
});
