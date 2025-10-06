describe('getEnv', () => {
    afterEach(() => {
        jest.resetModules();
    });
    it('should return env values when all variables are defined', () => {
        jest.doMock('@env', () => ({
            SPOTIFY_CLIENT_ID: 'id123',
            SPOTIFY_CLIENT_SECRET: 'secret456',
            SPOTIFY_REDIRECT_URI: 'myapp://callback',
        }));
        const { getEnv } = require('./env');
        const env = getEnv();
        expect(env).toEqual({
            SPOTIFY_CLIENT_ID: 'id123',
            SPOTIFY_CLIENT_SECRET: 'secret456',
            SPOTIFY_REDIRECT_URI: 'myapp://callback',
        });
    });
    it('should throw if environment variables are missing', () => {
        jest.doMock('@env', () => ({
            SPOTIFY_CLIENT_ID: undefined,
            SPOTIFY_CLIENT_SECRET: undefined,
            SPOTIFY_REDIRECT_URI: undefined,
        }));
        const { getEnv } = require('./env');
        expect(() => getEnv()).toThrow('❌ Missing environment variables');
    });
});
export {};
