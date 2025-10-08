import React, { FC, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import {
  SpotifyLogo,
  useAuthStore,
  usePlayingStore,
} from '@spotify/client';
import { log } from '@core/logger';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Player'>;

const TokenDisplay: FC = observer(() => {
  const authStore = useAuthStore();
  const tokenString = authStore.token ?? 'Chargement...';
  log.debug('TokenDisplay: ', tokenString);
  return (
    <View style={styles.section}>
      <Text>🪪 Token actuel : {tokenString}</Text>
    </View>
  );
});

const PlayerScreen: FC = observer(() => {
  const nowPlayingStore = usePlayingStore();
  const authStore = useAuthStore();
  const navigation = useNavigation<Navigation>();

  // Recharge quand l’écran reprend le focus
  useFocusEffect(
    useCallback(() => {
      if (authStore.token) nowPlayingStore.loadNowPlaying().catch(log.error);
    }, [authStore.token, nowPlayingStore]),
  );

  // Recharge dès qu’un token arrive (premier montage)
  useEffect(() => {
    if (authStore.token && !nowPlayingStore.nowPlayingLoadedOnce) {
      nowPlayingStore.loadNowPlaying().catch(log.error);
    }
  }, [authStore.token, nowPlayingStore]);

  const { artists, title, isPlaying } = nowPlayingStore.nowPlaying;
  const { loading, error } = nowPlayingStore;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
    >
      <View>
        <Text>PlayerScreen</Text>
        <TokenDisplay />

        <View style={styles.section}>
          <View style={styles.hero}>
            <View style={styles.heroTitle}>
              <SpotifyLogo width={240} height={60} />
            </View>

            <TouchableOpacity
              style={styles.whatsNextButton}
              disabled={loading || !authStore.token}
              onPress={() => nowPlayingStore.loadNowPlaying().catch(log.error)}
            >
              <Text style={[styles.textMd, styles.textCenter]}>
                {loading ? 'Chargement…' : 'Refresh Now Playing'}
              </Text>
            </TouchableOpacity>

            {error ? (
              <Text style={[styles.textMd, styles.textCenter]}>
                {error.message}
              </Text>
            ) : loading ? (
              <ActivityIndicator style={{ marginTop: 12 }} />
            ) : (
              <>
                <Text
                  style={[
                    styles.textLg,
                    styles.textCenter,
                    { color: '#fff', marginTop: 16 },
                  ]}
                >
                  {title ?? '—'}
                </Text>
                <Text
                  style={[styles.textMd, styles.textCenter, { color: '#fff' }]}
                >
                  {artists ? artists[0] : '—'}
                </Text>
                <Text
                  style={[
                    styles.textSm,
                    styles.textCenter,
                    { color: '#fff', marginTop: 8 },
                  ]}
                >
                  {isPlaying ? '▶️ En lecture' : '⏸️ En pause'}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#ffffff',
  },
  codeBlock: {
    backgroundColor: 'rgba(55, 65, 81, 1)',
    marginVertical: 12,
    padding: 12,
    borderRadius: 4,
  },
  monospace: {
    color: '#ffffff',
    fontFamily: 'Courier New',
    marginVertical: 4,
  },
  comment: {
    color: '#cccccc',
  },
  marginBottomSm: {
    marginBottom: 6,
  },
  marginBottomMd: {
    marginBottom: 18,
  },
  marginBottomLg: {
    marginBottom: 24,
  },
  textLight: {
    fontWeight: '300',
  },
  textBold: {
    fontWeight: '500',
  },
  textCenter: {
    textAlign: 'center',
  },
  text2XS: {
    fontSize: 12,
  },
  textXS: {
    fontSize: 14,
  },
  textSm: {
    fontSize: 16,
  },
  textMd: {
    fontSize: 18,
  },
  textLg: {
    fontSize: 24,
  },
  textXL: {
    fontSize: 48,
  },
  textContainer: {
    marginVertical: 12,
  },
  textSubtle: {
    color: '#6b7280',
  },
  section: {
    marginVertical: 12,
    marginHorizontal: 12,
  },
  shadowBox: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  appTitleText: {
    paddingTop: 12,
    fontWeight: '500',
  },
  hero: {
    borderRadius: 12,
    backgroundColor: '#143055',
    padding: 36,
    marginBottom: 24,
  },
  heroTitle: {
    flex: 1,
    flexDirection: 'row',
  },
  heroTitleText: {
    color: '#ffffff',
    marginLeft: 12,
  },
  heroText: {
    color: '#ffffff',
    marginVertical: 12,
  },

  connectToCloudButton: {
    backgroundColor: 'rgba(20, 48, 85, 1)',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    width: '50%',
  },

  connectToCloudButtonText: {
    color: '#ffffff',
  },
  whatsNextButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 8,
    width: '50%',
    marginTop: 24,
  },
  learning: {
    marginVertical: 12,
  },
  love: {
    marginTop: 12,
    justifyContent: 'center',
  },
});

export default PlayerScreen;
