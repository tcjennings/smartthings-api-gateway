/**
 * Models module for the Monoprice plugin. Defines Joi schemas for API requests and responses.
 *
 * @module monoprice/models
 */

import Joi from "joi";

const requestID = Joi.string()
  .optional()
  .description("a request ID")
  .label("RequestId");

const hardwareID = Joi.string()
  .optional()
  .description("an ID for a hardware component within a zone")
  .label("HardwareId");

const responseMetadata = Joi.object({
  id: Joi.string(),
});

export const DefaultRequestModel = {
  query: Joi.object({
    id: requestID,
  }).label("DefaultRequestQuery"),
};

export const ZoneDiscoveryResponseModel = Joi.object({
  zones: Joi.array().items(Joi.string()).length(6),
  metadata: Joi.object({
    controllers: Joi.array().min(1).max(3).items(Joi.string()),
  }),
}).label("ZoneDiscoveryResponse");

export const ZoneNameDiscoveryRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
  }),
  query: Joi.object({
    id: requestID,
  }),
};

export const ZoneNameDiscoveryResponseModel = Joi.object({
  controller: Joi.string(),
  zone: Joi.string(),
  name: Joi.string(),
  metadata: responseMetadata,
}).label("ZoneNameDiscoveryResponse");

export const SourceNamesDiscoveryResponseModel = Joi.object({
  sources: Joi.array()
    .items(Joi.object({ id: Joi.number(), name: Joi.string() }))
    .length(6),
  metadata: responseMetadata,
}).label("SourceNamesDiscoveryResponse");

export const SourceNameDiscoveryResponseModel = Joi.object({
  source: Joi.string(),
  name: Joi.string(),
  metadata: responseMetadata,
}).label("SourceNameDisocveryResponse");

export const CapabilityCommandRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
    capability: Joi.string().required(),
  }),
  query: Joi.object({
    id: requestID,
  }),
};

export const CapabilityAttributeRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
    capability: Joi.string().required(),
    attribute: Joi.string().required(),
  }),
  query: Joi.object({
    id: requestID,
    hw: hardwareID,
  }),
};

export const CapabilityCommandResponseModel = Joi.object({
  capability: Joi.string(),
  attributes: Joi.object(),
  metadata: Joi.object({
    controller: Joi.string(),
    zone: Joi.string(),
    id: Joi.string(),
  }).label("ResponseMetadata"),
}).label("CapabilityCommandResponse");

export const CapabilityCallCommandRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
  }).label("CapabilityCallCommandRequestParams"),
  payload: Joi.object({
    hw: Joi.string()
      .required()
      .description("The hardware within the zone supporting the capability"),
    capability: Joi.string()
      .required()
      .description("The SmartThings capability supporting the command"),
    command: Joi.string()
      .required()
      .description("The command to execute on the capability"),
    args: Joi.object().description("An object containing command arguments"),
  }).label("CapabilityCallCommandRequestPayload"),
};

export const CapabilityCallCommandResponseModel = Joi.object().label(
  "CapabilityCallCommandResponse"
);

export const CapabilityCallStatusRequestModel = {
  params: Joi.object({
    controller: Joi.string().required(),
    zone: Joi.string().required(),
  }).label("CapabilityCallCommandRequestParams"),
};
