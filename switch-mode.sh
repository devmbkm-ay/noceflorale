#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display script usage
show_usage() {
  echo -e "${BLUE}Usage:${NC}"
  echo -e "  ./switch-mode.sh [dev|prod] [--build] [--start]"
  echo
  echo -e "${BLUE}Options:${NC}"
  echo -e "  dev               Switch to development mode"
  echo -e "  prod              Switch to production mode"
  echo -e "  --build, -b       Build the application after switching modes"
  echo -e "  --start, -s       Start the application after switching modes"
  echo -e "  --help, -h        Show this help message"
  echo
  echo -e "${BLUE}Examples:${NC}"
  echo -e "  ./switch-mode.sh dev             # Switch to development mode"
  echo -e "  ./switch-mode.sh prod --build    # Switch to production mode and build the app"
  echo -e "  ./switch-mode.sh dev --start     # Switch to development mode and start the app"
  echo -e "  ./switch-mode.sh prod -b -s      # Switch to production, build and start the app"
}

# Parse command line arguments
MODE=""
BUILD=false
START=false

# Check if no arguments were provided
if [ $# -eq 0 ]; then
  show_usage
  exit 1
fi

# Process command line arguments
for arg in "$@"; do
  case $arg in
    dev)
      MODE="development"
      ;;
    prod)
      MODE="production"
      ;;
    --build|-b)
      BUILD=true
      ;;
    --start|-s)
      START=true
      ;;
    --help|-h)
      show_usage
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $arg${NC}"
      show_usage
      exit 1
      ;;
  esac
done

# Check if mode was specified
if [ -z "$MODE" ]; then
  echo -e "${RED}Error: You must specify either 'dev' or 'prod' mode${NC}"
  show_usage
  exit 1
fi

# Function to update the .env file
update_env_file() {
  local env_file=$1
  local current_mode=$(grep "NODE_ENV=" "$env_file" | cut -d'=' -f2 | tr -d '"' | tr -d "'")
  
  if [ -n "$current_mode" ]; then
    echo -e "${YELLOW}Current mode in $env_file: $current_mode${NC}"
    echo -e "${GREEN}Setting NODE_ENV to $MODE in $env_file${NC}"
    sed -i "s/NODE_ENV=.*/NODE_ENV=$MODE/" "$env_file"
  else
    echo -e "${YELLOW}NODE_ENV not found in $env_file, adding it...${NC}"
    echo "NODE_ENV=$MODE" >> "$env_file"
  fi
}

# Main logic
echo -e "${BLUE}=== Switching to $MODE mode ===${NC}"

# Update .env files
if [ -f ".env" ]; then
  update_env_file ".env"
fi

if [ -f "frontend/.env" ]; then
  update_env_file "frontend/.env"
fi

if [ -f "backend/.env" ]; then
  update_env_file "backend/.env"
fi

# Set environment variable for current session
export NODE_ENV=$MODE
echo -e "${GREEN}NODE_ENV is now set to $MODE for the current shell session${NC}"

# Optionally build the application
if [ "$BUILD" = true ]; then
  echo -e "${BLUE}=== Building the application in $MODE mode ===${NC}"
  if [ "$MODE" = "development" ]; then
    npm run build:dev
  else
    npm run build:prod
  fi
fi

# Optionally start the application
if [ "$START" = true ]; then
  echo -e "${BLUE}=== Starting the application in $MODE mode ===${NC}"
  if [ "$MODE" = "development" ]; then
    npm run dev
  else
    npm run prod
  fi
fi

# Print instructions if not starting automatically
if [ "$START" = false ]; then
  echo
  echo -e "${BLUE}=== Next steps ===${NC}"
  if [ "$MODE" = "development" ]; then
    echo -e "${GREEN}To start the application in development mode, run:${NC}"
    echo -e "  npm run dev         # Start both frontend and backend"
    echo -e "  npm run dev:backend # Start only the backend"
    echo -e "  npm run dev:frontend # Start only the frontend"
  else
    echo -e "${GREEN}To start the application in production mode, run:${NC}"
    echo -e "  npm run prod        # Start the production server"
    echo -e "  npm run prod:backend # Start only the backend in production mode"
  fi
fi

echo
echo -e "${GREEN}Mode switch complete!${NC}"

