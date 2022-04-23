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
  - joi

## Deployment

The API server can be run directly from the repo and is available as a container image to be run in Docker, Kubernetes, etc.

### Running From Repo

Execute `npm run dev:serve` to run the server in the foreground with auto-reload for code changes.

### Docker Images

The API server is packaged as a Docker image supporting `amd64`, `arm64`, and `arm/v7`. This should allow the API server to run on Raspberry Pi 2/3/4 as well as most modern systems.

### Docker Compose


### Helm Chart

The API server can be deployed to a Kubernetes cluster, such as `k3s`, using the Chart in `./helm`. Update the `./helm/values.yaml` and `./helm/config.yaml` to match the configuration requirements of your environment.

Use `helm [install|upgrade] [-f values.local.yaml] stapig ./helm/smartthings-api-gateway` to deploy the Chart to your cluster.

### Configuration

A configuration file, `config.yaml` is used to configure plugins. Plugins may define their own configuration layout and requirements. The `config.yaml` in the `./src` directory is used when directly running the server. Helm Charts load config from `./helm/config.yaml` and for other Docker deployments you should host-mount a `config.yaml` at the container location `/opt/app/config.yaml`.

### Github Actions

The `.github` directory contains a GitHub Action that will build and deploy this application's container image to GitHub Container Registry. This action builds a multi-architecture image for the `amd64`, `arm64`, and `arm` platforms.

If you fork this application, this action will target *your* GitHub Actions and Container Registry, which may incur fees for non-public repositories.

## Development

### Prerequisites

See `script/setup`.

### Scripts

The scripts directory contains shell scripts conforming to the [`Scripts To Rule Them All`](https://github.com/github/scripts-to-rule-them-all) pattern.
