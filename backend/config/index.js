import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Environment
const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

// Configuration structure

// Parse CORS_ORIGIN string to array
const isProdEnv = NODE_ENV === "production";
let corsOrigin = process.env.CORS_ORIGIN;

// In development, ensure both 3000 and 3001 ports are included for local development
if (!isProdEnv) {
  if (!corsOrigin) {
    corsOrigin=process.env.CORS_ORIGIN
    // corsOrigin = "http://localhost:3000,http://localhost:3001";
  } else if (!corsOrigin.includes(process.env.CORS_ORIGIN)) {
    corsOrigin += ",http://localhost:3001";
  }
} else if (!corsOrigin) {
  // In production, default to a safer setting
  corsOrigin = "https://noceflorale-frontend.vercel.app";
}

const corsOriginArray = corsOrigin.split(",").map((origin) => origin.trim());

// Export configuration
const config = {
  env: NODE_ENV,
  isProd,
  port: parseInt(process.env.PORT || process.env.BACKEND_PORT || "4000", 10),
  mongo: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/wedding-app",
  },
  cors: {
    origin: corsOriginArray,
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  cookie: {
    httpOnly: true,
    secure: isProd, // Only use secure cookies in production
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default-jwt-secret-not-secure",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret-not-secure",
    expiresIn: "1d",
    refreshExpiresIn: "7d",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
};

// Validate required configuration
if (!config.mongo.uri) {
  console.error("FATAL ERROR: MongoDB URI is not defined");
  process.exit(1);
}

if (!config.jwt.secret || !config.jwt.refreshSecret) {
  console.error("FATAL ERROR: JWT secrets are not defined");
  process.exit(1);
}

if (
  isProd &&
  (!config.cloudinary.cloudName ||
    !config.cloudinary.apiKey ||
    !config.cloudinary.apiSecret)
) {
  console.warn("WARNING: Cloudinary configuration is incomplete");
}
// Log CORS configuration
console.log(`CORS configured for origins: ${config.cors.origin.join(", ")}`);
console.log(
  `Cookie secure setting: ${config.cookie.secure ? "enabled" : "disabled"} (${
    config.env
  } environment)`
);

export default config;
