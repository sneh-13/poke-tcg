// Find the correct set ID for Evolving Skies
const pokemon = require('pokemontcgsdk');

pokemon.configure({
  apiKey: '876a76de-f2b3-4501-ac5e-cd4d011b82ae'
});

async function findEvolvingSkies() {
  try {
    console.log('Searching for Evolving Skies...\n');

    // Try different approaches
    console.log('1. Trying direct ID: swsh7');
    try {
      const set1 = await pokemon.set.find('swsh7');
      console.log('   ✅ Found:', set1.name, '- ID:', set1.id);
      return;
    } catch (e) {
      console.log('   ❌ Not found with swsh7');
    }

    console.log('\n2. Searching by name...');
    const result = await pokemon.set.where({ q: 'name:"Evolving Skies"', pageSize: 10 });
    if (result.data && result.data.length > 0) {
      result.data.forEach(set => {
        console.log(`   ✅ Found: ${set.name} - ID: ${set.id}`);
      });
    } else {
      console.log('   ❌ No sets found');
    }

    console.log('\n3. Listing all Sword & Shield sets...');
    const swshSets = await pokemon.set.where({ q: 'series:"Sword & Shield"', pageSize: 20 });
    console.log(`   Found ${swshSets.data.length} sets:\n`);
    swshSets.data.forEach(set => {
      console.log(`   ${set.id.padEnd(20)} - ${set.name}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

findEvolvingSkies();
