import { renderToStaticMarkup } from 'react-dom/server';
import {
    createMemoryHistory,
    createRootRoute,
    createRouter,
    RouterContextProvider,
} from '@tanstack/react-router';
import { ServerStyleSheet } from 'styled-components';
import { type JobPost } from '@/jobPost/http/getJobPosts';
import { JobPostSsrDocument } from '@/ssr/jobPostSsrDocument';

type Props = {
    job: JobPost | null;
    slug: string | null;
};

const createSsrRouter = () => {
    const rootRoute = createRootRoute({ component: () => null });

    return createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory({ initialEntries: ['/'] }),
    });
};

export const renderJobPostHtml = ({ job, slug }: Props): string => {
    const router = createSsrRouter();
    const sheet = new ServerStyleSheet();

    try {
        let html = renderToStaticMarkup(
            sheet.collectStyles(
                <RouterContextProvider router={router}>
                    <JobPostSsrDocument job={job} slug={slug} />
                </RouterContextProvider>,
            ),
        );
        const styleTags = sheet.getStyleTags();
        if (styleTags) {
            html = html.replace('</head>', `${styleTags}</head>`);
        }

        return `<!DOCTYPE html>${html}`;
    } finally {
        sheet.seal();
    }
};
