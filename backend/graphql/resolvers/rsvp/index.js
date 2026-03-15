import { rsvpQueries } from "./queries.js";
import { rsvpMutations } from "./mutations.js";

export const rsvpResolvers = {
  Query: rsvpQueries,
  Mutation: rsvpMutations,
};
