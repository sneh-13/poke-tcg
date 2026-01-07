// Fetch actual sets from the API
const https = require('https');

function fetchSets() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.pokemontcg.io',
      port: 443,
      path: '/v2/sets?pageSize=100',
      method: 'GET',
      headers: {
        'X-Api-Key': '876a76de-f2b3-4501-ac5e-cd4d011b82ae'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          console.log(`Found ${json.data.length} sets\n`);

          // Find Evolving Skies
          const evolvingSkies = json.data.find(s => s.name.includes('Evolving Skies'));
          if (evolvingSkies) {
            console.log('✅ FOUND EVOLVING SKIES:');
            console.log(`   ID: "${evolvingSkies.id}"`);
            console.log(`   Name: ${evolvingSkies.name}`);
            console.log(`   Series: ${evolvingSkies.series}`);
            console.log(`   Total: ${evolvingSkies.total}`);
            console.log(`   Release: ${evolvingSkies.releaseDate}\n`);
          }

          // List all Sword & Shield sets
          console.log('All Sword & Shield sets:');
          const swshSets = json.data.filter(s => s.series === 'Sword & Shield');
          swshSets.forEach(set => {
            console.log(`   ${set.id.padEnd(20)} - ${set.name}`);
          });

          resolve();
        } else {
          console.error(`Error: ${res.statusCode}`);
          console.error(data);
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Request timed out');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

fetchSets().catch(console.error);
