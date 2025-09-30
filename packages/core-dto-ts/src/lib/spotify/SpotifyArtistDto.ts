import { SpotifyExternalUrlDto } from './SpotifyExternalUrlDto';

export interface SpotifyArtistDto {
  external_urls: SpotifyExternalUrlDto;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export const defaultSpotifyArtistDto: SpotifyArtistDto = {
  external_urls: {
    spotify: '',
  },
  href: '',
  id: '',
  name: '',
  type: 'artist',
  uri: '',
};
