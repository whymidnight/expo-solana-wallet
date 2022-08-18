const {getDefaultConfig} = require('expo/metro-config');

module.exports = (async () => {
    const config = await getDefaultConfig(__dirname);

    const {resolver} = config;

    config.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...resolver.sourceExts, "jsx", "js", "ts", "tsx", "cjs", 'svg'],
        extraNodeModules: {
          stream: require.resolve("readable-stream"),
        },
    };

    return config;
})();
