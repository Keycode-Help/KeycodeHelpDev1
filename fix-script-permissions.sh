#!/bin/bash

echo "Fixing script permissions..."

# Make all scripts executable
chmod +x scripts/test.sh
chmod +x scripts/start-dev.sh
chmod +x scripts/stop-dev.sh
chmod +x scripts/kill-ports.sh
chmod +x start-dev-manual.sh

echo "Permissions fixed!"
echo ""
echo "Now you can run:"
echo "  ./scripts/test.sh"
echo "  ./scripts/start-dev.sh"
echo "  ./start-dev-manual.sh"
