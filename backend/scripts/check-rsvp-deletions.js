import { MongoClient } from 'mongodb';
import fs from 'fs';

// MongoDB connection string from .env file
const uri = "mongodb+srv://aymardmb:Openmongo-75@cluster0.bnpgltz.mongodb.net/morceaux-cs?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('morceaux-cs');
    const rsvpCollection = database.collection('rsvps');
    
    // Get current date
    const now = new Date();
    // Get date from 7 days ago
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    console.log(`Checking for recent activities since ${sevenDaysAgo.toISOString()}`);
    
    // Check if the collection has any recent changes
    const recentRsvps = await rsvpCollection.find({
      $or: [
        { createdAt: { $gte: sevenDaysAgo } },
        { updatedAt: { $gte: sevenDaysAgo } }
      ]
    }).toArray();
    
    console.log(`Found ${recentRsvps.length} RSVPs modified in the last 7 days`);
    
    // Save the recent RSVPs to a file for reference
    if (recentRsvps.length > 0) {
      fs.writeFileSync('./recent-rsvps.json', JSON.stringify(recentRsvps, null, 2));
      console.log('Saved recent RSVPs to recent-rsvps.json');
    }
    
    // Check for system.profile collection which might have logged delete operations
    const systemDb = client.db('admin');
    const collections = await systemDb.listCollections().toArray();
    const hasProfileCollection = collections.some(col => col.name === 'system.profile');
    
    if (hasProfileCollection) {
      console.log('Found system.profile collection, checking for delete operations...');
      const deleteOps = await systemDb.collection('system.profile').find({
        op: 'remove',
        ns: /morceaux-cs.rsvps/
      }).toArray();
      
      console.log(`Found ${deleteOps.length} delete operations in profiling data`);
      
      if (deleteOps.length > 0) {
        fs.writeFileSync('./delete-operations.json', JSON.stringify(deleteOps, null, 2));
        console.log('Saved delete operations to delete-operations.json');
      }
    } else {
      console.log('No system.profile collection found (profiling may not be enabled)');
    }
    
    // Get total count of RSVPs
    const totalRsvps = await rsvpCollection.countDocuments();
    console.log(`Total RSVPs in database: ${totalRsvps}`);
    
    // Get the most recent RSVPs to check
    const mostRecentRsvps = await rsvpCollection.find().sort({ createdAt: -1 }).limit(10).toArray();
    console.log('\nMost recent 10 RSVPs:');
    mostRecentRsvps.forEach((rsvp, index) => {
      console.log(`${index + 1}. ${rsvp.firstName} ${rsvp.lastName} (${rsvp.email}) - Created: ${rsvp.createdAt}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main().catch(console.error);
