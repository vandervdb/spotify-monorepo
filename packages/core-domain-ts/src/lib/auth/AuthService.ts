export interface AuthService {
  isTokenValid(): boolean;

  getToken(): Promise<string>;

  refreshToken(): Promise<void>;

  loadToken(): Promise<void>;
}
