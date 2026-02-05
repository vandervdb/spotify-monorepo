import { err, ok } from '@core/domain';
import { log } from '@core/logger';
import axios from 'axios';

import { attachBearerInterceptor, attachLogger } from './interceptors';

function createBaseApi(baseUrl, defaultHeaders, authService) {
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
export function createGetApi(baseUrl, url, headers, authService) {
    const instance = createBaseApi(baseUrl, headers, authService);
    const get = async () => {
        try {
            const response = await instance.get(url);
            return ok(response.data);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const httpErr = {
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
            return err({
                kind: 'http get',
                message: 'Unknown error',
                cause: e,
            });
        }
    };
    return { get };
}
export function createPostApi(baseUrl, url, headers, authService) {
    const instance = createBaseApi(baseUrl, headers, authService);
    const post = async () => {
        try {
            const response = await instance.post(url);
            return ok(response.data);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const httpErr = {
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
            return err({
                kind: 'http post',
                message: 'Unknown error',
                cause: e,
            });
        }
    };
    return { post };
}
export function createPutApi(baseUrl, url, headers, authService) {
    const instance = createBaseApi(baseUrl, headers, authService);
    const put = async () => {
        try {
            const response = await instance.put(url);
            return ok(response.data);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const httpErr = {
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
            return err({
                kind: 'http put',
                message: 'Unknown error',
                cause: e,
            });
        }
    };
    return { put };
}
export function createDeleteApi(baseUrl, url, headers, authService) {
    const instance = createBaseApi(baseUrl, headers, authService);
    const deleteMethod = async () => {
        try {
            const response = await instance.delete(url);
            return ok(response.data);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const httpErr = {
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
            return err({
                kind: 'http delete',
                message: 'Unknown error',
                cause: e,
            });
        }
    };
    return { delete: deleteMethod };
}
