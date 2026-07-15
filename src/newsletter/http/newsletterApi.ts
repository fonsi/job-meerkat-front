import { apiRequest, Method } from '@/shared/http/apiRequest';
import { ApiRequestError } from '@/shared/http/apiRequestError';
import {
    NewsletterPreferences,
    NewsletterPreferencesResponse,
    NewsletterTokenError,
} from '../newsletter';

export const subscribeNewsletter = (email: string) =>
    apiRequest<{ ok: true }, { email: string }>({
        path: '/newsletter/subscribe',
        method: Method.POST,
        data: { email },
    });

export const confirmNewsletter = (token: string) =>
    apiRequest<{ preferencesToken: string }, { token: string }>({
        path: '/newsletter/confirm',
        method: Method.POST,
        data: { token },
    });

export const requestNewsletterLink = (email: string) =>
    apiRequest<{ ok: true }, { email: string }>({
        path: '/newsletter/request-link',
        method: Method.POST,
        data: { email },
    });

export const getNewsletterPreferences = (token: string) =>
    apiRequest<NewsletterPreferencesResponse, void>({
        path: `/newsletter/preferences?token=${encodeURIComponent(token)}`,
    });

export const putNewsletterPreferences = (
    token: string,
    data: {
        frequency: 'daily' | 'weekly';
        allowedCategorySlugs: string[] | null;
        allowedCompanyIds: string[] | null;
        allowedWorkplaces: null;
        publicSalaryOnly: boolean;
    },
) =>
    apiRequest<
        { preferences: NewsletterPreferences; frequency: 'daily' | 'weekly' },
        typeof data
    >({
        path: `/newsletter/preferences?token=${encodeURIComponent(token)}`,
        method: Method.PUT,
        data,
    });

export const previewUnsubscribe = (t: string) =>
    apiRequest<{ maskedEmail: string }, void>({
        path: `/newsletter/unsubscribe/preview?t=${encodeURIComponent(t)}`,
    });

export const unsubscribeNewsletter = (token: string) =>
    apiRequest<{ ok: true }, { token: string }>({
        path: '/newsletter/unsubscribe',
        method: Method.POST,
        data: { token },
    });

export const requestUnsubscribeLink = (email: string) =>
    apiRequest<{ ok: true }, { email: string }>({
        path: '/newsletter/unsubscribe/request-link',
        method: Method.POST,
        data: { email },
    });

export const parseTokenError = (
    error: unknown,
): NewsletterTokenError | null => {
    if (!(error instanceof ApiRequestError)) {
        return null;
    }

    try {
        const parsed = JSON.parse(error.message) as { error?: string };
        if (
            parsed.error === 'token_expired' ||
            parsed.error === 'token_invalid' ||
            parsed.error === 'not_found' ||
            parsed.error === 'already_unsubscribed'
        ) {
            return parsed.error;
        }
    } catch {
        return null;
    }

    return null;
};
