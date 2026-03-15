import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // No need to specify useNewUrlParser, useUnifiedTopology, etc. as they are now default in mongoose 7+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection event listeners for better monitoring
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
    });
    
    // Handle process termination gracefully
    process.on('SIGINT', async () => {
      console.log('🛑 Received SIGINT. Closing MongoDB connection...');
      await mongoose.connection.close();
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error connecting to MongoDB: ${error.message}`);
      console.error(`❌ Stack trace: ${error.stack}`);
    } else {
      console.error("❌ Unknown error connecting to MongoDB");
    }
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
