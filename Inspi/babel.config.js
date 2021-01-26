module.exports = function(api) {
  api.cache(true);
  return {
    presets: [["@babel/preset-env"]],
    plugins: [
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-proposal-private-methods", { loose: true }]
    ]
  };
};
