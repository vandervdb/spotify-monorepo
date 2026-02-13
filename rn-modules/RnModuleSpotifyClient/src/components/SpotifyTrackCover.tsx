import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Image, View, StyleSheet} from 'react-native';
import {log} from '@core/logger';
import {SPOTIFY_CONSTANTS} from '../utils';
import {useSpotifyPlayer} from '../hooks';
import {COLORS} from '../theme';

export const SpotifyTrackCover = () => {
    const {coverId} = useSpotifyPlayer();

    // Scale animation value (instead of translateX)
    const scale = useRef(new Animated.Value(1)).current;

    const coverUri = useMemo(() => {
        if (!coverId || coverId.trim() === '') {
            return null;
        }
        return `${SPOTIFY_CONSTANTS.SPOTIFY_COVER_UI}${coverId}`;
    }, [coverId]);

    log.debug(`Rendering SpotifyTrackCover with coverId: ${coverId || 'none'}, uri: ${coverUri || 'no cover'}`);

    useEffect(() => {
        if (!coverUri) return;

        log.debug(`SpotifyTrackCover: cover changed to ${coverId}`);

        // Start smaller, then bounce to normal size
        scale.stopAnimation();
        scale.setValue(0.85);

        Animated.spring(scale, {
            toValue: 1,
            // Small bounce
            friction: 6, // lower = more bounce
            tension: 120, // higher = snappier
            useNativeDriver: true,
        }).start();
    }, [coverId, coverUri, scale]);

    if (!coverUri) {
        return (
            <View style={styles.placeholder}>
                <View style={styles.placeholderInner} />
            </View>
        );
    }

    return (
        <Animated.View style={{transform: [{scale}]}}>
            <Image
                source={{uri: coverUri}}
                style={styles.image}
                resizeMode="cover"
                onError={error => {
                    log.error('SpotifyTrackCover: Failed to load image', error.nativeEvent.error);
                }}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 3,
        backgroundColor: COLORS.cardBackground,
    },
    placeholder: {
        width: 50,
        height: 50,
        borderRadius: 3,
        backgroundColor: '#666666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderInner: {
        width: 30,
        height: 30,
        borderRadius: 2,
        backgroundColor: '#999999',
    },
});

export default SpotifyTrackCover;
