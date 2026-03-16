import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// MongoDB connection string from .env file
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('morceaux-cs');
    const rsvpCollection = database.collection('rsvps');

    // Get all RSVPs
    const allRsvps = await rsvpCollection.find().toArray();
    console.log(`Found ${allRsvps.length} total RSVPs in the database`);

    // Create a backup folder if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save all RSVPs to a file
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(backupDir, `all-rsvps-${timestamp}.json`);
    fs.writeFileSync(filePath, JSON.stringify(allRsvps, null, 2));
    console.log(`Saved all RSVPs to ${filePath}`);

    // Print some summary information
    console.log('\nRSVP Summary:');

    // Count by attendance
    const attending = allRsvps.filter(
      (rsvp) => rsvp.attending === 'attending',
    ).length;
    const notAttending = allRsvps.filter(
      (rsvp) => rsvp.attending === 'not_attending',
    ).length;

    // Count by guest type
    const singles = allRsvps.filter(
      (rsvp) => rsvp.guestType === 'single',
    ).length;
    const couples = allRsvps.filter(
      (rsvp) => rsvp.guestType === 'couple',
    ).length;

    // Count by event participation
    const both = allRsvps.filter(
      (rsvp) => rsvp.eventParticipation === 'both',
    ).length;
    const blessingOnly = allRsvps.filter(
      (rsvp) => rsvp.eventParticipation === 'blessing_only',
    ).length;
    const eveningOnly = allRsvps.filter(
      (rsvp) => rsvp.eventParticipation === 'evening_only',
    ).length;

    console.log(`Total RSVPs: ${allRsvps.length}`);
    console.log(`Attending: ${attending}, Not Attending: ${notAttending}`);
    console.log(`Singles: ${singles}, Couples: ${couples}`);
    console.log(
      `Participation - Both: ${both}, Blessing Only: ${blessingOnly}, Evening Only: ${eveningOnly}`,
    );

    // Total guest count (counting partners for couples)
    let totalGuests = 0;
    allRsvps.forEach((rsvp) => {
      if (rsvp.attending === 'attending') {
        totalGuests++; // Primary guest

        // Add partner if couple
        if (rsvp.guestType === 'couple') {
          totalGuests++;
        }

        // Add children if any
        if (rsvp.hasChildren && rsvp.children && rsvp.children.length > 0) {
          totalGuests += rsvp.children.length;
        }
      }
    });

    console.log(
      `Total Guest Count (including partners and children): ${totalGuests}`,
    );

    // Create a CSV export for easier viewing in spreadsheets
    const csvRows = [];
    csvRows.push(
      'First Name,Last Name,Email,Telephone,Attending,Guest Type,Event Participation,Partner First Name,Partner Last Name,Partner Email,Partner Telephone,Partner Event Participation,Created At',
    );

    allRsvps.forEach((rsvp) => {
      const row = [
        rsvp.firstName || '',
        rsvp.lastName || '',
        rsvp.email || '',
        rsvp.telephone || '',
        rsvp.attending || '',
        rsvp.guestType || '',
        rsvp.eventParticipation || '',
        rsvp.partnerFirstName || '',
        rsvp.partnerLastName || '',
        rsvp.partnerEmail || '',
        rsvp.partnerTelephone || '',
        rsvp.partnerEventParticipation || '',
        rsvp.createdAt || '',
      ].map((field) => `"${String(field).replace(/"/g, '""')}"`);

      csvRows.push(row.join(','));
    });

    const csvFilePath = path.join(backupDir, `all-rsvps-${timestamp}.csv`);
    fs.writeFileSync(csvFilePath, csvRows.join('\n'));
    console.log(`Saved CSV export to ${csvFilePath}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

main().catch(console.error);
