import SpotifyModuleSpec from '../../specs/NativeSpotifyClientModule';
import {NativeEventEmitter} from 'react-native';

const emitter = new NativeEventEmitter(SpotifyModuleSpec as any);

export const player = {
    playUri: SpotifyModuleSpec.playUri,
    pause: SpotifyModuleSpec.pause,
    resume: SpotifyModuleSpec.resume,
    seekTo: SpotifyModuleSpec.seekTo,
    getPlayerState: SpotifyModuleSpec.getPlayerState,

    addListener: (cb: (e: any) => void) => {
        const sub2 = emitter.addListener('spotify/playerState', cb);
        const sub3 = emitter.addListener('spotify/uiQueue', cb);
        return {
            remove: () => {
                sub2.remove();
                sub3.remove();
            }
        };
    },
};

export const session = {
    startUpWithHostActivityResult: SpotifyModuleSpec.startUpWithHostActivityResult,
    startUpWithModuleActivityResult: SpotifyModuleSpec.startUpWithModuleActivityResult,
    disconnect: SpotifyModuleSpec.disconnect,
    getSessionState: SpotifyModuleSpec.getSessionState,

    addListener: (cb: (e: any) => void) => {
        const sub1 = emitter.addListener('spotify/sessionState', cb);
        return {
            remove: () => {
                sub1.remove();
            }
        }
    }
}

export  {useSpotifyPlayer} from './useSpotifyPlayer';
export { useSpotifySession } from './useSpotifySession';
export {useSpotifyModule} from './useSpotifyModule';
