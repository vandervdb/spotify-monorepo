import { log } from '@core/logger';

export const attachLogger = (client) => {
    client.interceptors.request.use((request) => {
        log.debug(
            `[API Request] ${request.method?.toUpperCase()} ${request.url}`,
        );
        log.debug('Request data:', JSON.stringify(request.data, null, 2));
        return request;
    });
    client.interceptors.response.use(
        (response) => {
            log.debug(
                `[API Response] ${response.status} ${response.config.url}`,
            );
            log.debug(
                '[Response data]:',
                JSON.stringify(response.data, null, 2),
            );
            return response;
        },
        (error) => {
            log.error('[API Error]', error.message);
            if (error.response) {
                // do nothing
            }
        },
    );
    return client;
};
const attachBearer = async (config, authService) => {
    const token = await authService.getToken();
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
        if (typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
            log.debug('→ Bearer token attached');
        } else {
            config.headers['Authorization'] = `Bearer ${token}`;
            log.debug('→ No Bearer token. Raw request');
        }
    }
    return config;
};
const handle401 = async (error, authService) => {
    const originalRequest = error.config;
    if (!originalRequest) {
        return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
        log.warn('401 intercepted. Attempting refresh...');
        originalRequest._retry = true;
        try {
            await authService.getToken();
            const token = await authService.getToken();
            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return import('axios').then(({ default: axios }) =>
                    axios(originalRequest),
                );
            }
        } catch (refreshError) {
            log.debug('Error refreshing token', refreshError);
            throw refreshError;
        }
    }
    throw error;
};
export const attachBearerInterceptor = (client, authService) => {
    client.interceptors.request.use((config) =>
        attachBearer(config, authService),
    );
    client.interceptors.response.use(
        (response) => response,
        (error) => handle401(error, authService),
    );
};
