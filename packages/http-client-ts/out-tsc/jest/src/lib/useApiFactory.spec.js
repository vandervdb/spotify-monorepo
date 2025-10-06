// useApiFactory.spec.ts
import { renderHook } from '@testing-library/react-native';
import * as apiFactory from './apiFactory'; // <— import namespace
import { useApiFactory } from './useApiFactory';
jest.mock('./apiFactory', () => ({
    __esModule: true,
    createGetApi: jest.fn(),
    createPostApi: jest.fn(),
}));
const mockedCreateGetApi = apiFactory.createGetApi;
const mockedCreatePostApi = apiFactory.createPostApi;
function stubGet(impl) {
    const get = (impl ??
        jest.fn().mockResolvedValue({ ok: true, value: 'OK' }));
    mockedCreateGetApi.mockReturnValue({ get });
    return get;
}
function stubPost(impl) {
    const post = (impl ??
        jest.fn().mockResolvedValue({ ok: true, value: 'OK' }));
    mockedCreatePostApi.mockReturnValue({ post });
    return post;
}
describe('useApiFactory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('GET', async () => {
        const get = stubGet(jest.fn().mockResolvedValue({ ok: true, value: { id: 1 } }));
        const { result } = renderHook(() => useApiFactory('get', 'https://api', '/r'));
        await expect(result.current()).resolves.toEqual({
            ok: true,
            value: { id: 1 },
        });
        expect(mockedCreateGetApi).toHaveBeenCalledWith('https://api', '/r', undefined, undefined);
        expect(get).toHaveBeenCalledTimes(1);
    });
    it('POST', async () => {
        const post = stubPost(jest.fn().mockResolvedValue({ ok: true, value: 'POST' }));
        const { result } = renderHook(() => useApiFactory('post', 'https://api', '/r'));
        await expect(result.current()).resolves.toEqual({
            ok: true,
            value: 'POST',
        });
        expect(mockedCreatePostApi).toHaveBeenCalled();
        expect(post).toHaveBeenCalledTimes(1);
    });
});
