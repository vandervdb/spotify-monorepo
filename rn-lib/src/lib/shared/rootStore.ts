import {
  AuthClient,
  AuthStore,
  NowPlayingStore,
  SecureStorage,
  TokenData,
} from '@core/domain';
import { DefaultAuthService, DefaultAuthStore } from '../auth';
import { DefaultNowPlayingClient, DefaultNowPlayingStore } from '../playing';
import { CreateGetApiFn } from '@http/client';

export type RootDeps = {
  auth: { authClient: AuthClient; storage: SecureStorage<TokenData> };
  httpClient: { createGetApi: CreateGetApiFn };
};

export class RootStore {
  auth: AuthStore;
  playing: NowPlayingStore;

  constructor(deps: RootDeps) {
    this.auth = new DefaultAuthStore(deps.auth);
    const authService = new DefaultAuthService(this.auth);
    const nowPlayingClient = new DefaultNowPlayingClient(
      authService,
      deps.httpClient.createGetApi,
    );
    this.playing = new DefaultNowPlayingStore({ nowPlayingClient });
  }

  reset() {
    this.auth.setToken(null);
    this.playing.setIsNowPlaying(false);
  }
}

export function createRootStore(deps: RootDeps) {
  return new RootStore(deps);
}
