import { gql } from '@apollo/client';

export interface WeddingDetails {
  id?: string;
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  receptionTime: string;
  receptionLocation: string;
  receptionAddress: string;
  additionalInfo: string;
}

export const GET_WEDDING_DETAILS = gql`
  query GetWeddingDetails {
    getWeddingDetails {
      id
      ceremonyDate
      ceremonyTime
      ceremonyLocation
      ceremonyAddress
      receptionTime
      receptionLocation
      receptionAddress
      additionalInfo
    }
  }
`;

export const UPDATE_WEDDING_DETAILS = gql`
  mutation UpdateWeddingDetails($input: WeddingDetailsInput!) {
    updateWeddingDetails(input: $input) {
      id
      ceremonyDate
      ceremonyTime
      ceremonyLocation
      ceremonyAddress
      receptionTime
      receptionLocation
      receptionAddress
      additionalInfo
    }
  }
`;

