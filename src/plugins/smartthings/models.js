/* Joi object models for API validation and responses */

const Joi = require("joi");

const requestID = Joi.string().optional().description("a request ID");

exports.DefaultRequestModel = {
  query: Joi.object({
    id: requestID,
  }),
};

exports.CapabilitiesResponseModel = Joi.object({
  capabilities: Joi.array().items(Joi.string()).required(),
  metadata: Joi.object({
    id: requestID,
  }),
});
