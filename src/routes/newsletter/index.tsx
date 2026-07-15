import { createFileRoute } from '@tanstack/react-router';
import { JoinNewsletterPage } from '@/pageComponents/newsletter/JoinNewsletterPage';

export const Route = createFileRoute('/newsletter/')({
    component: JoinNewsletterPage,
});
