import { createHash, randomBytes } from 'crypto';
import { Buffer } from '@craftzdog/react-native-buffer';

export function generateCodeVerifier(length = 64): string {
  const bytes = randomBytes(length);
  return base64UrlEncode(bytes);
}

export function generateCodeChallenge(verifier: string): string {
  const hash = createHash('sha256').update(verifier).digest();
  return base64UrlEncode(hash);
}

function base64UrlEncode(buffer: Uint8Array): string {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
