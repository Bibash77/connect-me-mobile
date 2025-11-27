module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@helpers': './src/helpers',
          '@hooks': './src/hooks',
          '@redux': './src/redux',
          '@routes': './src/routes',
          '@screens': './src/screens',
          '@sheets': './src/sheets',
          '@themes': './src/themes',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
