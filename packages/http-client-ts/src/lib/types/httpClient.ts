import {
  AuthService,
  HttpError,
  Result,
} from '@core/domain';

export type ApiMethod = 'get' | 'post' | 'put' | 'delete';

export type ApiHeaders = Record<string, string>;

export type ApiCall<T> = () => Promise<Result<T, HttpError>>;

export type ApiHandlers<T> = Partial<Record<ApiMethod, ApiCall<T>>>;
export type ApiFactoryReturn<T> = ApiHandlers<T>;

export type ApiFactoryFn<T> = (
  baseUrl: string,
  path: string,
  headers?: ApiHeaders,
  authService?: AuthService,
) => ApiFactoryReturn<T>;

export type CreateGetApiFn = <T>(
  baseUrl: string,
  path: string,
  headers?: ApiHeaders,
  authService?: AuthService,
) => { get: ApiCall<T> };

export type CreatePostApiFn = <T>(
  baseUrl: string,
  path: string,
  headers?: ApiHeaders,
  authService?: AuthService,
) => { post: ApiCall<T> };

export type CreatePutApiFn = <T>(
  baseUrl: string,
  path: string,
  headers?: ApiHeaders,
  authService?: AuthService,
) => { put: ApiCall<T> };

export type CreateDeleteApiFn = <T>(
  baseUrl: string,
  path: string,
  headers?: ApiHeaders,
  authService?: AuthService,
) => { delete: ApiCall<T> };
