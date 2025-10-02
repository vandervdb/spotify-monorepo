import {
  AuthClient,
  AuthStore,
  SecureStorage,
  TokenData,
} from '@core/domain';
import { log } from '@core/logger';
import { makeAutoObservable, observable, runInAction } from 'mobx';
import {
  mapAuthorizeResultToTokenData,
  mapSpotifyTokenResponseToTokenData,
} from './utils/authMapper';

export class DefaultAuthStore implements AuthStore {
  private tokenRefreshPromise: Promise<void> | null = null;
  authParams: TokenData = { token: '', refreshToken: '', expiresAt: 0 };
  loading = false;
  error: Error | null = null;

  constructor(
    private deps: { authClient: AuthClient; storage: SecureStorage<TokenData> },
  ) {
    makeAutoObservable(this, {
      authParams: observable,
      loading: observable,
      error: observable,
    });

    this.loadToken().then(() => log.debug('Initial token loaded'));
  }

  get token(): string {
    return this.authParams.token;
  }

  setToken(token: string | null) {
    this.authParams.token = token ?? '';
  }

  get isTokenValid(): boolean {
    return (
      this.authParams.token !== '' && this.authParams.expiresAt > Date.now()
    );
  }

  async loadToken(): Promise<void> {
    if (this.tokenRefreshPromise) {
      log.debug('Token already loading, waiting for promise...');
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = (async () => {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });

      try {
        const stored = await this.deps.storage.get();
        if (stored && stored.token && stored.expiresAt > Date.now()) {
          runInAction(() => {
            this.authParams = stored;
          });
          log.debug('Valid token loaded from SecureStorage');
        } else {
          await this.refreshAccessToken();
        }
      } catch (e) {
        runInAction(() => {
          this.error = e instanceof Error ? e : new Error('Unknown error');
          log.error('loadToken error:', e);
        });
      } finally {
        runInAction(() => {
          this.loading = false;
        });
        this.tokenRefreshPromise = null;
      }
    })();

    return this.tokenRefreshPromise;
  }

  async refreshAccessToken(): Promise<void> {
    let tokenData: TokenData | undefined;

    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      if (!this.authParams.refreshToken) {
        const result = await this.deps.authClient.getAuthorization();
        tokenData = result ? mapAuthorizeResultToTokenData(result) : undefined;
      } else {
        const response = await this.deps.authClient.fetchRefreshToken();
        const dto = response.ok ? response.value : undefined;
        tokenData = dto ? mapSpotifyTokenResponseToTokenData(dto) : undefined;
      }

      if (!tokenData) {
        throw new Error('Invalid token data');
      }

      const validToken: TokenData = tokenData;

      await this.deps.storage.save(validToken);

      runInAction(() => {
        this.authParams = validToken;
        this.loading = false;
      });

      log.debug('Token refreshed successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      runInAction(() => {
        log.error('Error refreshing token:', errorMessage);
        this.error = new Error('Token refresh error: ' + errorMessage);
        this.loading = false;
      });
    }
  }
}
