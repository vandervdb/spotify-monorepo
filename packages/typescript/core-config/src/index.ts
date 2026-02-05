export const config = {
    SPOTIFY_CLIENT_ID: '',
    SPOTIFY_REDIRECT_URI: '',
};
export const getEnv = (key?: string) => {
    if (key) return (config as any)[key];
    return config;
};
