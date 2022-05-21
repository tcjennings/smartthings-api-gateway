import fs from "fs";
import yaml from "js-yaml";

interface MonopriceZone {
  zone: number;
  name: string;
}

interface MonopriceController {
  controller: number | string;
  zones: MonopriceZone[];
}

export interface Configuration {
  smartthings: {
    port?: string;
    plugins: string[];
  },
  monoprice?: {
    options? : {
      routes: {
        prefix: string
      }
    },
    sources: string[];
    controllers: MonopriceController[];
  }
}

export const LoadConfig = () => {
  // default config, empty set of plugins
  let config: Configuration = {
    smartthings: {
      plugins: [],
    },
  };
  try {
    config = yaml.load(fs.readFileSync("config.yaml", "utf8")) as Configuration;
  } catch (e) {
    console.log(e);
  }
  return config;
};
