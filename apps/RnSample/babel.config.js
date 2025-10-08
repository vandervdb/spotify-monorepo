module.exports = function (api) {
    api.cache(true);
    const rootFactory = require('../../babel.config.js');
    return typeof rootFactory === 'function' ? rootFactory(api) : rootFactory;
};
