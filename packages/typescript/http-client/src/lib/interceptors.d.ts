import { AuthService } from '@core/domain';
import { AxiosInstance } from 'axios';

export declare const attachLogger: (client: AxiosInstance) => AxiosInstance;
export declare const attachBearerInterceptor: (
    client: AxiosInstance,
    authService: AuthService,
) => void;
//# sourceMappingURL=interceptors.d.ts.map
