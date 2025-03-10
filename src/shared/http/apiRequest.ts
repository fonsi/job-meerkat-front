import pRetry from 'p-retry';
import { ApiRequestError } from './apiRequestError';

export const buildApiRequestUrl = (path: string): string =>
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}${path}`;

export enum Method {
    HEAD = 'head',
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}

type Params<T> = {
    path: string;
    method?: Method;
    data?: T | void;
    retries?: number;
};

const UNKNOWN_ERROR_MESSAGE = 'unknown error';
const UNKNOWN_ERROR_CODE = 0;
const METHODS_WITHOUT_BODY = [Method.HEAD, Method.GET];

export const apiRequest = async <R, T>({
    path,
    method = Method.GET,
    data,
    retries = 3,
}: Params<T>): Promise<R> => {
    const url = buildApiRequestUrl(path);
    const request: RequestInit = {
        method,
    };

    if (data && !METHODS_WITHOUT_BODY.includes(method)) {
        request['body'] = JSON.stringify(data);
    }

    const makeRequest = (): Promise<Response> =>
        fetch(url, request).catch((error) => {
            const message = error?.message || UNKNOWN_ERROR_MESSAGE;
            throw new ApiRequestError(message, UNKNOWN_ERROR_CODE);
        });

    const response = await pRetry(makeRequest, {
        retries,
        minTimeout: 1000,
        randomize: true,
        onFailedAttempt: (error) => {
            console.error(
                `Attempt ${error.attemptNumber} to ${url} failed. There are ${error.retriesLeft} retries left.`,
            );
        },
    });

    if (response?.ok) {
        return response.json() as R;
    }

    const message = (await response?.text?.()) || UNKNOWN_ERROR_MESSAGE;
    throw new ApiRequestError(message, response.status);
};
