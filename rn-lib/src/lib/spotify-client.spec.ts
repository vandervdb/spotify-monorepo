import { spotifyClient } from './spotify-client.js';

describe('spotifyClient', () => {
  it('should work', () => {
    expect(spotifyClient()).toEqual('spotify-client');
  });
});
