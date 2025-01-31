#!/bin/bash
# Deploys to kubernetes. Takes 2 args.
# arg1: environment, ie staging. This should match up with filename prefixes for scripts/lib/${arg1}.env.sh and k8s/${arg1}.yml.
# arg2: schema to run the import against.
# arg3: (Optional) version of the importer to use. If omitted, user will be prompted with a list of available versions.
# Example usage: scripts/run-importer.sh staging import_01_22_2019 v1.0.0
set -e

# cd to project root directory
cd "$(dirname "$(dirname "$0")")"

# import common stuff
source scripts/lib/common.sh

# Exit if two args not given
if [[ -z "$2" ]]; then
    echo "At least two arguments required.";
    exit;
fi

# If a tag was provided, use it. Otherwise let the user select one.
if [[ ! -z "${3}" ]]; then
    TAG=${3}
else
    TAGS=( $(gcloud container images list-tags gcr.io/$GKE_PROJECT/$IMPORTER_DOCKER_IMAGE_NAME --limit=10 --format="get(tags)") )
    echo "Please select a docker image tag to deploy:"
    select TAG in ${TAGS[@]}
    do
        if [[ ! -z "${TAG}" ]]; then
            echo "Deploying ${TAG}..."
            break
        else
            echo "Invalid selection..."
        fi
    done
fi

gcloud --quiet config set project $GKE_PROJECT
gcloud --quiet config set container/cluster $GKE_CLUSTER
gcloud --quiet config set compute/zone $GKE_ZONE
gcloud --quiet container clusters get-credentials $GKE_CLUSTER

# If this job already exists and is running, do not run.
if kubectl get job import-autoencoded-sc-job &>/dev/null ; then
    echo "Existing import-autoencoded-sc-job found. Deleting..."
    kubectl delete job import-autoencoded-sc-job
fi

# Deploy the configured service / Apply any changes to the configuration.
sed -e "s/\${IMPORTER_VERSION}/${TAG}/" \
    -e "s/\${DB_SCHEMA}/${2}/" \
    k8s/importer-${1}.yml | \
    kubectl create -f -
