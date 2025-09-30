import type { SpotifyExternalUrlDto } from './SpotifyExternalUrlDto';

export type SpotifyContextType =
  | 'artist'
  | 'album'
  | 'playlist'
  | 'show'
  | 'episode'
  | 'collection';

export interface SpotifyContextDto {
  type: SpotifyContextType;
  href: string | null;
  external_urls: SpotifyExternalUrlDto;
  uri: string;
}
