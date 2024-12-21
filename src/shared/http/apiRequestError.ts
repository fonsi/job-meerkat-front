export class ApiRequestError extends Error {
    constructor(
        public message: string,
        public status: number,
    ) {
        super(`API request error: ${message}`);
    }
}
