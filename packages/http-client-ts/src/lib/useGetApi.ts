import { useApiFactory } from './useApiFactory';
import type { AuthService, Result } from '@core/domain';

/**
 * A hook function that generates a GET API call using a specified base URL, endpoint,
 * optional headers, and optional authentication service. Returns a function that
 * performs the GET request and retrieves the result.
 *
 * @param {string} baseUrl - The base URL of the API.
 * @param {string} url - The specific endpoint to fetch data from.
 * @param {Record<string, string>} [headers] - Optional headers to include in the request.
 * @param {AuthService} [authService] - Optional authentication service to handle authentication.
 * @return {() => Promise<Result<T>>} - A function that initiates the GET request and returns a Promise of the result.
 */
export function useGetApi<T>(
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
): () => Promise<Result<T>> {
  return useApiFactory('get', baseUrl, url, headers, authService);
}
