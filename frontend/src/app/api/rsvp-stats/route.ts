import { NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

// Configure route for static export
export const dynamic = 'force-static';

// Create Apollo Client with CSRF protection
const client = new ApolloClient({
  link: new HttpLink({
    // Ensure the URL has a protocol and host
    uri: process.env.NEXT_PUBLIC_API_URL?.startsWith('http') 
      ? process.env.NEXT_PUBLIC_API_URL 
      : `${process.env.NEXT_PUBLIC_API_URL || '/graphql'}`,
    fetch,
    headers: {
      'Content-Type': 'application/json',
      'apollo-require-preflight': 'true',
      'x-apollo-operation-name': 'GetRsvpStats',
    },
  }),
  cache: new InMemoryCache(),
});

// Query to get RSVP statistics
const GET_RSVP_STATS = gql`
  query GetRsvpStats {
    getRsvpStats {
      totalGuests
      maxCapacity
      attending
      notAttending
    }
  }
`;

export async function GET() {
  try {
    // Execute the query
    const { data } = await client.query({
      query: GET_RSVP_STATS,
      fetchPolicy: 'network-only', // Important to always get fresh data
    });

    // Return the stats
    return NextResponse.json(data.getRsvpStats);
  } catch (error) {
    console.error('Error fetching RSVP stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVP statistics' },
      { status: 500 }
    );
  }
}

