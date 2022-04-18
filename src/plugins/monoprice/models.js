const Joi = require("joi");

const requestID = Joi.string().optional().description("a request ID");

const responseMetadata = Joi.object({
  id: Joi.string(),
});

exports.DefaultRequestModel = {
  query: Joi.object({
    id: requestID,
  }),
};

exports.ZoneDiscoveryResponseModel = Joi.object({
  zones: Joi.array().items(Joi.string()).length(6),
  metadata: Joi.object({
    controllers: Joi.array().min(1).max(3).items(Joi.string()),
  }),
});

exports.ZoneNameDiscoveryRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
  }),
  query: Joi.object({
    id: requestID,
  }),
};

exports.ZoneNameDiscoveryResponseModel = Joi.object({
  controller: Joi.string(),
  zone: Joi.string(),
  name: Joi.string(),
  metadata: responseMetadata,
});

exports.SourceNamesDiscoveryResponseModel = Joi.object({
  sources: Joi.array()
    .items(Joi.object({ id: Joi.number(), name: Joi.string() }))
    .length(6),
  metadata: responseMetadata,
});

exports.SourceNameDiscoveryResponseModel = Joi.object({
  source: Joi.string(),
  name: Joi.string(),
  metadata: responseMetadata,
});

exports.CapabilityCommandRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
    capability: Joi.string().required(),
  }),
  query: Joi.object({
    id: requestID,
  }),
};

exports.CapabilityCommandResponseModel = Joi.object({
  capability: Joi.string(),
  attributes: Joi.object(),
  metadata: Joi.object({
    controller: Joi.string(),
    zone: Joi.string(),
    id: Joi.string(),
  }),
});
