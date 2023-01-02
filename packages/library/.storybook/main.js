const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mdx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/preset-create-react-app',
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5"
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
};
