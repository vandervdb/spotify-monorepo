import React, {useEffect, useRef} from 'react';
import {Animated, Image} from 'react-native';
import {log} from '@core/logger';
import {SPOTIFY_CONSTANTS} from '../utils';

export interface SpotifyTrackCoverProps {
    uri: string | undefined;
    direction?: 'left' | 'right';
}

export const SpotifyTrackCover = ({uri, direction = 'right'}: SpotifyTrackCoverProps) => {
    const coverUri = `${SPOTIFY_CONSTANTS.SPOTIFY_COVER_UI}${uri}`;
    const translateX = useRef(new Animated.Value(direction === 'right' ? 100 : -100)).current;

    log.debug(`Rendering SpotifyTrackCover with uri: ${coverUri}`);

    useEffect(() => {
        log.debug(`SpotifyTrackCover: uri changed to ${uri}`);

        translateX.setValue(direction === 'right' ? 50 : -50);

        Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [uri, direction]);

    return (
        <Animated.View style={{transform: [{translateX}]}}>
            <Image source={{uri: coverUri}} style={{width: 50, height: 50, borderRadius: 3}} />
        </Animated.View>
    );
};

export default SpotifyTrackCover;
