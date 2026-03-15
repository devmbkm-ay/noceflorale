#!/usr/bin/env node

/**
 * This utility script synchronizes port configuration between backend and frontend.
 * It reads the current-port.txt file from the backend and updates .env.local in the frontend.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const backendPortFile = path.join(rootDir, 'backend', 'current-port.txt');
const envFile = path.join(rootDir, 'frontend', '.env.local');

// Function to read the current port
function getCurrentPort() {
  try {
    if (fs.existsSync(backendPortFile)) {
      const port = fs.readFileSync(backendPortFile, 'utf8').trim();
      return port;
    } else {
      console.warn('⚠️ No current-port.txt file found. Using default port 4001.');
      return '4001';
    }
  } catch (error) {
    console.error('❌ Error reading port file:', error.message);
    console.warn('⚠️ Using default port 4001.');
    return '4001';
  }
}

// Function to update the environment file
function updateEnvFile(port) {
  try {
    // Check if env file exists
    if (!fs.existsSync(envFile)) {
      console.warn('⚠️ No .env.local file found. Creating a new one.');
      fs.writeFileSync(envFile, `# API URL - GraphQL endpoint for local development
NEXT_PUBLIC_API_URL="http://localhost:${port}/graphql"

# Mock data toggle
NEXT_PUBLIC_USE_MOCKS="false"

# Environment
NODE_ENV="development"

# Base URL for assets and API calls
# Empty for local development
NEXT_PUBLIC_BASE_URL=""
`);
      console.log(`✅ Created new .env.local file with port ${port}`);
      return;
    }

    // Read the current env file
    let envContent = fs.readFileSync(envFile, 'utf8');

    // Update the API URL with the correct port
    const updatedContent = envContent.replace(
      /NEXT_PUBLIC_API_URL=["']http:\/\/localhost:(\d+)\/graphql["']/,
      `NEXT_PUBLIC_API_URL="http://localhost:${port}/graphql"`
    );

    // Save the updated content
    fs.writeFileSync(envFile, updatedContent);
    console.log(`✅ Updated .env.local with port ${port}`);

  } catch (error) {
    console.error('❌ Error updating env file:', error.message);
  }
}

// Function to update the Apollo client file
function updateApolloClient(port) {
  const apolloClientFile = path.join(rootDir, 'frontend', 'src', 'lib', 'apollo-client.ts');
  
  try {
    if (!fs.existsSync(apolloClientFile)) {
      console.warn('⚠️ Apollo client file not found at the expected path.');
      return;
    }

    // Read the current apollo client file
    let apolloContent = fs.readFileSync(apolloClientFile, 'utf8');

    // Update the port in the apollo client
    const updatedContent = apolloContent.replace(
      /http:\/\/localhost:(\d+)\/graphql/g, 
      `http://localhost:${port}/graphql`
    );

    // Save the updated content
    fs.writeFileSync(apolloClientFile, updatedContent);
    console.log(`✅ Updated apollo-client.ts with port ${port}`);

  } catch (error) {
    console.error('❌ Error updating Apollo client file:', error.message);
  }
}

// Main function
function main() {
  console.log('🔄 Synchronizing port configuration...');
  
  const port = getCurrentPort();
  console.log(`📊 Current port: ${port}`);
  
  updateEnvFile(port);
  updateApolloClient(port);
  
  console.log('✨ Port configuration synchronized successfully!');
  console.log('🚀 Remember to restart your frontend application for changes to take effect.');
}

// Run the script
main();
