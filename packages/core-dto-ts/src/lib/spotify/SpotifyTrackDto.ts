import { SpotifyRestrictionsDto } from './SpotifyRestrictionsDto';
import { SpotifyExternalUrlDto } from './SpotifyExternalUrlDto';
import { SpotifyExternalIdsDto } from './SpotifyExternalIdsDto';
import { SpotifyArtistDto } from './SpotifyArtistDto';
import { defaultSpotifyAlbumDto, SpotifyAlbumDto } from './SpotifyAlbumDto';

export interface SpotifyTrackDto {
  album: SpotifyAlbumDto;
  artists: SpotifyArtistDto[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIdsDto;
  external_urls: SpotifyExternalUrlDto;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: Record<string, string>; // map<String, String> => object
  restrictions?: SpotifyRestrictionsDto | null;
  name: string;
  popularity: number;
  preview_url?: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export const defaultSpotifyTrackDto: SpotifyTrackDto = {
  album: defaultSpotifyAlbumDto,
  artists: [],
  available_markets: [],
  disc_number: 1,
  duration_ms: 0,
  explicit: false,
  external_ids: {
    isrc: '',
    ean: '',
    upc: '',
  },
  external_urls: {
    spotify: '',
  },
  href: '',
  id: '',
  is_playable: true,
  linked_from: {},
  restrictions: undefined,
  name: '',
  popularity: 0,
  preview_url: '',
  track_number: 1,
  type: 'track',
  uri: '',
  is_local: false,
};
