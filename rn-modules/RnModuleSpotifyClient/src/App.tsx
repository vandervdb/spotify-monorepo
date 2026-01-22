import React from 'react';
import {
    Button,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {useSpotifyModule } from './index';

function App(): React.JSX.Element {
    const {
        isConnected,
        authenticateUser,
        disconnect,
        player,
        isDarkMode,
        backgroundStyle
    } = useSpotifyModule();

    return (
        <SafeAreaView style={[styles.flex1, backgroundStyle]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.flex1}>
                <Header />
                <View style={[styles.container, {backgroundColor: isDarkMode ? Colors.black : Colors.white}]}>
                    <Text style={styles.h1}>Spotify Client Module Demo</Text>

                    <Text style={styles.h2}>Auth config</Text>

                    <View style={styles.row}>
                        {isConnected ? (
                            <Button title="Disconnect" onPress={disconnect}/>
                        ) : (
                                <Button title="Start (Module)" onPress={authenticateUser}/>
                        )}
                    </View>
                    <Text style={styles.small}>Connected: {String(isConnected)}</Text>

                    {isConnected && player ? (
                        <>
                            <Text style={styles.h2}>Playback</Text>
                            <TextInput
                                placeholder="spotify:track:... or spotify:album:..."
                                value={player.uri}
                                onChangeText={player.setUri}
                                autoCapitalize="none"
                                style={styles.input}
                            />
                            <View style={styles.row}>
                                <Button title="Play URI" onPress={player.play}/>
                                <View style={styles.spacer}/>
                                <Button title="Pause" onPress={player.pause}/>
                                <View style={styles.spacer}/>
                                <Button title="Resume" onPress={player.resume}/>
                            </View>

                            <View style={styles.row}>
                                <TextInput
                                    placeholder="seek ms"
                                    value={player.positionMs}
                                    onChangeText={player.setPositionMs}
                                    keyboardType="numeric"
                                    style={[styles.input, styles.inputSmall]}
                                />
                                <View style={styles.spacer}/>
                                <Button title="Seek" onPress={player.seek}/>
                                <View style={styles.spacer}/>
                                <Button title="Get State" onPress={player.refreshState}/>
                            </View>
                            <Text style={styles.small}>State: {player.stateText}</Text>

                            <Text style={styles.h2}>Events</Text>

                            <View style={styles.eventsBox}>
                                {(player.events?.length ?? 0) === 0 ? (
                                    <Text style={styles.small}>No events yet…</Text>
                                ) : (
                                    player.events.map((e, idx) => (
                                        <Text key={idx} style={styles.small}>
                                            • {e}
                                        </Text>
                                    ))
                                )}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.h2}>Please login to access player controls.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex1: {flex: 1},
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
  },
    h1: {fontSize: 22, fontWeight: '700', marginTop: 12, marginBottom: 12},
    h2: {fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6},
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#555',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        color: '#222',
        backgroundColor: '#fff',
  },
    inputSmall: {flex: 1},
    row: {flexDirection: 'row', alignItems: 'center', marginVertical: 6},
    spacer: {width: 10},
    small: {fontSize: 12, color: '#666', marginTop: 4},
    eventsBox: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
    marginTop: 8,
        backgroundColor: '#fafafa',
  },
});

export default App;
