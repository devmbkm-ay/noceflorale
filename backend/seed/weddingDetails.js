import WeddingDetails from "../models/weddingDetails.js";

// Default wedding details
const defaultWeddingDetails = {
  ceremonyDate: "29 août, 2025",
  ceremonyTime: "14h30",
  ceremonyAddress: "2 Rue des Argiles Vertes, 77130 Saint Germain Laval",
  receptionTime: "19h00",
  receptionLocation: "Salle de réception La Florale",
  receptionAddress: "2 Rue des Argiles Vertes, 77130 Saint Germain Laval",
  additionalInfo:
    "C'est avec joie que nous partagerons cette journée avec vous !",
};

// Function to seed the database with wedding details
export const seedWeddingDetails = async () => {
  try {
    // Check if wedding details already exist
    const count = await WeddingDetails.countDocuments();

    if (count === 0) {
      console.log("💒 No wedding details found, seeding database...");

      // Create wedding details
      const details = new WeddingDetails(defaultWeddingDetails);
      await details.save();

      console.log(`✅ Successfully added wedding details!`);
    } else {
      console.log(`💒 Wedding details already exist, skipping seed.`);
    }
  } catch (error) {
    console.error("❌ Error seeding wedding details:", error);
  }
};
