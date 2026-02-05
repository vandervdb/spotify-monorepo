const path = require('path');

module.exports = function (api) {
    api.cache(true);
    const root = __dirname;

    return {
        presets: [
            [
                'module:@react-native/babel-preset',
                { useTransformReactJSX: true },
            ],
        ],

        plugins: [
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',
                    path: path.join(process.cwd(), '.env'),
                    safe: false,
                },
            ],

            [
                'module-resolver',
                {
                    extensions: ['.js', '.ts', '.tsx', '.json'],
                    alias: {
                        // polyfills node
                        crypto: 'react-native-quick-crypto',
                        stream: 'readable-stream',
                        buffer: '@craftzdog/react-native-buffer',

                        // workspaces -> source
                        '@core/config': path.resolve(
                            root,
                            'packages/typescript/core-config/src',
                        ),
                        '@core/constants': path.resolve(
                            root,
                            'packages/typescript/core-constants/src',
                        ),
                        '@core/domain': path.resolve(
                            root,
                            'packages/typescript/core-domain/src',
                        ),
                        '@core/dto': path.resolve(
                            root,
                            'packages/typescript/core-dto/src',
                        ),
                        '@core/logger': path.resolve(
                            root,
                            'packages/typescript/core-logger/src',
                        ),
                        '@test/utils': path.resolve(
                            root,
                            'packages/typescript/test-utils/src',
                        ),
                        '@http/client': path.resolve(
                            root,
                            'packages/typescript/http-client/src',
                        ),
                        '@keychain/service': path.resolve(
                            root,
                            'packages/typescript/keychain-service/src',
                        ),
                        '@spotify/client': path.resolve(root, 'rn-lib/src'),
                    },
                },
            ],
        ],
    };
};
