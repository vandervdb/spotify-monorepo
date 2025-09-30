import { ExternalUrlsDto } from './ExternalUrlsDto';
import { SpotifyImageDto } from './SpotifyImageDto';
import { SpotifyOwnerDto } from './SpotifyOwnerDto';
import { SpotifyTracksDto } from './SpotifyTracksDto';

export interface SpotifyPlaylistDto {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrlsDto;
  href: string;
  id: string;
  images: SpotifyImageDto[];
  name: string;
  owner: SpotifyOwnerDto;
  public?: boolean; // nullable en Kotlin
  snapshot_id: string;
  tracks: SpotifyTracksDto;
  type: string;
  uri: string;
}
