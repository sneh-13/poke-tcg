// List first page of sets
const pokemon = require('pokemontcgsdk');

pokemon.configure({
  apiKey: '876a76de-f2b3-4501-ac5e-cd4d011b82ae'
});

async function listSets() {
  try {
    console.log('Fetching first 50 sets...\n');

    const result = await pokemon.set.where({ pageSize: 50, page: 1 });

    console.log(`Total sets available: ${result.totalCount}`);
    console.log(`Showing ${result.data.length} sets:\n`);

    result.data.forEach((set, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${set.id.padEnd(25)} - ${set.name} (${set.series})`);
    });

    // Find Evolving Skies specifically
    const evolvingSkies = result.data.find(s => s.name.includes('Evolving Skies'));
    if (evolvingSkies) {
      console.log('\n✅ FOUND EVOLVING SKIES:');
      console.log(`   ID: ${evolvingSkies.id}`);
      console.log(`   Name: ${evolvingSkies.name}`);
      console.log(`   Series: ${evolvingSkies.series}`);
      console.log(`   Total Cards: ${evolvingSkies.total}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

listSets();
