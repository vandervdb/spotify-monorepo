const path = require('path');

module.exports = function (api) {
    api.cache(true);
    const root = __dirname;

    return {
        presets: [['module:@react-native/babel-preset', { useTransformReactJSX: true }]],

        plugins: [
            ['module:react-native-dotenv', {
                moduleName: '@env',
                path: path.join(process.cwd(), '.env'),
                safe: false,
            }],

            ['module-resolver', {
                extensions: ['.js', '.ts', '.tsx', '.json'],
                alias: {
                    // polyfills node
                    crypto: 'react-native-quick-crypto',
                    stream: 'readable-stream',
                    buffer: '@craftzdog/react-native-buffer',

                    // workspaces -> source
                    '@core/config':     path.resolve(root, 'packages/core-config-ts/src'),
                    '@core/constants':  path.resolve(root, 'packages/core-constants-ts/src'),
                    '@core/domain':     path.resolve(root, 'packages/core-domain-ts/src'),
                    '@core/dto':        path.resolve(root, 'packages/core-dto-ts/src'),
                    '@core/logger':     path.resolve(root, 'packages/core-logger-ts/src'),
                    '@test/utils':      path.resolve(root, 'packages/test-utils-ts/src'),
                    '@http/client':     path.resolve(root, 'packages/http-client-ts/src'),
                    '@keychain/service':path.resolve(root, 'packages/keychain-service-ts/src'),
                    '@spotify/client':  path.resolve(root, 'rn-lib/src'),
                },
            }],
        ],
    };
};
