import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, IconButton, ProgressBar, MD3Colors, Text } from 'react-native-paper';
import { useSpotifyModule } from '../hooks';
import { PlayerState } from '../../specs';

const MiniPlayer = () => {
    const { player, isConnected, authenticateUser } = useSpotifyModule();

    // Synchronisation de l'état local avec l'état du lecteur Spotify
    useEffect(() => {
        if (player) {
            // On rafraîchit l'état initial
            player.refreshState();

            // Note: Le hook useSpotifyPlayer semble déjà loguer les changements d'état via un listener,
            // mais pour une UI réactive, on s'assure d'avoir un intervalle de rafraîchissement
            // si le module natif n'envoie pas de mises à jour de position fréquentes.
            const interval = setInterval(() => {
                player.refreshState();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [player]);

    // Si on n'est pas connecté, on affiche un bouton de connexion
    if (!isConnected) {
        return (
            <Card style={styles.container}>
                <TouchableOpacity style={styles.authButton} onPress={authenticateUser}>
                    <Text style={styles.authText}>Se connecter à Spotify</Text>
                </TouchableOpacity>
            </Card>
        );
    }

    // Extraction des données de l'état actuel
    const isPlaying = player?.playerState?.isPlaying ?? false;
    const trackName = player?.playerState?.trackName || "Aucune lecture";
    const artistName = player?.playerState?.artistName || "";
    const progress = player?.playerState?.durationMs
        ? player.playerState.positionMs / player.playerState.durationMs
        : 0;

    return (
        <Card style={styles.container} elevation={4}>
            <View style={styles.content}>
                {/* Informations sur le titre */}
                <View style={styles.trackInfo}>
                    <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
                        {trackName}
                    </Text>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.artist}>
                        {artistName}
                    </Text>
                </View>

                {/* Contrôles */}
                <View style={styles.controls}>
                    <IconButton
                        icon={isPlaying ? 'pause' : 'play'}
                        mode="contained"
                        size={30}
                        onPress={() => isPlaying ? player?.pause() : player?.resume()}
                    />
                </View>
            </View>

            {/* Barre de progression */}
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
        backgroundColor: '#282828', // Style sombre typique de Spotify
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    trackInfo: {
        flex: 1,
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
