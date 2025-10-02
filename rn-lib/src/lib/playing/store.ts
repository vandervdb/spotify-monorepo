import {
  NowPlaying,
  NowPlayingClient,
  NowPlayingStore,
} from '@core/domain';
import { log } from '@core/logger';
import { makeAutoObservable, observable, runInAction } from 'mobx';
import { mapPlaybackStateToNowPlaying } from './mapPlaybackStateToNowPlaying';

export class DefaultNowPlayingStore implements NowPlayingStore {
  private nowPlayingRequestPromise: Promise<void> | null = null;
  nowPlaying: NowPlaying = { isPlaying: false };
  nowPlayingLoadedOnce = false;
  loading = false;
  error: Error | null = null;

  constructor(
    private deps: {
      nowPlayingClient: NowPlayingClient;
    },
  ) {
    makeAutoObservable(this, {
      nowPlaying: observable,
      loading: observable,
      error: observable,
    });
    this.loadNowPlaying().then(() => log.debug('Now playing data loaded'));
  }

  loadNowPlaying(): Promise<void> {
    if (this.nowPlayingRequestPromise) {
      log.debug('Now playing request already in progress');
      return this.nowPlayingRequestPromise;
    }

    this.nowPlayingRequestPromise = (async () => {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });
      try {
        await this.refreshNowPlaying();
      } catch (e) {
        runInAction(() => {
          this.error = e instanceof Error ? e : new Error('Unknown error');
          log.error('loadNowPlaying error:', e);
        });
      } finally {
        runInAction(() => {
          this.loading = false;
        });
        this.nowPlayingRequestPromise = null;
      }
    })();
    this.nowPlayingLoadedOnce = true;
    return this.nowPlayingRequestPromise;
  }

  async refreshNowPlaying(): Promise<void> {
    let nowPlayingData: NowPlaying | undefined;

    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const response = await this.deps.nowPlayingClient.fetchNowPlaying();
      const dto = response.ok ? response.value : undefined;
      nowPlayingData = dto ? mapPlaybackStateToNowPlaying(dto) : undefined;

      if (!nowPlayingData) {
        throw new Error('Invalid now playing data');
      }

      const validData: NowPlaying = nowPlayingData;
      runInAction(() => {
        this.nowPlaying = validData;
        this.loading = false;
      });

      log.debug('Now playing data refreshed successfully');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
      runInAction(() => {
        log.error('Error fetching no playing data:', errorMessage);
        this.error = new Error('Now playing error: ' + errorMessage);
        this.loading = false;
      });
    }
  }

  setIsNowPlaying(isNowPlaying: boolean) {
    this.nowPlaying = {
      ...this.nowPlaying,
      isPlaying: isNowPlaying,
    };
  }
}
