import { createFileRoute } from '@tanstack/react-router';
import { IntentRouteView, intentRouteOptions } from '@/intent/intentRoute';

export const Route = createFileRoute('/remote-jobs-with-salary')({
    ...intentRouteOptions('remote-jobs-with-salary'),
    component: function RemoteJobsWithSalaryRoute() {
        return <IntentRouteView data={Route.useLoaderData()} />;
    },
});
