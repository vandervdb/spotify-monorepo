import { SERVICES } from '@core/constants';
import * as Keychain from 'react-native-keychain';
import { STORAGE_TYPE } from 'react-native-keychain';
import { log } from '@core/logger';
import {
  SecureStorage,
  TokenData,
  UserCredentials,
} from '@core/domain';

function createSecureStorage<T>(
  storageKey: string,
  service: string,
): SecureStorage<T> {
  const options = {
    service,
    storage: STORAGE_TYPE.AES_GCM,
  };

  const save = async (data: T): Promise<void> => {
    try {
      await Keychain.setGenericPassword(
        storageKey,
        JSON.stringify(data),
        options,
      );
      log.debug('createSecureStorage save: ', data);
    } catch (error) {
      log.error('Erreur lors de la sauvegarde sécurisée', { error, service });
    }
  };

  const get = async (): Promise<T | undefined> => {
    try {
      const result = await Keychain.getGenericPassword(options);
      const resultData = result ? JSON.parse(result.password) : undefined;
      log.debug('createSecureStorage get', resultData);
      return resultData;
    } catch (error) {
      log.error('Erreur lors de la lecture sécurisée', { error, service });
      return undefined;
    }
  };

  return { save, get };
}

export const KeyChainService = {
  token: createSecureStorage<TokenData>('token', SERVICES.API_TOKEN),
  credentials: createSecureStorage<UserCredentials>(
    'user',
    SERVICES.USER_CREDENTIALS,
  ),
};
