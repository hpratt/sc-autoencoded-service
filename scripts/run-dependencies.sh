#!/bin/bash
set -e

# cd to project root directory
cd "$(dirname "$(dirname "$0")")"
scripts/setup-environment.sh

# Run Postgres
echo "Running docker-compose dependencies..."
docker-compose -f docker-compose.deps.yml up -d
until docker exec importer_postgrestest_1 psql -c "select 1" --user postgres > /dev/null 2>&1; do
    sleep 2;
done
echo "Postgres started. Starting import..."

docker exec importer_importertest_1 java -jar /app/annotated-object-importer.jar datasets \
    --db-url jdbc:postgresql://postgrestest:5432/postgres --db-username postgres --db-schema test --replace-schema \
    --id-files dataset\>/data/cells.txt --id-files gene\>/data/genes.txt \
    --coordinate-files dataset=latent\>/data/latent.txt \
    --matrix-files dataset=raw\>/data/raw.txt\;normalized\>/data/normalized.txt\;decoded\>/data/decoded.txt

echo "Dependencies started successfully!"
