import axios, { AxiosInstance } from 'axios';
import { attachBearerInterceptor, attachLogger } from './interceptors';
import {
  AuthService,
  err,
  HttpError,
  ok,
  Result,
} from '@core/domain';
import { log } from '@core/logger';

function createBaseApi(
  baseUrl: string,
  defaultHeaders?: Record<string, string>,
  authService?: AuthService,
): AxiosInstance {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    },
  });

  attachLogger(instance);

  if (authService) {
    attachBearerInterceptor(instance, authService);
  }

  return instance;
}

export function createGetApi<T>(
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
) {
  const instance = createBaseApi(baseUrl, headers, authService);

  const get = async (): Promise<Result<T, HttpError>> => {
    try {
      const response = await instance.get(url);
      return ok(response.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const httpErr: HttpError = {
          kind: 'http get',
          status: e.response?.status,
          code: e.code,
          message: e.message,
          data: e.response?.data,
          cause: e,
        };
        log.error('Axios error: ', e);
        return err(httpErr);
      }
      log.error('Unknown error: ', e);
      return err<HttpError>({
        kind: 'http get',
        message: 'Unknown error',
        cause: e,
      });
    }
  };

  return { get };
}

export function createPostApi<T>(
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
) {
  const instance = createBaseApi(baseUrl, headers, authService);

  const post = async (): Promise<Result<T, HttpError>> => {
    try {
      const response = await instance.post(url);
      return ok(response.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const httpErr: HttpError = {
          kind: 'http post',
          status: e.response?.status,
          code: e.code,
          message: e.message,
          data: e.response?.data,
          cause: e,
        };
        log.error('Axios error: ', e);
        return err(httpErr);
      }
      log.error('Unknown error: ', e);
      return err<HttpError>({
        kind: 'http post',
        message: 'Unknown error',
        cause: e,
      });
    }
  };

  return { post };
}

export function createPutApi<T>(
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
) {
  const instance = createBaseApi(baseUrl, headers, authService);

  const put = async (): Promise<Result<T, HttpError>> => {
    try {
      const response = await instance.put(url);
      return ok(response.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const httpErr: HttpError = {
          kind: 'http put',
          status: e.response?.status,
          code: e.code,
          message: e.message,
          data: e.response?.data,
          cause: e,
        };
        log.error('Axios error: ', e);
        return err(httpErr);
      }
      log.error('Unknown error: ', e);
      return err<HttpError>({
        kind: 'http put',
        message: 'Unknown error',
        cause: e,
      });
    }
  };

  return { put };
}

export function createDeleteApi<T>(
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
) {
  const instance = createBaseApi(baseUrl, headers, authService);

  const deleteMethod = async (): Promise<Result<T, HttpError>> => {
    try {
      const response = await instance.delete(url);
      return ok(response.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const httpErr: HttpError = {
          kind: 'http delete',
          status: e.response?.status,
          code: e.code,
          message: e.message,
          data: e.response?.data,
          cause: e,
        };
        log.error('Axios error: ', e);
        return err(httpErr);
      }
      log.error('Unknown error: ', e);
      return err<HttpError>({
        kind: 'http delete',
        message: 'Unknown error',
        cause: e,
      });
    }
  };

  return { delete: deleteMethod };
}
