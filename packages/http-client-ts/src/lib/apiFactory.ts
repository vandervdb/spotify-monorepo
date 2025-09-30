import axios, { AxiosInstance } from 'axios';
import { attachBearerInterceptor, attachLogger } from './interceptors';
import {
  AuthService,
  err,
  HttpError,
  ok,
  Result,
} from '@react-native-spotify/core-domain';
import { log } from '@react-native-spotify/core-logger';

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
        log.error('Erreur Axios: ', e);
        return err(httpErr);
      }
      log.error('Erreur inconnue: ', e);
      return err<HttpError>({
        kind: 'http get',
        message: 'Erreur inconnue',
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
        log.error('Erreur Axios: ', e);
        return err(httpErr);
      }
      log.error('Erreur inconnue: ', e);
      return err<HttpError>({
        kind: 'http post',
        message: 'Erreur inconnue',
        cause: e,
      });
    }
  };

  return { post };
}
