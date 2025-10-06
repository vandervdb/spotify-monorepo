import axios from 'axios';
import { attachBearerInterceptor, attachLogger } from './interceptors';
import { createGetApi, createPostApi } from './apiFactory';
import { isErr, isHttpError, } from '@core/domain';
import { createMock, mockFnOf } from '@test/utils';
jest.mock('axios', () => {
    const m = { create: jest.fn(), isAxiosError: jest.fn() };
    return { __esModule: true, default: m, ...m };
});
jest.mock('./interceptors', () => ({
    attachLogger: jest.fn(),
    attachBearerInterceptor: jest.fn(),
}));
jest.mock('@react-native-spotify/core-logger', () => ({
    log: { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));
const mockedAxios = axios;
const mockedAttachLogger = attachLogger;
const mockedAttachBearer = attachBearerInterceptor;
let instance;
function setupAxiosInstance() {
    instance = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() },
        },
        defaults: {},
    };
    mockedAxios.create.mockReset();
    mockedAxios.isAxiosError.mockReset();
    mockedAxios.create.mockReturnValue(instance);
    mockedAttachLogger.mockClear();
    mockedAttachBearer.mockClear();
}
async function runCall(api, method) {
    const fn = api[method];
    if (!fn)
        throw new Error(`Méthode ${method} absente sur l'API`);
    return fn();
}
const CASES = [
    {
        label: 'GET',
        method: 'get',
        factory: createGetApi,
        resolveWith: (data) => instance.get.mockResolvedValue({ data }),
        rejectWith: (err) => instance.get.mockRejectedValue(err),
    },
    {
        label: 'POST',
        method: 'post',
        factory: createPostApi,
        resolveWith: (data) => instance.post.mockResolvedValue({ data }),
        rejectWith: (err) => instance.post.mockRejectedValue(err),
    },
];
describe('apiFactory (factorisé GET/POST)', () => {
    beforeEach(setupAxiosInstance);
    CASES.forEach(({ label, method, factory, resolveWith, rejectWith }) => {
        describe(label, () => {
            it('retourne ok:true en succès', async () => {
                resolveWith({ id: 1 });
                const api = factory('https://api', '/resource');
                const result = await runCall(api, method);
                expect(result).toEqual({ ok: true, value: { id: 1 } });
                expect(mockedAxios.create).toHaveBeenCalledWith({
                    baseURL: 'https://api',
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' },
                });
                expect(mockedAttachLogger).toHaveBeenCalledWith(instance);
            });
            it('retourne ok:false avec erreur axios', async () => {
                const errMessage = 'boom';
                const error = new Error(errMessage);
                mockedAxios.isAxiosError.mockReturnValue(true);
                rejectWith(error);
                const api = factory('https://api', '/resource');
                const result = await runCall(api, method);
                expect(isErr(result)).toBe(true);
                if (!result.ok) {
                    expect(isHttpError(result.error)).toBe(true);
                    expect(result.error.kind).toBe(`http ${method}`);
                    expect(result.error.message).toBe(errMessage);
                }
                expect(mockedAttachLogger).toHaveBeenCalledWith(instance);
            });
            it("retourne ok:false avec Error('Erreur inconnue') quand non-axios", async () => {
                mockedAxios.isAxiosError.mockReturnValue(false);
                rejectWith('weird');
                const api = factory('https://api', '/resource');
                const result = await runCall(api, method);
                expect(isErr(result)).toBe(true);
                if (!result.ok) {
                    expect(isHttpError(result.error)).toBe(true);
                    expect(result.error.kind).toBe(`http ${method}`);
                    expect(result.error.message).toBe('Erreur inconnue');
                }
            });
            it("n'attache pas le bearer si authService est absent", () => {
                factory('https://api', '/resource');
                expect(mockedAttachLogger).toHaveBeenCalledWith(instance);
                expect(mockedAttachBearer).not.toHaveBeenCalled();
            });
            it('attache le bearer interceptor quand authService est fourni', () => {
                const authService = createMock({
                    getToken: mockFnOf().mockResolvedValue('abc123'),
                });
                factory('https://api', '/resource', undefined, authService);
                expect(mockedAttachLogger).toHaveBeenCalledWith(instance);
                expect(mockedAttachBearer).toHaveBeenCalledWith(instance, authService);
                expect(mockedAttachBearer).toHaveBeenCalledTimes(1);
            });
        });
    });
});
