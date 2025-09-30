export interface HttpError {
  kind: 'http post' | 'http get' | 'http put' | 'http delete';
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  cause?: unknown;
}

export const isHttpError = (u: unknown): u is HttpError => {
  return (
    typeof u === 'object' &&
    u !== null &&
    ((u as any).kind === 'http get' ||
      (u as any).kind === 'http post' ||
      (u as any).kind === 'http put' ||
      (u as any).kind === 'http delete') &&
    typeof (u as any).message === 'string'
  );
};
