const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '../../');
const appNodeModules = path.resolve(__dirname, 'node_modules');
const rootNodeModules = path.join(root, 'node_modules');
const envFile = require('path').join(__dirname, './env.ts');

const defaultConfig = getDefaultConfig(__dirname);
const assetExts = defaultConfig.resolver.assetExts.filter((e) => e !== 'svg');
const sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

const config = {
    projectRoot: __dirname,
    resolver: {
        ...defaultConfig.resolver,
        nodeModulesPaths: [appNodeModules, rootNodeModules],
        extraNodeModules: {
            '@core/config':      path.resolve(root, 'packages/core-config-ts/src'),
            '@core/constants':   path.resolve(root, 'packages/core-constants-ts/src'),
            '@core/domain':      path.resolve(root, 'packages/core-domain-ts/src'),
            '@core/dto':         path.resolve(root, 'packages/core-dto-ts/src'),
            '@core/logger':      path.resolve(root, 'packages/core-logger-ts/src'),
            '@test/utils':       path.resolve(root, 'packages/test-utils-ts/src'),
            '@http/client':      path.resolve(root, 'packages/http-client-ts/src'),
            '@keychain/service': path.resolve(root, 'packages/keychain-service-ts/src'),
            '@spotify/client':   path.resolve(root, 'rn-lib/src'),
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
        path.resolve(root, 'packages/core-config-ts'),
        path.resolve(root, 'packages/core-constants-ts'),
        path.resolve(root, 'packages/core-domain-ts'),
        path.resolve(root, 'packages/core-dto-ts'),
        path.resolve(root, 'packages/core-logger-ts'),
        path.resolve(root, 'packages/test-utils-ts'),
        path.resolve(root, 'packages/http-client-ts'),
        path.resolve(root, 'packages/keychain-service-ts'),
        path.resolve(root, 'rn-lib'),
    ],

    server: {
        enhanceMiddleware: (middleware) => {
            const base = typeof middleware === 'function' ? middleware : (_req,_res,next)=>next();
            return (req,res,next) => base(req,res,next);
        },

    },
};

module.exports = mergeConfig(defaultConfig, config);
