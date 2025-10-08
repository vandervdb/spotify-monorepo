const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '../../');
const appNodeModules = path.resolve(__dirname, 'node_modules');
const rootNodeModules = path.join(root, 'node_modules');
const envFile = require('path').join(__dirname, './env.ts');

const workspaceLibs = [
    path.resolve(__dirname, '../../packages/core-config-ts'),
    path.resolve(__dirname, '../../packages/core-constants-ts'),
    path.resolve(__dirname, '../../packages/core-domain-ts'),
    path.resolve(__dirname, '../../packages/core-dto-ts'),
    path.resolve(__dirname, '../../packages/core-logger-ts'),
    path.resolve(__dirname, '../../packages/http-client-ts'),
    path.resolve(__dirname, '../../packages/test-utils-ts'),
    path.resolve(__dirname, '../../packages/keychain-service-ts'),
    path.resolve(__dirname, '../../rn-lib'),
];

const defaultConfig = getDefaultConfig(__dirname);
const assetExts = defaultConfig.resolver.assetExts.filter((e) => e !== 'svg');
const sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

const config = {
    projectRoot: __dirname,
    resolver: {
        ...defaultConfig.resolver,
        nodeModulesPaths: [appNodeModules, rootNodeModules],
        extraNodeModules: new Proxy(
            {
                '@env': envFile,
                react: path.join(rootNodeModules, 'react'),
                'react-native': path.join(rootNodeModules, 'react-native'),
            },
            { get: (target, name) => target[name] || path.join(rootNodeModules, name) }
        ),
        assetExts,
        sourceExts,
        disableHierarchicalLookup: true,
        resolverMainFields: ['react-native', 'browser', 'main'],
    },

    transformer: {
        ...defaultConfig.transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },

    watchFolders: [rootNodeModules, ...workspaceLibs],

    server: {
        enhanceMiddleware: (middleware) => {
            const base = typeof middleware === 'function' ? middleware : (_req,_res,next)=>next();
            return (req,res,next) => base(req,res,next);
        },

    },
};

module.exports = mergeConfig(defaultConfig, config);
