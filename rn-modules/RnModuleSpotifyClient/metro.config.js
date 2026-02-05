const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const root = path.resolve(__dirname, '../../');
const appNodeModules = path.resolve(__dirname, 'node_modules');
const rootNodeModules = path.join(root, 'node_modules');
const envFile = require('path').join(__dirname, './env.ts');

const defaultConfig = getDefaultConfig(__dirname);
const assetExts = defaultConfig.resolver.assetExts.filter(e => e !== 'svg');
const sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

const config = {
    projectRoot: __dirname,
    resolver: {
        ...defaultConfig.resolver,
        nodeModulesPaths: [appNodeModules, rootNodeModules],
        extraNodeModules: {
            '@core/config': path.resolve(root, 'packages/typescript/core-config/src'),
            '@core/constants': path.resolve(root, 'packages/typescript/core-constants/src'),
            '@core/domain': path.resolve(root, 'packages/typescript/core-domain/src'),
            '@core/dto': path.resolve(root, 'packages/typescript/core-dto/src'),
            '@core/logger': path.resolve(root, 'packages/typescript/core-logger/src'),
            '@test/utils': path.resolve(root, 'packages/typescript/test-utils/src'),
            '@http/client': path.resolve(root, 'packages/typescript/http-client/src'),
            '@keychain/service': path.resolve(root, 'packages/typescript/keychain-service/src'),
            '@spotify/client': path.resolve(root, 'rn-lib/src'),
        },
        assetExts,
        sourceExts,
        disableHierarchicalLookup: true,
        resolverMainFields: ['react-native', 'browser', 'main'],
    },

    transformer: {
        ...defaultConfig.transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },

    watchFolders: [
        rootNodeModules,
        path.resolve(root, 'packages/typescript/core-config'),
        path.resolve(root, 'packages/typescript/core-constants'),
        path.resolve(root, 'packages/typescript/core-domain'),
        path.resolve(root, 'packages/typescript/core-dto'),
        path.resolve(root, 'packages/typescript/core-logger'),
        path.resolve(root, 'packages/typescript/test-utils'),
        path.resolve(root, 'packages/typescript/http-client'),
        path.resolve(root, 'packages/typescript/keychain-service'),
        path.resolve(root, 'rn-lib'),
    ],

    server: {
        enhanceMiddleware: middleware => {
            const base = typeof middleware === 'function' ? middleware : (_req, _res, next) => next();
            return (req, res, next) => base(req, res, next);
        },
    },
};

module.exports = mergeConfig(defaultConfig, config);
