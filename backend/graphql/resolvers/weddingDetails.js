import { GraphQLError } from "graphql";
import WeddingDetails from "../../models/weddingDetails.js";

export const weddingDetailsResolvers = {
  Query: {
    // Get wedding details - returns the single record or creates default if none exists
    getWeddingDetails: async () => {
      try {
        // Find the wedding details - there should only be one record
        let details = await WeddingDetails.findOne();
        
        // If no details exist yet, create a default record
        if (!details) {
          details = new WeddingDetails();
          await details.save();
        }
        
        return details;
      } catch (error) {
        console.error("Error getting wedding details:", error);
        throw new GraphQLError("Failed to get wedding details", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },

  Mutation: {
    // Update wedding details
    updateWeddingDetails: async (_, { input }) => {
      try {
        // Find existing details or create if doesn't exist
        let details = await WeddingDetails.findOne();
        
        if (!details) {
          details = new WeddingDetails(input);
        } else {
          // Update only the fields that are provided in input
          Object.keys(input).forEach(key => {
            if (input[key] !== undefined) {
              details[key] = input[key];
            }
          });
          
          details.updatedAt = new Date();
        }
        
        await details.save();
        return details;
      } catch (error) {
        console.error("Error updating wedding details:", error);
        throw new GraphQLError("Failed to update wedding details", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};

