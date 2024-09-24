#!/bin/sh

# Check if seeding is required, e.g., based on an env variable
if [ "$RUN_SEED" = "true" ]; then
  echo "Running seed.js to populate the database..."
  node /app/seed.js
else
  echo "Skipping database seeding..."
fi

# Start the application
node /app/server.js
