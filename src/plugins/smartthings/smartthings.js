"use strict";

const Capabilities = require("./capabilities");
const Models = require("./models");
const Package = require("./package.json");

exports.plugin = {
  pkg: Package,
  register: async function (server, options) {
    server.route({
      method: "GET",
      path: "/capabilities",
      handler: function (request, h) {
        return {
          capabilities: Capabilities.capabilities,
          metadata: { id: request.query.id },
        };
      },
      options: {
        description: "Get capabilities",
        notes: "Returns a list of capabilities supported by the server",
        tags: ["api"],
        validate: Models.DefaultRequestModel,
        response: { schema: Models.CapabilitiesResponseModel },
      },
    });
  },
};
