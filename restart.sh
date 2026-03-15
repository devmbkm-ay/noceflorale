#!/bin/bash

# Stop any running processes (if needed)
echo "Stopping any running processes..."
pkill -f "node.*server.js" || true
pkill -f "next dev" || true

# Clean Next.js cache
echo "Cleaning Next.js cache..."
cd frontend
rm -rf .next
cd ..

# Start the development server
echo "Starting development server..."
npm run dev:all

