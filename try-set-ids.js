// Try different set IDs for Evolving Skies
const https = require('https');

const possibleIds = [
  'swsh7',
  'swsh07',
  'swsh7-evolving-skies',
  'swsh-evolvingskies',
  'evolving-skies',
  'eevee-heroes',
  'swsh7.5',
  'swsh7_5',
  'base1',  // Test with a known set
];

async function trySetId(setId) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.pokemontcg.io',
      port: 443,
      path: `/v2/sets/${setId}`,
      method: 'GET',
      headers: {
        'X-Api-Key': '876a76de-f2b3-4501-ac5e-cd4d011b82ae'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          console.log(`✅ ${setId.padEnd(25)} -> ${json.data.name} (${json.data.series})`);
        } else {
          console.log(`❌ ${setId.padEnd(25)} -> Not found (${res.statusCode})`);
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log(`❌ ${setId.padEnd(25)} -> Request error`);
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log(`❌ ${setId.padEnd(25)} -> Timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function tryAll() {
  console.log('Testing possible set IDs for Evolving Skies:\n');

  for (const id of possibleIds) {
    await trySetId(id);
    await new Promise(r => setTimeout(r, 200)); // Small delay between requests
  }
}

tryAll();
