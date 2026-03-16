import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// Mock imports and implementation removed

// Check if we should use mocks (in development or when backend is unavailable)
// Always use real API, no mocks
const useMocks = false;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined. Please check your .env file.");
}

// Create an HTTP link to the GraphQL endpoint with improved debugging
const httpLink = createHttpLink({
  uri: API_URL,
  fetchOptions: {
    mode: "cors", // Ensure CORS is set
    credentials: "include", // Include credentials if needed
  },
  headers: {
    "Content-Type": "application/json", // Set default Content-Type for all requests
  },
});

// Log the GraphQL endpoint being used
if (typeof window !== "undefined") {
  console.log(
    `📡 Apollo Client connecting to: ${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/graphql"
    }`
  );
}

// Add authentication and CSRF protection headers to the GraphQL requests
const authLink = setContext((operation, { headers }) => {
  // Get the token from localStorage if available
  let token = null;
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("wedding_user");
    if (user) {
      const userData = JSON.parse(user);
      token = userData.token; // Adjust based on your actual token structure
    }
  }

  // Return the headers with auth token if we have one, plus CSRF protection headers
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json", // Explicitly set Content-Type for CSRF protection
      "apollo-require-preflight": "true", // CSRF protection header
      "x-apollo-operation-name": operation.operationName || "UnknownOperation", // Additional CSRF protection
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client with improved error handling and logging
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only", // Don't cache queries for now
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all", // Return data and errors from mutations
    },
  },
  devtools: { enabled: process.env.NODE_ENV !== "production" },
});

// Add a network monitor to debug API calls
if (typeof window !== "undefined") {
  // Create a network monitor
  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : input.url;
    const isGraphQL = url.includes("/graphql");

    if (isGraphQL) {
      console.log(`🚀 GraphQL Request to: ${url}`);
      if (init?.body) {
        try {
          const body = JSON.parse(init.body.toString());
          console.log("Request Payload:", body);
        } catch (e) {
          console.log(
            "Could not parse request body:",
            e instanceof Error ? e.message : "Unknown error"
          );
        }
      }

      // Track timing
      const startTime = Date.now();

      return origFetch(input, init)
        .then((response) => {
          const duration = Date.now() - startTime;
          console.log(
            `📥 GraphQL Response received in ${duration}ms with status: ${response.status}`
          );

          // Clone the response to read it twice
          const resClone = response.clone();

          // Process the cloned response to log its content
          resClone
            .json()
            .then((data) => {
              console.log("Response data:", data);
            })
            .catch((e) => {
              // Safe error logging for JSON parsing issues
              try {
                if (e instanceof Error) {
                  console.error("Error parsing response:", e.message);
                } else {
                  console.error("Error parsing response: Unknown error");
                }
              } catch {
                console.error("Failed to log JSON parsing error");
              }
            });

          return response;
        })
        .catch((error) => {
          console.error(`❌ GraphQL Network Error: Failed to fetch`);
          console.error('Request URL:', url);
          
          // Safe error logging to avoid Next.js console.error issues
          try {
            if (error instanceof Error) {
              console.error('Error message:', error.message);
              console.error('Error name:', error.name);
              if (error.cause) {
                console.error('Error cause:', error.cause);
              }
            } else {
              console.error('Non-Error object thrown:', String(error));
            }
          } catch {
            console.error('Failed to log error details');
          }
          
          throw error;
        });
    }

    // Not a GraphQL request, proceed normally
    return origFetch(input, init);
  };
}

// Log whether we're using mocks or real API
if (typeof window !== "undefined") {
  console.log(`Apollo Client using ${useMocks ? "mock data" : "real API"}`);
}

export default client;
