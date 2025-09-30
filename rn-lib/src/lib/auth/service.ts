import { AuthService, AuthStore } from '@react-native-spotify/core-domain';

export class DefaultAuthService implements AuthService {
  constructor(private authStore: AuthStore) {}

  isTokenValid(): boolean {
    return this.authStore.isTokenValid;
  }

  async getToken(): Promise<string> {
    if (!this.authStore.isTokenValid) {
      await this.authStore.loadToken();
    }
    return this.authStore.token;
  }

  async loadToken(): Promise<void> {
    return await this.authStore.loadToken();
  }

  async refreshToken(): Promise<void> {
    await this.authStore.refreshAccessToken();
  }
}
