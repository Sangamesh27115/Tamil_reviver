const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    extraNodeModules: {
      '@react-native-async-storage/async-storage': require.resolve('@react-native-async-storage/async-storage')
    }
  }
};