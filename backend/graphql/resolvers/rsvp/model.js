import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, sparse: true },
    telephone: { type: String, required: false },
    attending: {
      type: String,
      enum: ["attending", "not_attending"],
      required: true,
    },
    guestType: {
      type: String,
      enum: ["single", "couple"],
      // Only required if attending
      validate: {
        validator: function (v) {
          // If not attending, this field is optional
          if (this.attending === "not_attending") {
            return true;
          }
          // If attending, this field is required
          return v != null && v.length > 0;
        },
        message: "Guest type is required for attending guests",
      },
      // Add default for non-attending guests
      default: function () {
        return this.attending === "not_attending" ? "single" : undefined;
      },
    },
    eventParticipation: {
      type: String,
      enum: ["none", "both", "blessing_only", "evening_only"],
      // Only required if attending
      validate: {
        validator: function (v) {
          // If not attending, this field should be 'none'
          if (this.attending === "not_attending") {
            return v === "none";
          }
          // If attending, this field is required and should not be 'none'
          return v != null && v !== "none" && v.length > 0;
        },
        message: (props) =>
          props.value === "none"
            ? "Attending guests must select an event participation option"
            : "Event participation is required for attending guests",
      },
    },
    partnerFirstName: String,
    partnerLastName: String,
    partnerName: String, // Kept for backward compatibility
    partnerEmail: String,
    partnerTelephone: String,
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
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  });

// Create compound index for email and deleted fields to ensure uniqueness for non-deleted records
rsvpSchema.index({ email: 1, deleted: 1 }, { unique: true, sparse: true });

// Add pre-save middleware to handle soft-deleted records
rsvpSchema.pre('save', function(next) {
  // If this is a soft-deleted record, append timestamp to email to avoid unique constraint issues
  if (this.deleted && this.deletedAt) {
    this.email = `${this.email}_deleted_${this.deletedAt.getTime()}`;
  }
  next();
});

export const RSVP = mongoose.model("RSVP", rsvpSchema);
