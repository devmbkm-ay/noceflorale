import { MongoClient } from 'mongodb';
import fs from 'fs';

// MongoDB connection string from .env file
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('morceaux-cs');

    // Check if we can access the oplog
    try {
      const oplogDb = client.db('local');
      const hasOplog = await oplogDb
        .listCollections({ name: 'oplog.rs' })
        .hasNext();

      if (hasOplog) {
        console.log(
          'Found oplog collection, checking for delete operations...',
        );
        const oplog = oplogDb.collection('oplog.rs');

        // Look for delete operations in the oplog within the last 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const deleteOps = await oplog
          .find({
            op: 'd',
            ns: 'morceaux-cs.rsvps',
            ts: { $gte: sevenDaysAgo },
          })
          .toArray();

        console.log(`Found ${deleteOps.length} delete operations in oplog`);

        if (deleteOps.length > 0) {
          fs.writeFileSync(
            './delete-oplog.json',
            JSON.stringify(deleteOps, null, 2),
          );
          console.log('Saved delete operations to delete-oplog.json');

          // Print details of the deleted documents
          console.log('\nDeleted RSVP details:');
          deleteOps.forEach((op, index) => {
            console.log(`${index + 1}. Document ID: ${op.o._id}`);
            if (op.o) {
              console.log(`   Details: ${JSON.stringify(op.o)}`);
            }
          });
        }
      } else {
        console.log(
          'No oplog collection found (not available in MongoDB Atlas free tier)',
        );
      }
    } catch (error) {
      console.log('Error accessing oplog:', error.message);
      console.log('Oplog might not be available in your MongoDB plan');
    }

    // Additional approach: Search for deleted records through database metadata
    try {
      console.log('\nChecking for database metadata about deleted records...');
      const adminDb = client.db('admin');

      // Check server status for any recent delete operations
      const serverStatus = await adminDb.command({ serverStatus: 1 });

      console.log('Server metrics:');
      if (serverStatus.metrics && serverStatus.metrics.document) {
        console.log(
          `Documents deleted: ${serverStatus.metrics.document.deleted || 0}`,
        );
      }

      // Get collection stats
      const rsvpCollection = database.collection('rsvps');
      const stats = await rsvpCollection.stats();
      console.log(`\nRSVP collection stats:`);
      console.log(`Total documents: ${stats.count}`);
      console.log(`Size: ${stats.size} bytes`);
      console.log(`Storage size: ${stats.storageSize} bytes`);
    } catch (error) {
      console.log('Error checking metadata:', error.message);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main().catch(console.error);
