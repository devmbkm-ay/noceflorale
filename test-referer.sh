#!/bin/bash

# Test script for Referer header validation
# This script tests the RSVP submission with different Referer headers

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# GraphQL endpoint - change this to your actual server
SERVER_URL="http://localhost:4000/graphql"

# Check if server is running
echo -e "${YELLOW}Checking if server is running at $SERVER_URL...${NC}"
if ! curl -s -o /dev/null -w "%{http_code}" $SERVER_URL; then
  echo -e "${RED}Server not running! Please start the server first.${NC}"
  exit 1
fi

echo -e "${GREEN}Server is running.${NC}\n"

# GraphQL mutation for RSVP submission
MUTATION='
mutation {
  createRsvp(guest: {
    firstName: "Test"
    lastName: "User"
    email: "test-referer-'$(date +%s)'@example.com"
    attending: "attending"
    guestType: "single"
    eventParticipation: "both"
  }) {
    id
    firstName
    lastName
    email
  }
}
'

# Test 1: Valid referer (allowed domain)
echo -e "${YELLOW}Test 1: Valid Referer (allowed domain)${NC}"
echo "Using Referer: http://localhost:3000/rsvp"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Referer: http://localhost:3000/rsvp" \
  --data "{\"query\": \"$MUTATION\"}" \
  $SERVER_URL)

if echo "$RESPONSE" | grep -q "Invalid request origin"; then
  echo -e "${RED}❌ Test failed! Valid referer was rejected.${NC}"
else
  echo -e "${GREEN}✅ Test passed! Valid referer was accepted.${NC}"
fi
echo "$RESPONSE" | grep -v "data" | head -20
echo

# Test 2: Invalid referer (disallowed domain)
echo -e "${YELLOW}Test 2: Invalid Referer (disallowed domain)${NC}"
echo "Using Referer: http://malicious-site.com/fake-form"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Referer: http://malicious-site.com/fake-form" \
  --data "{\"query\": \"$MUTATION\"}" \
  $SERVER_URL)

if echo "$RESPONSE" | grep -q "Invalid request origin"; then
  echo -e "${GREEN}✅ Test passed! Invalid referer was rejected.${NC}"
else
  echo -e "${RED}❌ Test failed! Invalid referer was accepted.${NC}"
fi
echo "$RESPONSE" | grep -v "data" | head -20
echo

# Test 3: No referer header
echo -e "${YELLOW}Test 3: No Referer Header${NC}"
echo "Not sending a Referer header"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  --data "{\"query\": \"$MUTATION\"}" \
  $SERVER_URL)

if echo "$RESPONSE" | grep -q "Invalid request origin"; then
  echo -e "${GREEN}✅ Test passed! Missing referer was rejected.${NC}"
else
  echo -e "${RED}❌ Test failed! Missing referer was accepted.${NC}"
fi
echo "$RESPONSE" | grep -v "data" | head -20
echo

# Test 4: Development mode bypass
echo -e "${YELLOW}Test 4: Development Mode Test (requires server to be in development mode)${NC}"
echo "Using invalid Referer with NODE_ENV=development should pass if dev bypass is working"

# We can't change NODE_ENV in this script, so just show instructions
echo -e "${YELLOW}To test development mode:${NC}"
echo "1. Stop the server"
echo "2. Restart with: NODE_ENV=development npm run dev:backend"
echo "3. Run this test again"
echo

echo -e "${GREEN}All tests completed!${NC}"
