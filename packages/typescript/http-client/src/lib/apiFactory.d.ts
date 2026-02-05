import { AuthService, HttpError, Result } from '@core/domain';

export declare function createGetApi<T>(
    baseUrl: string,
    url: string,
    headers?: Record<string, string>,
    authService?: AuthService,
): {
    get: () => Promise<Result<T, HttpError>>;
};
export declare function createPostApi<T>(
    baseUrl: string,
    url: string,
    headers?: Record<string, string>,
    authService?: AuthService,
): {
    post: () => Promise<Result<T, HttpError>>;
};
export declare function createPutApi<T>(
    baseUrl: string,
    url: string,
    headers?: Record<string, string>,
    authService?: AuthService,
): {
    put: () => Promise<Result<T, HttpError>>;
};
export declare function createDeleteApi<T>(
    baseUrl: string,
    url: string,
    headers?: Record<string, string>,
    authService?: AuthService,
): {
    delete: () => Promise<Result<T, HttpError>>;
};
//# sourceMappingURL=apiFactory.d.ts.map
