const path = require('path');

module.exports = {
  presets: [
    ['module:@react-native/babel-preset', { useTransformReactJSX: true }],
  ],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          crypto: 'react-native-quick-crypto',
          stream: 'readable-stream',
          buffer: '@craftzdog/react-native-buffer',

          '@core/config': path.resolve(
            __dirname,
            'packages/core-config-ts/src',
          ),
          '@core/constants': path.resolve(
            __dirname,
            'packages/core-constants-ts/src',
          ),
          '@core/domain': path.resolve(
            __dirname,
            'packages/core-domain-ts/src',
          ),
          '@core/dto': path.resolve(
            __dirname,
            'packages/core-dto-ts/src',
          ),
          '@core/logger': path.resolve(
            __dirname,
            'packages/core-logger-ts/src',
          ),
          '@test/utils': path.resolve(
            __dirname,
            'packages/test-utils-ts/src',
          ),
          '@http/client': path.resolve(
            __dirname,
            'packages/http-client-ts/src',
          ),
          '@keychain/service': path.resolve(
            __dirname,
            'packages/keychain-service-ts/src',
          ),
          '@spotify/client': path.resolve(
            __dirname,
            'spotify-client/src',
          ),
        },
        extensions: ['.js', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
