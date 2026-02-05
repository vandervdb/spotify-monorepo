import type { AuthService, Result } from '@core/domain';

import { ApiMethod } from './types';

export declare function useApiFactory<T>(
    method: ApiMethod,
    baseUrl: string,
    url: string,
    headers?: Record<string, string>,
    authService?: AuthService,
): () => Promise<Result<T>>;
//# sourceMappingURL=useApiFactory.d.ts.map
