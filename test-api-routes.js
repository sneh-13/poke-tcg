// Test if API routes work
// Run this after starting the server: node test-api-routes.js

async function testAPIRoutes() {
  console.log('Testing API routes...\n');

  try {
    // Test set endpoint
    console.log('1. Testing /api/sets/swsh7...');
    const setResponse = await fetch('http://localhost:3000/api/sets/swsh7');
    const setText = await setResponse.text();
    console.log('Status:', setResponse.status);
    console.log('Response:', setText.substring(0, 200), '...\n');

    if (setResponse.ok) {
      const setData = JSON.parse(setText);
      console.log('✅ Set found:', setData.name, '\n');
    } else {
      console.log('❌ Set fetch failed\n');
    }

    // Test cards endpoint
    console.log('2. Testing /api/cards?setId=swsh7...');
    const cardsResponse = await fetch('http://localhost:3000/api/cards?setId=swsh7');
    const cardsText = await cardsResponse.text();
    console.log('Status:', cardsResponse.status);
    console.log('Response:', cardsText.substring(0, 200), '...\n');

    if (cardsResponse.ok) {
      const cardsData = JSON.parse(cardsText);
      console.log('✅ Cards found:', cardsData.length, 'cards\n');
    } else {
      console.log('❌ Cards fetch failed\n');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPIRoutes();
