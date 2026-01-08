package org.rnmodulespotifyclient.bridge

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeSpotifyClientPackage : TurboReactPackage() {
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? =
        if (name == NativeSpotifyClientModule.NAME) {
            NativeSpotifyClientModule(reactContext)
        } else {
            null
        }

    override fun getReactModuleInfoProvider() =
        ReactModuleInfoProvider {
            mapOf(
                NativeSpotifyClientModule.NAME to
                    ReactModuleInfo(
                        _name = NativeSpotifyClientModule.NAME,
                        _className = NativeSpotifyClientModule.NAME,
                        _canOverrideExistingModule = false,
                        _needsEagerInit = false,
                        isCxxModule = false,
                        isTurboModule = true,
                    ),
            )
        }
}
