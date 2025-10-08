module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '../../.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
