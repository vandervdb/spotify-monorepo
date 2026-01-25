const rootFactory = require("../../babel.config");

module.exports = function (api) {
    api.cache(true);
    const rootConfig = typeof rootFactory === 'function' ? rootFactory(api) : rootFactory;

    return {
        ...rootConfig,
        plugins: [
            ...(rootConfig.plugins || []),
            'react-native-reanimated/plugin',
        ],
    };
};
