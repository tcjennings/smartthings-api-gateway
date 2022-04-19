"use script";

const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const Package = require("./package.json");

module.exports = {
    name: Package.name,
    async register(server) {
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: {
                    info: {
                        title: Package.description,
                        version: Package.version
                    }
                }
            }
        ]);
    }
};
