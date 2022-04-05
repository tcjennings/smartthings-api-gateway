# SmartThings API Gateway
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The SmartThings API Gateway is an API server designed to run on a local network and provide services to Smart Things Edge devices and drivers.

## Theory of Operation

A device backend is installed as a plugin. The plugin provides all the routes and logic required of the device in a self-contained namespace.

Routes conform to some variation of the template `/plugin/device/{device}/capability/{capability}/` where `capability` is a SmartThings device capability. A `GET` to this endpoint should return a status for the capability, and a `POST` to this endpoint should include a request body containing a command directive supported by the capability.

A plugin should also include a discovery endpoint.

## Stack

- node
- hapi

## Deployment

The API server is available as a container image to be run in Docker, Kubernetes, etc.

### Configuration

A configuration file, `config.yaml` is used to configure plugins. Plugins may define their own configuration layout and requirements.

### Github Actions

## Development

### Prerequisites

See `script/setup`.

### Scripts

The scripts directory contains shell scripts conforming to the [`Scripts To Rule Them All`](https://github.com/github/scripts-to-rule-them-all) pattern.