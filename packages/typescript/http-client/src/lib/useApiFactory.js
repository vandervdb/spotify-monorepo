import { useCallback, useMemo } from 'react';

import {
    createDeleteApi,
    createGetApi,
    createPostApi,
    createPutApi,
} from './apiFactory';

export function useApiFactory(method, baseUrl, url, headers, authService) {
    const create = useCallback(() => {
        let factory;
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
