/* Joi object models for API validation and responses */

import Joi from "joi";

const requestID = Joi.string().optional().description("a request ID");

const DefaultRequestModel = {
  query: Joi.object({
    id: requestID,
  }),
};

const CapabilitiesResponseModel = Joi.object({
  capabilities: Joi.array().items(Joi.string()).required(),
  metadata: Joi.object({
    id: requestID,
  }),
}).label("CapabilitiesResponse");

export { DefaultRequestModel };
export { CapabilitiesResponseModel };
