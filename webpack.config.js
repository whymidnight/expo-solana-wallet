const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.module.rules.push(
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto"
  });

  config.stats = "detailed";

  return config;
};
