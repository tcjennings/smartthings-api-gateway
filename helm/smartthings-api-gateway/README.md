# SmartThings API Gateway Helm Chart

Installing the STAPIG via Helm chart assumes you have an available Kubernetes cluster and correctly configured `kubectl` with an active context.

## Configure

Create a local instance of the chart's `values.yaml`, for example, `values.local.yaml`. Modify the deployment configuration in this copy; do not add your local values to source control, especially if it may contain secrets.

Refer to the `values.schema.json` file for the possible contents and validation rules for the values file.

## Install

Install the Helm chart using local values, with the preferred project slug `stapig` (SmartThings API Gateway). If you deploy to a namespace, ensure the target namespace already exists.

```
helm install -f ./helm/values.local.yaml stapig ./helm/smartthings-api-gateway
```

## Upgrade

You may upgrade a running chart with a new values configuration or to refresh the container image. The deployment spec in the chart includes a random annotation that should ensure the pod is recreated for every upgrade.

```
helm upgrade -f ./helm/values.local.yaml stapig ./helm/smartthings-api-gateway
```

## Uninstall

You may stop and remove the deployment by uninstalling the chart.

```
helm uninstall stapig
```
