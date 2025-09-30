export default interface TrackService {
  isFavorite(id: string): Promise<boolean>;

  toggleFavorite(id: string): Promise<void>;
}
