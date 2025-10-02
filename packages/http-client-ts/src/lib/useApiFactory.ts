import { useCallback, useMemo } from 'react';
import type { AuthService, Result } from '@core/domain';
import {createDeleteApi, createGetApi, createPostApi, createPutApi} from './apiFactory';
import { ApiFactoryFn, ApiMethod } from './types';

export function useApiFactory<T>(
  method: ApiMethod,
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
): () => Promise<Result<T>> {
  const create = useCallback((): (() => Promise<Result<T>>) => {
    let factory: ApiFactoryFn<T>;

    switch (method) {
      case 'get':
        factory = createGetApi;
        break;
      case 'post':
        factory = createPostApi;
        break;
      case 'put':
        factory = createPutApi;
        break;
      case 'delete':
        factory = createDeleteApi;
        break;
      default:
        throw new Error(`Méthode API "${method}" non supportée`);
    }

    const result = factory(baseUrl, url, headers, authService);

    const fn = result[method];
    if (!fn) {
      throw new Error(`Méthode API "${method}" non implémentée`);
    }

    return fn;
  }, [method, baseUrl, url, headers, authService]);

  return useMemo(() => create(), [create]);
}
