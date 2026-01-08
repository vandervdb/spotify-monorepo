import SpotifyModuleSpec from '../specs/NativeSpotifyClientModule';
import {NativeEventEmitter, NativeModules} from 'react-native';

const emitter = new NativeEventEmitter(SpotifyModuleSpec as any);

export const player = {
    startUpWithHostActivityResult: SpotifyModuleSpec.startUpWithHostActivityResult,
    startUpWithModuleActivityResult: SpotifyModuleSpec.startUpWithModuleActivityResult,
    disconnect: SpotifyModuleSpec.disconnect,
    playUri: SpotifyModuleSpec.playUri,
    pause: SpotifyModuleSpec.pause,
    resume: SpotifyModuleSpec.resume,
    seekTo: SpotifyModuleSpec.seekTo,
    getState: SpotifyModuleSpec.getPlayerState,
    startEvents: SpotifyModuleSpec.startPlayerEvents,
    stopEvents: SpotifyModuleSpec.stopPlayerEvents,
    addListener: (cb: (e: any) => void) => {
        const sub1 = emitter.addListener('spotify/sessionState', cb);
        const sub2 = emitter.addListener('spotify/playerState', cb);
        const sub3 = emitter.addListener('spotify/uiQueue', cb);
        return {
            remove: () => {
                sub1.remove();
                sub2.remove();
                sub3.remove();
            }
        };
    },
};
