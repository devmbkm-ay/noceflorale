// Script to migrate partnerName to partnerFirstName and partnerLastName
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - first try project root, then backend directory
let envLoaded = false;
try {
  // Try loading from project root
  const result = dotenv.config({
    path: path.join(__dirname, '..', '..', '.env'),
  });
  if (result.parsed) {
    envLoaded = true;
    console.log('Loaded .env from project root');
  }
} catch (e) {
  console.log('Could not load .env from project root:', e.message);
}

if (!envLoaded) {
  try {
    // Try loading from backend directory
    const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
    if (result.parsed) {
      envLoaded = true;
      console.log('Loaded .env from backend directory');
    }
  } catch (e) {
    console.log('Could not load .env from backend directory:', e.message);
  }
}

// Hardcoded MongoDB URI as fallback (update this with your actual MongoDB URI)
const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://aymardmb:Openmongo-75@cluster0.bnpgltz.mongodb.net/nocefloraledb?retryWrites=true&w=majority';

if (!process.env.MONGO_URI) {
  console.log('Warning: Using hardcoded MongoDB URI as fallback');
}

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Define RSVP model schema to match the one in the application
const rsvpSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  attending: {
    type: String,
    enum: ['attending', 'not_attending'],
    required: true,
  },
  guestType: {
    type: String,
    enum: ['single', 'couple'],
  },
  eventParticipation: {
    type: String,
    enum: ['none', 'both', 'blessing_only', 'evening_only'],
  },
  partnerFirstName: String,
  partnerLastName: String,
  partnerName: String, // Kept for backward compatibility
  partnerEmail: String,
  partnerEventParticipation: String,
  hasChildren: { type: Boolean, default: false },
  childrenCount: Number,
  children: [
    {
      id: String,
      name: String,
      age: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const RSVP = mongoose.model('RSVP', rsvpSchema);

// Function to migrate partner names
const migratePartnerNames = async () => {
  const connection = await connectDB();

  try {
    // Find all RSVPs that have partnerName or partnerEmail but might be missing partnerFirstName/partnerLastName
    const rsvps = await RSVP.find({
      $or: [
        { partnerName: { $exists: true, $ne: null, $ne: '' } },
        { partnerEmail: { $exists: true, $ne: null, $ne: '' } },
      ],
      guestType: 'couple',
    });

    console.log(`Found ${rsvps.length} RSVPs to process`);

    let updatedCount = 0;

    for (const rsvp of rsvps) {
      let updated = false;
      const updates = {};

      // Process partnerName if it exists and partnerFirstName/partnerLastName don't
      if (rsvp.partnerName && !rsvp.partnerFirstName && !rsvp.partnerLastName) {
        const nameParts = rsvp.partnerName.trim().split(' ');
        if (nameParts.length > 0) {
          updates.partnerFirstName = nameParts[0];
          updates.partnerLastName = nameParts.slice(1).join(' ');
          updated = true;
        }
      }

      // If partner email exists but no partner name information at all, use the email prefix as first name
      if (
        rsvp.partnerEmail &&
        !rsvp.partnerFirstName &&
        !rsvp.partnerLastName &&
        !rsvp.partnerName
      ) {
        updates.partnerFirstName = rsvp.partnerEmail.split('@')[0] || 'Partner';
        updates.partnerLastName = '';
        updated = true;
      }

      // If we have updates to apply
      if (updated) {
        await RSVP.findByIdAndUpdate(rsvp._id, { $set: updates });
        updatedCount++;
        console.log(
          `Updated RSVP for ${rsvp.firstName} ${rsvp.lastName} (ID: ${rsvp._id})`,
        );
        console.log(
          `  Partner name set to: ${updates.partnerFirstName} ${updates.partnerLastName}`,
        );
      }
    }

    console.log(
      `Migration completed. Updated ${updatedCount} out of ${rsvps.length} RSVPs.`,
    );
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the database connection
    await connection.disconnect();
    console.log('Database connection closed.');
  }
};

// Run the migration
migratePartnerNames();
