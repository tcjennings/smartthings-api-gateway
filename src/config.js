const fs = require("fs");
const yaml = require("js-yaml");

const LoadConfigs = () => {
  // default config, empty set of plugins
  let config = {
    smarthings: {
      plugins: [],
    },
  };
  try {
    config = yaml.load(fs.readFileSync("config.yaml", "utf8"));
  } catch (e) {
    console.log(e);
  }
  return config;
};

exports.LoadConfigs = LoadConfigs;
