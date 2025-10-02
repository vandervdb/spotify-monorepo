import axios, { AxiosInstance } from 'axios';
import { attachBearerInterceptor, attachLogger } from './interceptors';
import { createGetApi, createPostApi } from './apiFactory';
import {
  AuthService,
  HttpError,
  isErr,
  isHttpError,
  Result,
} from '@core/domain';
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

const mockedAxios = axios as unknown as {
  create: jest.Mock;
  isAxiosError: jest.Mock;
};
const mockedAttachLogger = attachLogger as jest.MockedFunction<
  typeof attachLogger
>;
const mockedAttachBearer = attachBearerInterceptor as jest.MockedFunction<
  typeof attachBearerInterceptor
>;

let instance: jest.Mocked<AxiosInstance>;

function setupAxiosInstance(): void {
  instance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: {} as never,
  } as unknown as jest.Mocked<AxiosInstance>;

  mockedAxios.create.mockReset();
  mockedAxios.isAxiosError.mockReset();
  mockedAxios.create.mockReturnValue(instance);

  mockedAttachLogger.mockClear();
  mockedAttachBearer.mockClear();
}

type ApiFactory<T> = (
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
) => {
  get?: () => Promise<Result<T, HttpError>>;
  post?: () => Promise<Result<T, HttpError>>;
};

async function runCall<T>(
  api: ReturnType<ApiFactory<T>>,
  method: 'get' | 'post',
) {
  const fn = api[method];
  if (!fn) throw new Error(`Méthode ${method} absente sur l'API`);
  return fn();
}

const CASES: Array<{
  label: 'GET' | 'POST';
  method: 'get' | 'post';
  factory: ApiFactory<any>;
  resolveWith: (data: any) => void;
  rejectWith: (err: unknown) => void;
}> = [
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
        const result = await runCall<{ id: number }>(api, method);

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
        const result = await runCall<any>(api, method);

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
        const result = await runCall<any>(api, method);

        expect(isErr(result)).toBe(true);
        if (!result.ok) {
          expect(isHttpError(result.error)).toBe(true);
          expect(result.error.kind).toBe(`http ${method}`);
          expect((result.error as HttpError).message).toBe('Erreur inconnue');
        }
      });

      it("n'attache pas le bearer si authService est absent", () => {
        factory('https://api', '/resource');

        expect(mockedAttachLogger).toHaveBeenCalledWith(instance);
        expect(mockedAttachBearer).not.toHaveBeenCalled();
      });

      it('attache le bearer interceptor quand authService est fourni', () => {
        const authService = createMock<AuthService>({
          getToken:
            mockFnOf<AuthService['getToken']>().mockResolvedValue('abc123'),
        });

        factory('https://api', '/resource', undefined, authService);

        expect(mockedAttachLogger).toHaveBeenCalledWith(instance);
        expect(mockedAttachBearer).toHaveBeenCalledWith(instance, authService);
        expect(mockedAttachBearer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
