import { SpotifyExternalUrlDto } from './SpotifyExternalUrlDto';
import { SpotifyImageDto } from './SpotifyImageDto';
import { SpotifyRestrictionsDto } from './SpotifyRestrictionsDto';
import { SpotifyArtistDto } from './SpotifyArtistDto';

export interface SpotifyAlbumDto {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrlDto;
  href: string;
  id: string;
  images: SpotifyImageDto[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: SpotifyRestrictionsDto | null;
  type: string;
  uri: string;
  artists: SpotifyArtistDto[];
}

export const defaultSpotifyAlbumDto: SpotifyAlbumDto = {
  album_type: '',
  total_tracks: 0,
  available_markets: [],
  external_urls: {
    spotify: '',
  },
  href: '',
  id: '',
  images: [],
  name: '',
  release_date: '',
  release_date_precision: '',
  restrictions: undefined,
  type: 'album',
  uri: '',
  artists: [],
};
