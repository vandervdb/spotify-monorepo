import {Card, IconButton, MD3Colors, ProgressBar} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import TracksComponent from "./TracksComponent";
import React from "react";
import {Track} from "../types";
import {log} from "@core/logger";

export interface MiniplayerConnectedProps {
    isPlaying: boolean;
    progress: number;
    queueTracks: Track[];
    setUri?: (uri: string) => void;
    pause?: () => void;
    resume?: () => void;
}

const MiniPlayerConnected = ({isPlaying, progress, queueTracks, setUri, pause, resume}: MiniplayerConnectedProps) => {
    log.debug(`MiniPlayerConnected: queueTracks length = ${queueTracks.length}`);
    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                <View style={styles.tracksWrapper}>
                    <TracksComponent
                        trackList={queueTracks}
                        onCurrentTrackChange={(uri) => setUri?.(uri)}
                    />
                </View>
                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={30}
                        iconColor={'#FFFFFF'}
                        containerColor={'#282828'}
                        onPress={() => isPlaying ? pause?.() : resume?.()}
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

export default MiniPlayerConnected;

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
    tracksWrapper: {
        flex: 1,
        height: 60,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        height: 2,
    }
});
