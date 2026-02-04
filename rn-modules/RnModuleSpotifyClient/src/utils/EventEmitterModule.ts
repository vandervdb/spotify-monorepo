import {NativeEventEmitter} from 'react-native';

export type EventEmitterCompatibleModule = {
    addListener(eventName: string): void;
    removeListeners(count: number): void;
};

/**
 * TurboModule `Spec` inclut addListener/removeListeners (requis par NativeEventEmitter),
 * mais la signature TS de React Native ne le reconnaît pas directement.
 * On centralise donc le cast ici (au lieu de `as any` partout).
 */
export function createNativeModuleEmitter(module: EventEmitterCompatibleModule): NativeEventEmitter {
    return new NativeEventEmitter(module);
}
