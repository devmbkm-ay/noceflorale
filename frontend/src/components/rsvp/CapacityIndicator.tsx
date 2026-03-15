import React, { useState, useEffect } from "react";

const GET_RSVP_STATS_QUERY = `
  query GetRsvpStats {
    getRsvpStats {
      totalGuests
      maxCapacity
      attending
      notAttending
    }
  }
`;

// Helper functions to reduce complexity
const makeGraphQLRequest = async (apiUrl: string) => {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apollo-require-preflight": "true",
    },
    body: JSON.stringify({
      query: GET_RSVP_STATS_QUERY,
    }),
  });

  if (!response.ok) {
    console.error(
      "❌ Fetch response not ok:",
      response.status,
      response.statusText
    );
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

const processGraphQLResponse = (result: any) => {
  console.log("📊 Capacity stats result:", result);

  if (result.errors) {
    console.error("❌ GraphQL errors in capacity stats:", result.errors);
    throw new Error(result.errors[0]?.message || "GraphQL error");
  }

  const data = result.data?.getRsvpStats;
  if (!data) {
    throw new Error("Invalid response format");
  }

  return {
    totalGuests: data.totalGuests || 0,
    maxCapacity: data.maxCapacity || 340,
  };
};

// Capacity Indicator component to show current RSVP capacity status
const CapacityIndicator: React.FC = () => {
  const [stats, setStats] = useState<{
    totalGuests: number;
    maxCapacity: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🌍 Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      currentUrl: typeof window !== "undefined" ? window.location.href : "SSR",
    });
    // Fetch capacity stats from the server
    const fetchCapacityStats = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";
        console.log("🔗 Using API URL:", apiUrl);

        const result = await makeGraphQLRequest(apiUrl);
        const stats = processGraphQLResponse(result);
        setStats(stats);
      } catch (err) {
        console.error("❌ Error fetching capacity stats:", err);
        setError("Could not load capacity information");
      } finally {
        setLoading(false);
      }
    };

    fetchCapacityStats();
  }, []);

  if (loading || !stats || error) return null; // Don't show anything while loading or on error

  // Only show warning when capacity is at 90% or higher
  if (stats.totalGuests / stats.maxCapacity < 0.9) return null;

  return (
    <div className="mt-2 text-sm font-medium">
      {stats.totalGuests / stats.maxCapacity > 0.95 ? (
        <span className="text-red-600">
          Attention : Plus que {stats.maxCapacity - stats.totalGuests} places
          disponibles !
        </span>
      ) : (
        <span className="text-amber-600">
          Attention :{" "}
          {Math.round((stats.totalGuests / stats.maxCapacity) * 100)}% des
          places sont déjà réservées
        </span>
      )}
    </div>
  );
};

export default CapacityIndicator;
