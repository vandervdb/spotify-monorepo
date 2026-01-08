// @flow strict-local
import { TurboModule, TurboModuleRegistry } from 'react-native';

export type AuthConfig = {
    clientId: string,
    redirectUrl: string,
    scopes: Array<string>,
    showDialog: boolean,
};

export interface Spec extends TurboModule {
    // PLAYER (sync session)
    startUpWithModuleActivityResult(config?: AuthConfig): Promise<void>;
    startUpWithHostActivityResult(config?: AuthConfig): Promise<void>;
    disconnect(): Promise<void>;
    playUri(uri: string): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seekTo(ms: number): Promise<void>;

    // PLAYER (state & events)
    getPlayerState(): Promise<{
        isPlaying: boolean,
        positionMs: number,
        durationMs: number,
        trackUri?: string,
        coverId?: string,
        trackName?: string,
        artistName?: string,
        albumName?: string,
    }>;

    startPlayerEvents(): Promise<void>;
    stopPlayerEvents(): Promise<void>;

    // Required for NativeEventEmitter
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpotifyClientModule');
