// Main seed file to import and run all seed functions
import { seedScheduleItems } from './scheduleItems.js';
import { seedWeddingDetails } from './weddingDetails.js';
import mongoose from 'mongoose';

// Function to run all seed operations
export const runSeeds = async () => {
  console.log('🌱 Starting database seed process...');
  
  // Run seed functions
  await seedScheduleItems();
  await seedWeddingDetails();
  
  // Fix missing telephone numbers in existing RSVPs
  try {
    const result = await mongoose.connection.db.collection('rsvps').updateMany(
      { telephone: { $in: [null, undefined, ''] } },
      { $set: { telephone: 'N/A' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`📞 Fixed ${result.modifiedCount} RSVPs with missing telephone numbers`);
    }
  } catch (error) {
    console.error('❌ Error fixing telephone numbers:', error);
  }
  
  console.log('✅ Seed process completed!');
};

// Allow direct execution of seed script
if (process.argv[1].endsWith('seed/index.js')) {
  runSeeds()
    .then(() => {
      console.log('Seed script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error running seed script:', error);
      process.exit(1);
    });
}

