"use script";

import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";

import Package from "./package.json";

module.exports = {
  name: Package.name,
  async register(server: Hapi.Server) {
    await server.register([Inert, Vision]);

    await server.register({
      plugin: HapiSwagger,
      options: {
        info: {
          title: Package.description,
          version: Package.version,
        },
      },
    });
  },
};
