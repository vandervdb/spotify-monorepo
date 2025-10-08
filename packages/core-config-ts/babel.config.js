const path = require('path');
const fs = require('fs');

// Resolve .env in a monorepo. Prefer the app's .env, then repo root, then package-local.
const resolveEnvPath = () => {
  const candidates = [
    // Preferred: React Native app env file
    path.resolve(__dirname, '../../apps/RnSample/.env'),
    // Fallbacks
    path.resolve(__dirname, '../../.env'), // repo root
    path.resolve(__dirname, '.env'), // package-local (dev fallback)
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  // Default to the app path to keep behavior consistent even if it doesn't exist yet
  return candidates[0];
};

module.exports = {
  presets: [['module:@react-native/babel-preset', { useTransformReactJSX: true }]],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: resolveEnvPath(),
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
