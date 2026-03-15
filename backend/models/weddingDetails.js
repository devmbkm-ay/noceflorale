import mongoose from "mongoose";

// Define the schema for wedding details
const weddingDetailsSchema = new mongoose.Schema(
  {
    ceremonyDate: {
      type: String,
      required: true,
      default: "29 août, 2025",
    },
    ceremonyTime: {
      type: String,
      required: true,
      default: "14h30",
    },
    ceremonyLocation: {
      type: String,
      required: true,
      default: "Église Saint Marie",
    },
    ceremonyAddress: {
      type: String,
      required: true,
      default: "2 Rue des Argiles Vertes, 77130 Saint Germain Laval",
    },
    receptionTime: {
      type: String,
      required: true,
      default: "19h00",
    },
    receptionLocation: {
      type: String,
      required: true,
      default: "Salle de réception La Florale",
    },
    receptionAddress: {
      type: String,
      required: true,
      default: "2 Rue des Argiles Vertes, 77130 Saint Germain Laval",
    },
    additionalInfo: {
      type: String,
      default: "C'est avec joie que nous partagerons cette journée avec vous !",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const WeddingDetails = mongoose.model("WeddingDetails", weddingDetailsSchema);

export default WeddingDetails;
