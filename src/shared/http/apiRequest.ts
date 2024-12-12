import { ApiRequestError } from './apiRequestError';

export const buildApiRequestUrl = (path: string): string =>
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}${path}`;

export enum Method { HEAD = 'head', GET = 'get', POST = 'post', PUT = 'put', DELETE = 'delete' }

type Params<T> = {
    path: string;
    method?: Method;
    data?: T | void;
}

const UNKNOWN_ERROR_MESSAGE = 'unknown error';
const UNKNOWN_ERROR_CODE = 0;
const METHODS_WITHOUT_BODY = [Method.HEAD, Method.GET];

export const apiRequest = async <R, T>({ path, method = Method.GET, data }: Params<T>): Promise<R> => {
    const url = buildApiRequestUrl(path);
    const request: RequestInit = {
        method,
    }

    if (data && !METHODS_WITHOUT_BODY.includes(method)) {
        request['body'] = JSON.stringify(data);
    }

    const response = await fetch(url, request).catch((error) => {
        const message = error?.message || UNKNOWN_ERROR_MESSAGE;
        throw new ApiRequestError(message , UNKNOWN_ERROR_CODE);
    });

    if (response?.ok) {
        return response.json() as R;
    }

    const message = await response?.text?.() || UNKNOWN_ERROR_MESSAGE;
    throw new ApiRequestError(message, response.status);
}