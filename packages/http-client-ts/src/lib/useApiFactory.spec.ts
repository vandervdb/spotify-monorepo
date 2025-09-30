// useApiFactory.spec.ts

import { renderHook } from '@testing-library/react-native';
import * as apiFactory from './apiFactory'; // <— import namespace
import { useApiFactory } from './useApiFactory';

jest.mock('./apiFactory', () => ({
  __esModule: true,
  createGetApi: jest.fn(),
  createPostApi: jest.fn(),
}));

type Result<T> = { ok: true; value: T } | { ok: false; error: unknown };

const mockedCreateGetApi = apiFactory.createGetApi as jest.MockedFunction<
  typeof apiFactory.createGetApi
>;
const mockedCreatePostApi = apiFactory.createPostApi as jest.MockedFunction<
  typeof apiFactory.createPostApi
>;

function stubGet<T>(impl?: () => Promise<Result<T>>) {
  const get = (impl ??
    jest.fn().mockResolvedValue({ ok: true, value: 'OK' })) as any;
  mockedCreateGetApi.mockReturnValue({ get } as any);
  return get as jest.Mock;
}

function stubPost<T>(impl?: () => Promise<Result<T>>) {
  const post = (impl ??
    jest.fn().mockResolvedValue({ ok: true, value: 'OK' })) as any;
  mockedCreatePostApi.mockReturnValue({ post } as any);
  return post as jest.Mock;
}

describe('useApiFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET', async () => {
    const get = stubGet<{ id: number }>(
      jest.fn().mockResolvedValue({ ok: true, value: { id: 1 } }),
    );
    const { result } = renderHook(() =>
      useApiFactory<{ id: number }>('get', 'https://api', '/r'),
    );
    await expect(result.current()).resolves.toEqual({
      ok: true,
      value: { id: 1 },
    });
    expect(mockedCreateGetApi).toHaveBeenCalledWith(
      'https://api',
      '/r',
      undefined,
      undefined,
    );
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('POST', async () => {
    const post = stubPost<string>(
      jest.fn().mockResolvedValue({ ok: true, value: 'POST' }),
    );
    const { result } = renderHook(() =>
      useApiFactory<string>('post', 'https://api', '/r'),
    );
    await expect(result.current()).resolves.toEqual({
      ok: true,
      value: 'POST',
    });
    expect(mockedCreatePostApi).toHaveBeenCalled();
    expect(post).toHaveBeenCalledTimes(1);
  });
});
