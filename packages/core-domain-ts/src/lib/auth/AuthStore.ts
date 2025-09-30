export interface AuthStore {
  readonly token: string;
  readonly isTokenValid: boolean;

  setToken: (token: string | null) => void;

  loadToken(): Promise<void>;

  refreshAccessToken(): Promise<void>;
}
