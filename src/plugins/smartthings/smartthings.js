"use strict";

const Capabilities = require("./capabilities");

exports.plugin = {
  pkg: require("./package.json"),
  register: async function (server, options) {
    server.route({
      method: "GET",
      path: "/capabilities",
      handler: function (request, h) {
        return Capabilities.capabilities;
      },
    });
  },
};
