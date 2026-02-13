import {Card, IconButton} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import MiniPlayerTrack from './MiniPlayerTrack';
import TracksList from './TracksList';
import SpotifyTrackCover from './SpotifyTrackCover';
import React from 'react';
import {BORDER_RADIUS, COLORS, SIZES, SPACING} from '../theme';
import {TrackProgress} from './TrackProgress';
import {useSpotifyPlayer} from '../hooks';

const MiniPlayerConnected = () => {
    const {isPlaying, queueTracks, resume, pause} = useSpotifyPlayer();

    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                <View style={styles.coverContainer}>
                    <SpotifyTrackCover />
                </View>
                <View style={styles.tracksWrapper}>
                    {queueTracks.length > 0 ? <TracksList /> : <MiniPlayerTrack />}
                </View>
                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={SIZES.iconButtonSize}
                        iconColor={COLORS.white}
                        containerColor={COLORS.cardBackground}
                        onPress={() => (isPlaying ? pause?.() : resume?.())}
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
