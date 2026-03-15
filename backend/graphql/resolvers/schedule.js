import { GraphQLError } from "graphql";
import ScheduleItem from "../../models/scheduleItem.js";

export const scheduleResolvers = {
  Query: {
    // Get a single schedule item by ID
    getScheduleItem: async (_, { id }) => {
      try {
        const scheduleItem = await ScheduleItem.findById(id);
        if (!scheduleItem) {
          throw new GraphQLError("Schedule item not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return scheduleItem;
      } catch (error) {
        console.error("Error getting schedule item:", error);
        throw new GraphQLError("Failed to get schedule item", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Get all schedule items
    scheduleItems: async () => {
      try {
        const items = await ScheduleItem.find().sort({ order: 1, startTime: 1 });
        return items;
      } catch (error) {
        console.error("Error getting schedule items:", error);
        throw new GraphQLError("Failed to get schedule items", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },

  Mutation: {
    // Create a new schedule item
    createScheduleItem: async (_, { item }) => {
      try {
        const newItem = new ScheduleItem({
          ...item,
          createdAt: new Date(),
        });
        await newItem.save();
        return newItem;
      } catch (error) {
        console.error("Error creating schedule item:", error);
        throw new GraphQLError("Failed to create schedule item", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Update an existing schedule item
    updateScheduleItem: async (_, { id, item }) => {
      try {
        // Check if the item exists
        const existingItem = await ScheduleItem.findById(id);
        if (!existingItem) {
          throw new GraphQLError("Schedule item not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Update the item
        const updatedItem = await ScheduleItem.findByIdAndUpdate(
          id,
          {
            ...item,
            updatedAt: new Date(),
          },
          { new: true, runValidators: true }
        );

        return updatedItem;
      } catch (error) {
        console.error("Error updating schedule item:", error);
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError("Failed to update schedule item", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Delete a schedule item
    deleteScheduleItem: async (_, { id }) => {
      try {
        // Check if the item exists
        const existingItem = await ScheduleItem.findById(id);
        if (!existingItem) {
          throw new GraphQLError("Schedule item not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Delete the item
        await ScheduleItem.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.error("Error deleting schedule item:", error);
        throw new GraphQLError("Failed to delete schedule item", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};

