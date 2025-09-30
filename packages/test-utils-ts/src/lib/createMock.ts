/**
 * Create a typed Jest mock object from a partial shape.
 * - Shallow by design: you provide only the members you need.
 * - Returned object is typed as jest.Mocked<T> to get .mock* helpers on functions.
 *
 * Usage:
 *   const service = createMock<AuthService>({
 *     getToken: jest.fn().mockResolvedValue('abc'),
 *   });
 */
export function createMock<T>(
  partial?: Partial<jest.Mocked<T>>,
): jest.Mocked<T> {
  // We rely on the caller to provide mocked functions for methods they actually use.
  return (partial ?? {}) as jest.Mocked<T>;
}

/**
 * Create a mocked function keeping
 * F arguments and return type.
 *
 * - For F = () => Promise<string>
 *   => return jest.MockedFunction<() => Promise<string>>
 */
export function mockFnOf<
  F extends (...args: any[]) => any,
>(): jest.MockedFunction<F> {
  return jest.fn<
    ReturnType<F>,
    Parameters<F>
  >() as unknown as jest.MockedFunction<F>;
}

/**
 * Reset all jest.fn() contained in a given object (shallow).
 * Useful in beforeEach() to clean per-test state.
 *
 * Usage:
 *   resetAllMocks(service);
 */
export function resetAllMocks<T extends Record<string, any>>(obj: T): void {
  Object.values(obj).forEach((v) => {
    if (typeof v === 'function' && 'mock' in v) (v as jest.Mock).mockReset();
  });
}
