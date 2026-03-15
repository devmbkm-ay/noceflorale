import { rsvpResolvers } from "./rsvp.js";
import { scheduleResolvers } from "./schedule.js";
import { weddingDetailsResolvers } from "./weddingDetails.js";
import { galleryResolvers } from "./gallery.js";
// import { userResolvers } from "./user.js";

// Merge all resolvers
export const resolvers = {
  Query: {
    ...rsvpResolvers.Query,
    ...scheduleResolvers.Query,
    ...weddingDetailsResolvers.Query,
    ...galleryResolvers.Query,
    // Add other query resolvers here when they're created
    // ...userResolvers.Query,
  },
  Mutation: {
    ...rsvpResolvers.Mutation,
    ...scheduleResolvers.Mutation,
    ...weddingDetailsResolvers.Mutation,
    ...galleryResolvers.Mutation,
    // Add other mutation resolvers here when they're created
    // ...userResolvers.Mutation,
  },
  // Add other resolver types here when needed (e.g., Subscription, custom type resolvers)
};
