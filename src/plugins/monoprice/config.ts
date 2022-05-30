/**
 * Config module for the Monoprice plugin
 *
 * @module monoprice/config
 */
import type { MonopriceConfiguration } from "./types";

class Config {
  config!: MonopriceConfiguration;

  set_config(options: MonopriceConfiguration) {
    this.config = options;
    return this.config;
  }
}

export const Configuration = new Config();
