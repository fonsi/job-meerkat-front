import { createFileRoute } from '@tanstack/react-router';
import { IntentRouteView, intentRouteOptions } from '@/intent/intentRoute';

export const Route = createFileRoute('/remote-engineering-jobs-with-salary')({
    ...intentRouteOptions('remote-engineering-jobs-with-salary'),
    component: function RemoteEngineeringJobsWithSalaryRoute() {
        return <IntentRouteView data={Route.useLoaderData()} />;
    },
});
