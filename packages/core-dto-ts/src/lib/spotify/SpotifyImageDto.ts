export interface SpotifyImageDto {
  url: string;
  height?: number;
  width?: number;
}

export const defaultSpotifyImageDto: SpotifyImageDto = {
  url: '',
  height: 0,
  width: 0,
};
