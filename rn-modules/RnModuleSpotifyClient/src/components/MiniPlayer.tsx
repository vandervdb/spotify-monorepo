import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, IconButton, MD3Colors, ProgressBar, Text} from 'react-native-paper';
import {useSpotifyModule} from '../hooks';
import MiniPlayerComponent from "./MiniPlayerComponent";
import {log} from "@core/logger";

const MiniPlayer = () => {
    const { player, isConnected, authenticateUser } = useSpotifyModule();


    if (!isConnected) {
        return (
            <Card style={styles.container}>
                <TouchableOpacity style={styles.authButton} onPress={authenticateUser}>
                    <Text style={styles.authText}>Se connecter à Spotify</Text>
                </TouchableOpacity>
            </Card>
        );
    }

    const isPlaying = player?.playerState?.isPlaying ?? false;
    const trackName = player?.playerState?.trackName || "Aucune lecture";
    const artistName = player?.playerState?.artistName || "";
    const coverUri = player?.playerState?.coverId ?? "";
    const progress = player?.playerState?.durationMs
        ? player.playerState.positionMs / player.playerState.durationMs
        : 0;
log.debug(`MiniPlayer: isPlaying=${isPlaying}, trackName=${trackName}, artistName=${artistName}, coverUri=${coverUri}, progress=${progress}`);
    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                <MiniPlayerComponent
                    trackName={trackName}
                    artistName={artistName}
                    coverUri={coverUri}
                />

                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={30}
                        iconColor={ '#FFFFFF'}
                        containerColor={'#282828'}
                        onPress={() => isPlaying ? player?.pause() : player?.resume()}
                    />
                </View>
            </View>

            <ProgressBar
                progress={progress}
                color={MD3Colors.primary50}
                style={styles.progress}
            />
        </Card>
    );
};

export default MiniPlayer;

const styles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#282828',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    trackInfo: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    artist: {
        color: '#B3B3B3',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authButton: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authText: {
        color: '#1DB954', // Vert Spotify
        fontWeight: 'bold',
    },
    progress: {
        height: 2,
    }
});
