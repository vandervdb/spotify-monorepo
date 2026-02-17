import { AuthResult } from '@core/domain/lib/auth/AuthResult';
import { SpotifyTokenResponseDto } from '@core/dto';

import { Result } from '../types/Result';

export interface AuthClient {
    getAuthorization(): Promise<Result<AuthResult>>;

    fetchRefreshToken(): Promise<Result<SpotifyTokenResponseDto>>;
}
