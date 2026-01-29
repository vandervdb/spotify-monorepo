import React from 'react';
import {StyleSheet, View} from 'react-native';
import SpotifyTrackCover from "./SpotifyTrackCover";
import {ScrollingText} from "./ScrollingText";

export interface MiniPlayerTrackProps {
    trackName: string;
    artistName: string;
    coverUri: string;
}

const MiniPlayerTrack = ({ trackName, artistName, coverUri }: MiniPlayerTrackProps) => {
    return (
        <View style={styles.content}>
            <View style={styles.trackInfo}>
                <SpotifyTrackCover uri={coverUri}/>
            </View>

            <View style={styles.trackTextContainer}>
                <ScrollingText
                    text={trackName}
                    variant="titleMedium"
                    style={styles.title}
                />
                <ScrollingText
                    text={artistName}
                    variant="bodySmall"
                    style={styles.artist}
                />
            </View>
        </View>
    );
}

export default MiniPlayerTrack;

const styles = StyleSheet.create({
    content: {
        width: 250, // Largeur fixe pour que chaque item de la FlatList soit visible
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginRight: 16,
    },
    trackInfo: {
        marginRight: 12,
    },
    trackTextContainer: {
        flex: 1,
        flexShrink: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    artist: {
        color: '#B3B3B3',
    },
});
