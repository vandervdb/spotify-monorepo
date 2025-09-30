export interface SpotifyExternalIdsDto {
  isrc?: string | null;
  ean?: string | null;
  upc?: string | null;
}

export const defaultSpotifyExternalIdsDto: SpotifyExternalIdsDto = {
  isrc: '',
  ean: '',
  upc: '',
};
