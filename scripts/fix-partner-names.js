// Script to run the migratePartnerNames mutation
const fetch = require('node-fetch');

async function migratePartnerNames() {
  try {
    console.log('Running partner name migration...');
    
    // GraphQL endpoint - adjust if your GraphQL endpoint is different
    const endpoint = 'http://localhost:4000/graphql';
    
    // Mutation to migrate partner names
    const mutation = `
      mutation {
        migratePartnerNames
      }
    `;
    
    // Execute the mutation
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation
      }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('Error executing migration:', result.errors);
      return;
    }
    
    console.log('Migration completed successfully!');
    console.log(`Updated ${result.data.migratePartnerNames} records.`);
  } catch (error) {
    console.error('Failed to run migration:', error);
  }
}

// Run the migration
migratePartnerNames();

