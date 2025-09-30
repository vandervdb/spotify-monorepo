const { getDefaultConfig } = require('metro-config');
const path = require('path');

// liste de tes packages locales à surveiller
const workspaceLibs = [
  'core-config',
  'core-constants',
  'core-domain',
  'core-dto',
  'core-logger',
  'http-client',
  'test-utils',
  'keychain-service',
  'spotify-client',
];

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    resolver: {
      // on enlève 'svg' des assets normaux
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      // on ajoute la prise en charge des .svg
      sourceExts: [...sourceExts, 'svg'],

      // On mappe **TOUS** les modules vers node_modules racine,
      // sauf react et react-native qu'on pointe explicitement
      extraNodeModules: new Proxy(
        {
          react: path.resolve(__dirname, 'node_modules/react'),
          'react-native': path.resolve(__dirname, 'node_modules/react-native'),
        },
        {
          get: (target, name) => {
            if (target[name]) {
              return target[name];
            }
            return path.join(__dirname, `node_modules/${name}`);
          },
        },
      ),
    },

    // on demande à Metro de watcher tes libs locales
    watchFolders: workspaceLibs.map((lib) => path.resolve(__dirname, lib)),
  };
})();
