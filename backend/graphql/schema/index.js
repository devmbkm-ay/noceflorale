import {userTypeDefs} from './user.js'
import {rsvpTypeDefs} from './rsvp.js'
import {scheduleTypeDefs} from './schedule.js'
import {weddingDetailsTypeDefs} from './weddingDetails.js'
import {galleryTypeDefs, galleryQueryDefs, galleryMutationDefs} from './gallery.js'


export const typeDefs = `#graphql

type Query {
  # This is a base Query type that all other schema Query types will merge with
  _empty: String
  
  # Gallery queries
  ${galleryQueryDefs}
}

type Mutation {
  # This is a base Mutation type that all other schema Mutation types will merge with
  _empty: String
  
  # Gallery mutations
  ${galleryMutationDefs}
}

${userTypeDefs}
${rsvpTypeDefs}
${scheduleTypeDefs}
${weddingDetailsTypeDefs}
${galleryTypeDefs}
`
