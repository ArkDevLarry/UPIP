module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // keep ONLY if you use reanimated, and keep it last:
      "react-native-reanimated/plugin",
    ],
  };
};