import {Card, Text} from 'react-native-paper';
import {TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {BORDER_RADIUS, COLORS, SPACING} from '../theme';
import {useSpotifySession} from '../hooks';

const MiniPlayerDisconnected = () => {
    const {authenticateUser} = useSpotifySession();

    return (
        <Card style={styles.container}>
            <TouchableOpacity style={styles.authButton} onPress={authenticateUser}>
                <Text style={styles.authText}>Se connecter à Spotify</Text>
            </TouchableOpacity>
        </Card>
    );
};
export default MiniPlayerDisconnected;

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.s,
        borderRadius: BORDER_RADIUS.l,
        overflow: 'hidden',
        backgroundColor: COLORS.cardBackground,
    },
    authButton: {
        padding: SPACING.l,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authText: {
        color: COLORS.spotifyGreen,
        fontWeight: 'bold',
    },
});
