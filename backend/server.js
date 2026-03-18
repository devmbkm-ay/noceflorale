import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// --- Basic Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

// --- Project Imports ---
import config from './config/index.js';
import connectDB from './config/db.js';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolvers/index.js';

// --- Initialization ---
const app = express();
const httpServer = http.createServer(app);

// --- CORS Configuration ---
// This is the crucial part. We allow requests only from your Vercel frontend URL.
// The cors middleware will automatically handle the OPTIONS preflight requests.
const corsOptions = {
  origin: config.cors.origin, // Should be https://noceflorale-frontend.vercel.app from your env
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable pre-flight across-the-board


// --- Standard Middleware ---
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

// --- Cloudinary Configuration ---
if (config.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
} else {
  console.warn('WARNING: Cloudinary configuration is incomplete. Uploads may fail.');
}


// --- Apollo Server Setup ---
const startServer = async () => {
  // Connect to the database
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production', // Enable introspection only in dev
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();

  // --- GraphQL Endpoint ---
  // Apply the Apollo Server middleware to the /graphql endpoint.
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  // --- Health Check Endpoint ---
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // --- Start Server ---
  const port = process.env.PORT || 4000;
  await new Promise((resolve) => httpServer.listen({ port:'0.0.0.0' }, resolve));

  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  // console.log(`🚀 GraphQL endpoint ready at http://localhost:${port}/graphql`);
  // console.log(`🔗 Accepting requests from: ${config.cors.origin}`);
  console.log(`🚀 GraphQL endpoint ready at http://0.0.0.0:${port}/graphql`);
};

startServer().catch(error => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
});
