import {Card, IconButton} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {TracksList, MiniPlayerTrack, SpotifyTrackCover, TrackProgress} from './index';
import {BORDER_RADIUS, COLORS, SIZES, SPACING} from '../theme';
import {useSpotifyPlayer} from '../hooks';
import {log} from '@core/logger';

const MiniPlayerConnected = () => {
    const {isPlaying, queueTracks, trackName, artistName, resume, pause} = useSpotifyPlayer();

    const handlePlayPauseToggle = () => {
        if (isPlaying) {
            pause?.();
        } else {
            resume?.();
        }
    };

    const hasQueue = useMemo(() => {
        const result = queueTracks && Array.isArray(queueTracks) && queueTracks.length > 0;
        log.debug(`MiniPlayerConnected: hasQueue=${result}, queueTracks=${JSON.stringify(queueTracks)}`);
        return result;
    }, [queueTracks]);

    const safeTrackName = useMemo(() => trackName || '', [trackName]);
    const safeArtistName = useMemo(() => artistName || '', [artistName]);

    log.debug(
        `MiniPlayerConnected: Rendering - hasQueue=${hasQueue}, trackName="${safeTrackName}", artistName="${safeArtistName}"`,
    );

    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                <View style={styles.coverContainer}>
                    <SpotifyTrackCover />
                </View>
                <View style={styles.tracksWrapper}>
                    {hasQueue ? (
                        <TracksList queueTracks={queueTracks} />
                    ) : (
                        <MiniPlayerTrack trackName={safeTrackName} artistName={safeArtistName} />
                    )}
                </View>
                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={SIZES.iconButtonSize}
                        iconColor={COLORS.white}
                        containerColor={COLORS.cardBackground}
                        onPress={handlePlayPauseToggle}
                    />
                </View>
            </View>
            <TrackProgress style={styles.progress} />
        </Card>
    );
};

export default MiniPlayerConnected;

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.s,
        borderRadius: BORDER_RADIUS.l,
        overflow: 'hidden',
        backgroundColor: COLORS.cardBackground,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
    },
    coverContainer: {
        marginRight: SPACING.m,
    },
    tracksWrapper: {
        flex: 1,
        height: SIZES.miniPlayerTrackHeight,
        overflow: 'hidden',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        height: SIZES.progressBarHeight,
        marginBottom: SPACING.xs,
    },
});
