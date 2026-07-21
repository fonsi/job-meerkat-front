import { createFileRoute } from '@tanstack/react-router';
import { IntentRouteView, intentRouteOptions } from '@/intent/intentRoute';

export const Route = createFileRoute('/highest-paying-remote-jobs')({
    ...intentRouteOptions('highest-paying-remote-jobs'),
    component: function HighestPayingRemoteJobsRoute() {
        return <IntentRouteView data={Route.useLoaderData()} />;
    },
});
