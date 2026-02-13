import React, {useEffect, useRef} from 'react';
import {Animated, Image} from 'react-native';
import {log} from '@core/logger';
import {SPOTIFY_CONSTANTS} from '../utils';
import {useSpotifyPlayer} from '../hooks';

export const SpotifyTrackCover = () => {
    const {coverId} = useSpotifyPlayer();
    const coverUri = `${SPOTIFY_CONSTANTS.SPOTIFY_COVER_UI}${coverId}`;
    const translateX = useRef(new Animated.Value(100)).current;

    log.debug(`Rendering SpotifyTrackCover with uri: ${coverUri}`);

    useEffect(() => {
        log.debug(`SpotifyTrackCover: uri changed to ${coverId}`);

        translateX.setValue(0);

        Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [coverId]);

    return (
        <Animated.View style={{transform: [{translateX}]}}>
            <Image source={{uri: coverUri}} style={{width: 50, height: 50, borderRadius: 3}} />
        </Animated.View>
    );
};

export default SpotifyTrackCover;
