import {Card, Text} from "react-native-paper";
import {TouchableOpacity, StyleSheet} from "react-native";
import React from "react";

export interface MiniPlayerDisconnectedProps {
    authenticate?: () => void;
}

const MiniPlayerDisconnected = ({authenticate} : MiniPlayerDisconnectedProps) => {
    return (
        <Card style={styles.container}>
            <TouchableOpacity style={styles.authButton} onPress={authenticate}>
                <Text style={styles.authText}>Se connecter à Spotify</Text>
            </TouchableOpacity>
        </Card>
    );
};
export default MiniPlayerDisconnected;

const styles = StyleSheet.create(
    {
        container: {
            margin: 8,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#282828',
        },
        authButton: {
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        authText: {
            color: '#1DB954',
            fontWeight: 'bold',
        },
    }
);
