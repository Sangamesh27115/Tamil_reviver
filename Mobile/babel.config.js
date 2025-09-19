module.exports = {
  presets: ['module:@expo/metro-runtime'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@services': './src/services',
          '@contexts': './src/contexts'
        }
      }
    ]
  ]
};