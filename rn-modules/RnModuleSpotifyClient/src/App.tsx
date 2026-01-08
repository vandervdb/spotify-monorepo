import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    Alert,
    Button,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {player} from './index';
import type {AuthConfig} from '../specs/NativeSpotifyClientModule';
import {log} from '@core/logger'

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = useMemo(
        () => ({backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}),
        [isDarkMode],
    );

    const [clientId, setClientId] = useState<string>('');
    const [redirectUrl, setRedirectUrl] = useState<string>('');
    const [scopes, setScopes] = useState<string>('app-remote-control user-modify-playback-state');
    const [showDialog, setShowDialog] = useState<boolean>(true);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [uri, setUri] = useState<string>('spotify:track:11dFghVXANMlKmJXsNCbNl');
    const [positionMs, setPositionMs] = useState<string>('0');

    const [stateText, setStateText] = useState<string>('—');
    const eventsRef = useRef<Array<string>>([]);
    const [, setForceRerender] = useState(0);

    const config: AuthConfig = useMemo(
        () => ({
            clientId: clientId.trim(),
            redirectUrl: redirectUrl.trim(),
            scopes: scopes
                .split(/\s+/)
                .map(s => s.trim())
                .filter(Boolean),
            showDialog,
        }),
        [clientId, redirectUrl, scopes, showDialog],
    );

    // Helper to show errors
    const withCatch = useCallback(async (fn: () => Promise<any>) => {
        try {
            await fn();
        } catch (e: any) {
            log.error(e);
            Alert.alert('Error', e?.message ?? String(e));
        }
    }, []);

    const startWithModuleActivityResult = useCallback(() => {
        withCatch(async () => {
            await player.startUpWithModuleActivityResult(config);
            setIsConnected(true);
        }).then(r => log.error(r));
    }, [config, withCatch]);

    const startWithHostActivityResult = useCallback(() => {
        withCatch(async () => {
            await player.startUpWithHostActivityResult(config);
            setIsConnected(true);
        }).then(r => log.error(r));
    }, [config, withCatch]);

    const disconnect = useCallback(() => {
        withCatch(async () => {
            await player.disconnect();
            setIsConnected(false);
        }).then(r => log.error(r));
    }, [withCatch]);

    const play = useCallback(() => {
        withCatch(async () => {
            await player.playUri(uri.trim());
        }).then(r => log.error(r));
    }, [uri, withCatch]);

    const pause = useCallback(() => withCatch(player.pause), [withCatch]);
    const resume = useCallback(() => withCatch(player.resume), [withCatch]);

    const seek = useCallback(() => {
        const ms = Number(positionMs);
        if (Number.isNaN(ms)) {
            Alert.alert('Invalid position', 'Enter milliseconds as a number');
            return;
        }
        withCatch(async () => {
            await player.seekTo(ms);
        }).then(r => log.error(r));
    }, [positionMs, withCatch]);

    const refreshState = useCallback(() => {
        withCatch(async () => {
            const st = await player.getState();
            setStateText(
                `Playing: ${st.isPlaying} | pos=${st.positionMs}/${st.durationMs} | ` +
                `${st.trackName ?? '—'} — ${st.artistName ?? '—'}`,
            );
        }).then(r => log.error(r));
    }, [withCatch]);

    // Player events
    useEffect(() => {
        const sub = player.addListener(e => {
            // Keep a short log of last 10 events
            eventsRef.current = [JSON.stringify(e)].concat(eventsRef.current).slice(0, 10);
            setForceRerender((x: number) => x + 1);
        });
        return () => sub.remove();
    }, []);

    const startEvents = useCallback(() => withCatch(player.startEvents), [withCatch]);
    const stopEvents = useCallback(() => withCatch(player.stopEvents), [withCatch]);

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
                  <TextInput
                      placeholder="clientId"
                      value={clientId}
                      onChangeText={setClientId}
                      autoCapitalize="none"
                      style={styles.input}
                  />
                  <TextInput
                      placeholder="redirectUrl (e.g. yourapp://callback)"
                      value={redirectUrl}
                      onChangeText={setRedirectUrl}
                      autoCapitalize="none"
                      style={styles.input}
                  />
                  <TextInput
                      placeholder="scopes (space separated)"
                      value={scopes}
                      onChangeText={setScopes}
                      autoCapitalize="none"
                      style={styles.input}
                  />
                  <View style={styles.row}>
                      <Button title="Start (Module)" onPress={startWithModuleActivityResult}/>
                      <View style={styles.spacer}/>
                      <Button title="Start (Host)" onPress={startWithHostActivityResult}/>
                      <View style={styles.spacer}/>
                      <Button title="Disconnect" onPress={disconnect}/>
                  </View>
                  <Text style={styles.small}>Connected: {String(isConnected)}</Text>

                  <Text style={styles.h2}>Playback</Text>
                  <TextInput
                      placeholder="spotify:track:... or spotify:album:..."
                      value={uri}
                      onChangeText={setUri}
                      autoCapitalize="none"
                      style={styles.input}
                  />
                  <View style={styles.row}>
                      <Button title="Play URI" onPress={play}/>
                      <View style={styles.spacer}/>
                      <Button title="Pause" onPress={pause}/>
                      <View style={styles.spacer}/>
                      <Button title="Resume" onPress={resume}/>
                  </View>

                  <View style={styles.row}>
                      <TextInput
                          placeholder="seek ms"
                          value={positionMs}
                          onChangeText={setPositionMs}
                          keyboardType="numeric"
                          style={[styles.input, styles.inputSmall]}
                      />
                      <View style={styles.spacer}/>
                      <Button title="Seek" onPress={seek}/>
                      <View style={styles.spacer}/>
                      <Button title="Get State" onPress={refreshState}/>
                  </View>
                  <Text style={styles.small}>State: {stateText}</Text>

                  <Text style={styles.h2}>Events</Text>
                  <View style={styles.row}>
                      <Button title="Start Events" onPress={startEvents}/>
                      <View style={styles.spacer}/>
                      <Button title="Stop Events" onPress={stopEvents}/>
                  </View>
                  <View style={styles.eventsBox}>
                      {eventsRef.current.length === 0 ? (
                          <Text style={styles.small}>No events yet…</Text>
                      ) : (
                          eventsRef.current.map((e, idx) => (
                              <Text key={idx} style={styles.small}>
                                  • {e}
                              </Text>
                          ))
                      )}
                  </View>
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
