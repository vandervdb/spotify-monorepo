const config = {
    displayName: 'http-client',
    preset: '../jest.preset.js',
    testEnvironment: 'jsdom',
    setupFiles: ['react-native/jest/setup.js'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    // ✅ on ne passe PAS de preset ici ; babel-jest va lire ton babel.config.js (=> babel.shared.js)
    transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native' +
            '|@react-native' +
            '|@react-navigation' +
            '|react-native-gesture-handler' +
            '|react-native-reanimated' +
            '|react-native-safe-area-context' +
            '|react-native-screens' +
            '|react-native-vector-icons' +
            '|expo' +
            '|@expo' +
            '|expo-.*' +
            '|@unimodules/.*' +
            '|unimodules' +
            '|sentry-expo' +
            ')/)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        '^@react-native-spotify/core-config$': '<rootDir>/../core-config/src',
        '^@react-native-spotify/core-constants$': '<rootDir>/../core-constants/src',
        '^@react-native-spotify/core-domain$': '<rootDir>/../core-domain/src',
        '^@react-native-spotify/core-dto$': '<rootDir>/../core-dto/src',
        '^@react-native-spotify/core-logger$': '<rootDir>/../core-logger/src',
        '^@react-native-spotify/test-utils$': '<rootDir>/../test-utils/src',
        '^@react-native-spotify/http-client$': '<rootDir>/../http-client/src',
        '^@react-native-spotify/keychain-service$': '<rootDir>/../keychain-service/src',
        '^@react-native-spotify/spotify-client$': '<rootDir>/../spotify-client/src',
        '\\.(gif|jpe?g|png|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    coverageDirectory: 'test-output/jest/coverage',
};
export default config;
