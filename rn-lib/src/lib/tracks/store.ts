import {
  AuthService,
  isOk,
  TrackClient,
} from '@react-native-spotify/core-domain';
import { makeAutoObservable, observable } from 'mobx';

export class DefaultTrackStore {
  favorites = observable.set<string>();

  constructor(
    private readonly deps: {
      auth: AuthService;
      client: TrackClient;
    },
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async isFavorite(id: string): Promise<boolean> {
    const result = await this.deps.client.fetchIsFavorite(id);
    if (isOk(result)) {
      this.favorites.add(id);
    } else {
      this.favorites.delete(id);
    }
    return this.favorites.has(id);
  }

  addFavorite(id: string): void {
    this.favorites.add(id);
  }

  removeFavorite(id: string): void {
    this.favorites.delete(id);
  }

  async toggleFavorite(id: string) {
    if (await this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(id);
    }
  }
}
