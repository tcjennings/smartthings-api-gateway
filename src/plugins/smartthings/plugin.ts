"use strict";

import type Hapi from "@hapi/hapi";

import { Capabilities } from "./capabilities";
import { DefaultRequestModel, CapabilitiesResponseModel } from "./models";
import Package from "./package.json";

const Plugin = {
  pkg: Package,
  register: async function (server: Hapi.Server) {
    server.route({
      method: "GET",
      path: "/capabilities",
      handler: function (request, h) {
        return {
          capabilities: Capabilities,
          metadata: { id: request.query.id },
        };
      },
      options: {
        description: "Get capabilities",
        notes: "Returns a list of capabilities supported by the server",
        tags: ["api"],
        validate: DefaultRequestModel,
        response: { schema: CapabilitiesResponseModel },
      },
    });
  },
};

export default Plugin;
