import fs from "fs";
import yaml from "js-yaml";

import { MonopriceConfiguration } from "./plugins/monoprice/types";

export interface Configuration {
  smartthings: {
    port?: string;
    plugins: string[];
  };
  monoprice?: MonopriceConfiguration;
}

export const loadConfig = () => {
  // default config, empty set of plugins
  let config: Configuration = {
    smartthings: {
      plugins: [],
    },
  };
  try {
    config = yaml.load(
      fs.readFileSync("../config.yaml", "utf8")
    ) as Configuration;
  } catch (e) {
    console.log(e);
  }
  return config;
};
