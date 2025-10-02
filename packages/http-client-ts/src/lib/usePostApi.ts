import { useApiFactory } from './useApiFactory';
import type { AuthService, Result } from '@core/domain';

/**
 * A hook to create a factory function for making POST API requests.
 *
 * @param {string} baseUrl - The base URL of the API.
 * @param {string} url - The endpoint URL to which the request should be made.
 * @param {Record<string, string>} [headers] - Optional headers to include in the request.
 * @param {AuthService} [authService] - Optional authentication service to handle authorization logic.
 * @return {Function} A function that, when called, performs a POST request and returns a Promise resolving to the API result.
 */
export function usePostApi<T>(
  baseUrl: string,
  url: string,
  headers?: Record<string, string>,
  authService?: AuthService,
): () => Promise<Result<T>> {
  return useApiFactory('post', baseUrl, url, headers, authService);
}
