import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import bodyParser from "body-parser";
const { json } = bodyParser;
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { GraphQLError } from "graphql";
import fs from "fs";

// Config
import config from "./config/index.js";
import connectDB from "./config/db.js";
import { runSeeds } from "./seed/index.js";

// Import schemas and resolvers
import { typeDefs } from "./graphql/schema/index.js";
import { resolvers as graphqlResolvers } from "./graphql/resolvers/index.js";

// For directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(json({ limit: "50mb" }));
app.use(cookieParser());

// Image fallback middleware
const imageErrorHandler = (req, res, next) => {
  // Only handle image paths
  if (req.path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    res.on("error", (err) => {
      console.error(`Error serving image ${req.path}:`, err);
      // Send a placeholder image instead

      const placeholderPath = path.join(__dirname, "public", "placeholder.jpg");
      if (fs.existsSync(placeholderPath)) {
        return res.sendFile(placeholderPath);
      } else {
        // Create a simple SVG as fallback if no placeholder exists

        res.setHeader("Content-Type", "image/svg+xml");
        res.send(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#eee"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle">Image Not Found</text>
        </svg>`);
      }
    });
  }
  next();
};

// CORS for static assets
const staticCors = cors({
  origin: "*", // Allow all origins for static assets
  methods: ["GET"],
  maxAge: 86400, // 24 hours
});

// Add image error handling middleware
app.use(imageErrorHandler);

// Set static folders with proper options
const staticOptions = {
  maxAge: "1d", // Cache for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set CORS headers for images and static assets

    res.setHeader("Access-Control-Allow-Origin", "*");

    // Set proper cache headers for different file types
    if (path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      res.setHeader("Cache-Control", "public, max-age=86400"); // 24 hours
    } else if (path.match(/\.(css|js)$/i)) {
      res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
    }
  },
};

// Create placeholder image if it doesn't exist

const placeholderPath = path.join(__dirname, "public", "placeholder.jpg");
if (!fs.existsSync(placeholderPath)) {
  try {
    // Create a very basic placeholder file

    fs.writeFileSync(placeholderPath, "placeholder");
    console.log("Created placeholder image");
  } catch (err) {
    console.error("Failed to create placeholder image:", err);
  }
}

// Configure static file serving for Next.js export

// Scan the public directory to understand what files exist
// This is important for Render deployment to ensure static assets are properly served
const publicDir = path.join(__dirname, "public");
try {
  console.log(`\x1b[32m📂 Scanning static content in ${publicDir}\x1b[0m`);
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);

    console.log(
      `\x1b[32m📄 Found ${files.length} files/directories in public directory:\x1b[0m`
    );
    files.forEach((file) => {
      const stats = fs.statSync(path.join(publicDir, file));
      if (stats.isDirectory()) {
        console.log(`\x1b[36m   - Directory: ${file}/\x1b[0m`);
      } else {
        console.log(`\x1b[36m   - File: ${file} (${stats.size} bytes)\x1b[0m`);
      }
    });
  } else {
    console.log(
      `\x1b[31m⚠️ Public directory ${publicDir} does not exist!\x1b[0m`
    );
    // Create it to avoid errors
    fs.mkdirSync(publicDir, { recursive: true });
  }
} catch (error) {
  console.error(
    `\x1b[31m❌ Error scanning public directory: ${error.message}\x1b[0m`
  );
}

// Serve all Next.js static files from public directory

app.use(
  "/_next",
  staticCors,
  express.static(path.join(__dirname, "public/_next"), staticOptions)
);

// Serve images directory for frontend images with special handling

app.use(
  "/images",
  staticCors,
  express.static(path.join(__dirname, "public/images"), staticOptions)
);
app.use(
  "/media",
  staticCors,
  express.static(path.join(__dirname, "public/media"), staticOptions)
);

// Serve all public assets (including Next.js export files)

app.use(
  express.static(path.join(__dirname, "public"), {
    ...staticOptions,
    index: ["index.html"], // Serve index.html for directory requests
    extensions: ["html", "htm"], // Try these extensions when no extension is provided
  })
);

// Serve uploads directory
// Note: On Render, this directory should be mounted to a persistent disk
// as specified in the render.yaml configuration
app.use(
  "/uploads",
  staticCors,
  express.static(path.join(__dirname, "uploads"), staticOptions)
);

// Add missing images fallback handler

app.get(["/images/*", "/media/*"], (req, res) => {
  console.log(`Image not found: ${req.path}, serving placeholder`);
  // Try to serve the placeholder
  if (fs.existsSync(placeholderPath)) {
    return res.sendFile(placeholderPath);
  } else {
    // Create a simple SVG as fallback

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#eee"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle">Image Not Found</text>
    </svg>`);
  }
});

// Environment detection function

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

// Debug environment

console.log(`Running in ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} mode`);
console.log(`Server port: ${config.port}`);

console.log(
  `CORS origins: ${
    Array.isArray(config.cors.origin)
      ? config.cors.origin.join(", ")
      : config.cors.origin
  }`
);

// Create a Next.js request handler for the frontend
let nextHandler = null;
let nextApp = null;

// Next.js setup - different handling for production vs development
async function setupNextJs() {
  try {
    if (isProduction) {
      console.log("Setting up Next.js in PRODUCTION mode");

      // Instead of trying to dynamically import the Next.js handler,
      // we'll use a simpler approach to serve the static output

      // Check for static files in backend/public/static

      const staticFilesPath = path.join(__dirname, "public", "static");
      if (fs.existsSync(staticFilesPath)) {
        console.log(`Found Next.js static files at: ${staticFilesPath}`);
        // We'll serve these files directly with Express static middleware
        // This is already set up in the static file serving section
      } else {
        console.warn(`Static files directory not found at: ${staticFilesPath}`);

        console.log("Looking for alternative static files locations...");

        // Try alternative locations
        const alternativeStaticPaths = [
          path.join(__dirname, "..", "frontend", ".next", "static"),
          path.join(__dirname, "standalone", "static"),
          path.join(__dirname, "..", "frontend", "out", "_next", "static"),
        ];

        let foundStatic = false;
        for (const altPath of alternativeStaticPaths) {
          if (fs.existsSync(altPath)) {
            console.log(
              `Found Next.js static files at alternative location: ${altPath}`
            );
            // We'll add an additional static middleware for this location

            app.use(
              "/_next/static",
              staticCors,
              express.static(altPath, staticOptions)
            );
            foundStatic = true;
            break;
          }
        }

        if (!foundStatic) {
          console.error(
            "Could not find Next.js static files in any expected location"
          );
          console.log("Will use fallback static HTML");
        }
      }

      // Setup to use static HTML files

      console.log("Using static HTML files for Next.js frontend");
    } else {
      console.log(
        "Running in DEVELOPMENT mode - will proxy frontend requests to Next.js dev server"
      );
    }
  } catch (error) {
    console.error("Error setting up Next.js:", error);
  }
}

// Call the Next.js setup function
await setupNextJs();

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Custom scalar type for file uploads
const uploadScalar = {
  Upload: {
    __serialize(value) {
      return value;
    },
    __parseValue(value) {
      return value;
    },
    __parseLiteral(ast) {
      throw new GraphQLError("Upload scalar cannot be used in literal");
    },
  },
};

// Function to start Apollo Server
const startApolloServer = async () => {
  try {
    await connectDB();
    await maybeRunSeeds();
    const { server, httpServer } = await setupApolloServer();
    setupMiddleware(app, server);
    setupStaticFileHandling(app);
    
    const port = determineServerPort();
    
    console.log(`ℹ️  Attempting to start server on port ${port}`);
    
    // Try to start on the primary port
    try {
      await new Promise((resolve, reject) => {
        httpServer.listen(port, () => {
          resolve();
        }).on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️  Port ${port} is already in use.`);
            reject(err);
          } else {
            reject(err);
          }
        });
      });
      
      // Successfully started on primary port
      logServerStartup(port);
      savePortInfo(port);
      
    } catch (portError) {
      if (portError.code === 'EADDRINUSE') {
        // Try fallback port (port + 1)
        const fallbackPort = port + 1;
        console.warn(`⚠️  Trying alternative port: ${fallbackPort}...`);
        
        try {
          await new Promise((resolve, reject) => {
            httpServer.listen(fallbackPort, () => {
              resolve();
            }).on('error', reject);
          });
          
          // Successfully started on fallback port
          console.warn(`⚠️  Original port ${port} was in use. Using port ${fallbackPort} instead.`);
          logServerStartup(fallbackPort);
          savePortInfo(fallbackPort);
          
        } catch (fallbackError) {
          console.error(`❌ Failed to start server on fallback port ${fallbackPort}:`, fallbackError.message);
          handleStartupError(fallbackError);
        }
      } else {
        console.error(`❌ Failed to start server on port ${port}:`, portError.message);
        handleStartupError(portError);
      }
    }
  } catch (error) {
    handleStartupError(error);
  }
};

async function maybeRunSeeds() {
  if (process.env.NODE_ENV === "development") {
    console.log("🌱 Running seed data...");
    await runSeeds();
  }
}

function logServerStart(serverPort) {
  console.log(
    `\x1b[32mℹ️  Attempting to start server on port ${serverPort}\x1b[0m`
  );
}

function handleStartupError(error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}

async function setupApolloServer() {
  const { server, httpServer } = await createApolloServer();
  await server.start();
  return { server, httpServer };
}

async function createApolloServer() {
  const combinedTypeDefs = `
    scalar Upload
    ${typeDefs}
  `;

  const combinedResolvers = {
    ...uploadScalar,
    ...graphqlResolvers,
  };

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: combinedTypeDefs,
    resolvers: combinedResolvers,
    introspection: true,
    context: ({ req, res }) => ({ req, res }),
    ...getApolloServerConfig(),
  });

  return { server, httpServer };
}

function getApolloServerConfig() {
  return {
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
    formatResponse: (response) => {
      console.log("GraphQL Response:", response);
      return response;
    },
    plugins: [getErrorLoggingPlugin()],
  };
}

function getErrorLoggingPlugin() {
  return {
    requestDidStart() {
      return {
        didEncounterErrors(ctx) {
          ctx.errors.forEach((error) => {
            console.error("GraphQL Error:", error);
          });
        },
      };
    },
  };
}

function setupMiddleware(app, server) {
  app.use(
    "/graphql",
    cors({
      origin: config.cors.origin,
      credentials: true,
    }),
    json(),
    validateRefererMiddleware,
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        refererInfo: req.refererInfo,
      }),
    })
  );
}

function setupStaticFileHandling(app) {
  app.use("*", handleStaticFiles);
}

function determineServerPort() {
  let serverPort;
  if (isProduction) {
    serverPort = process.env.PORT || 10000;
  } else {
    serverPort = config.port || 4000;
  }
  return Number(serverPort);
}

function validateRefererMiddleware(req, res, next) {
  const referer = req.headers.referer || req.headers.referrer;

  if (isDevelopmentEnv()) {
    handleDevelopmentReferer(req, referer);
    return next();
  }

  if (isRsvpMutationRequest(req)) {
    handleRsvpReferer(req, referer);
  } else {
    handleNonRsvpReferer(req, referer);
  }
  next();
}

function isDevelopmentEnv() {
  return process.env.NODE_ENV === "development";
}

function handleDevelopmentReferer(req, referer) {
  req.refererInfo = createRefererInfo(referer, true, "development_bypass");
}

function handleRsvpReferer(req, referer) {
  return processRsvpReferer(req, referer);
}
function handleNonRsvpReferer(req, referer) {
  req.refererInfo = createRefererInfo(referer, true, "non_rsvp_operation");
}

function processRsvpReferer(req, referer) {
  const domains = getAllowedDomains();
  const isValid = validateReferer(referer, domains);
  req.refererInfo = createRefererInfo(
    referer,
    isValid,
    isValid ? "valid_domain" : "invalid_domain"
  );
  logInvalidReferer(isValid, referer);
}

function logInvalidReferer(isValid, referer) {
  if (!isValid) {
    console.warn(`Invalid referer for RSVP mutation: ${referer || "none"}`);
  }
}

function handleStaticFiles(req, res, next) {
  const reqPath = req.originalUrl;

  if (isApiRequest(reqPath)) {
    return next();
  }

  if (isStaticAsset(reqPath)) {
    console.log(`Static asset request: ${reqPath}`);
    return next();
  }

  return handleNonStaticRequest(reqPath, res);
}

function isApiRequest(path) {
  return path.startsWith("/graphql") || path.startsWith("/api");
}

function handleNonStaticRequest(reqPath, res) {
  if (isProduction) {
    return handleProductionStaticFiles(reqPath, res);
  } else if (isDevelopment) {
    return serveDevelopmentMessage(res);
  }

  console.log(`\x1b[33m⚠️ Using fallback page for: ${reqPath}\x1b[0m`);
  return res.sendFile(path.join(__dirname, "public", "index.html"));
}

// Helper functions for validateRefererMiddleware
function isRsvpMutationRequest(req) {
  return req.body && 
    req.body.query && 
    (req.body.query.includes('createRsvp') || req.body.query.includes('updateRsvp'));
}

function getAllowedDomains() {
  return Array.isArray(config.cors.origin) 
    ? config.cors.origin 
    : [config.cors.origin];
}

function validateReferer(referer, allowedDomains) {
  if (!referer) return false;
  
  return allowedDomains.some(domain => {
    if (domain === '*') return true;
    
    const domainPattern = domain.replace(/\*/g, '.*');
    return new RegExp(`^${domainPattern}`).test(referer);
  });
}

function createRefererInfo(referer, isValid, source) {
  return {
    referer,
    validated: isValid,
    source
  };
}

function logServerStartup(port) {
  const environment = isDevelopment ? 'development' : isProduction ? 'production' : 'unknown';
  console.log(`🚀 Server running in ${environment} mode`);
  console.log(`🚀 GraphQL endpoint: http://localhost:${port}/graphql`);
  console.log(`🚀 Frontend app: http://localhost:${port}`);
}

function savePortInfo(port) {
  try {
    fs.writeFileSync(path.join(__dirname, 'current-port.txt'), String(port));
    console.log(`ℹ️  Port information saved to backend/current-port.txt`);
  } catch (error) {
    console.error(`⚠️  Could not save port information to file: ${error.message}`);
  }
}

function isStaticAsset(path) {
  return path.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/i);
}

function handleProductionStaticFiles(reqPath, res) {
  // Logic for handling static files in production
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).send("File not found");
}

function serveDevelopmentMessage(res) {
  return res.send(
    "Server running in development mode. Frontend should be served by Next.js dev server."
  );
}

// Start the server
startApolloServer();
