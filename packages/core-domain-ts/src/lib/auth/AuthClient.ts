import { AuthorizeResult } from 'react-native-app-auth';
import { SpotifyTokenResponseDto } from '@core/dto';
import { Result } from '../types/Result';

export interface AuthClient {
  getAuthorization(): Promise<AuthorizeResult | undefined>;

  fetchRefreshToken(): Promise<Result<SpotifyTokenResponseDto>>;
}
