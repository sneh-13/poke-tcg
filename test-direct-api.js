// Test direct API access
const https = require('https');

async function testAPI() {
  console.log('Testing Pokemon TCG API directly...\n');

  const options = {
    hostname: 'api.pokemontcg.io',
    port: 443,
    path: '/v2/sets/swsh7',
    method: 'GET',
    headers: {
      'X-Api-Key': '876a76de-f2b3-4501-ac5e-cd4d011b82ae'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          console.log('\n✅ Success!');
          console.log(`Set ID: ${json.data.id}`);
          console.log(`Name: ${json.data.name}`);
          console.log(`Series: ${json.data.series}`);
          console.log(`Total Cards: ${json.data.total}`);
        } else {
          console.log('\n❌ Error Response:');
          console.log(data);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.error('❌ Request timed out');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

testAPI().catch(console.error);
