import { NowPlaying } from './NowPlaying';

export interface NowPlayingStore {
  readonly nowPlayingLoadedOnce: boolean;
  readonly nowPlaying: NowPlaying;
  readonly loading: boolean;
  readonly error: Error | null;

  loadNowPlaying(): Promise<void>;

  refreshNowPlaying(): Promise<void>;

  setIsNowPlaying: (isNowPlaying: boolean) => void;
}
