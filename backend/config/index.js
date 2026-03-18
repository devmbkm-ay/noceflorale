import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const isProd = process.env.NODE_ENV === "production";

// --- Validate Essential Environment Variables ---
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CORS_ORIGIN'
];

if (isProd) {
  requiredEnvVars.push(
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  );
}

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// --- Export Configuration Object ---
const config = {
  env: process.env.NODE_ENV || "development",
  isProd,
  port: parseInt(process.env.PORT || "4000", 10),
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  cors: {
    // Directly use the environment variable. The 'cors' package handles a single string origin perfectly.
    origin: process.env.CORS_ORIGIN,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
