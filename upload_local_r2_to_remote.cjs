const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function main() {
  const sqliteDbPath = '.wrangler/state/v3/r2/miniflare-R2BucketObject/b0063a97b0f4246ca0cba6d6d16e7d50d938bd45975ebcbc4019654d2aaa90f3.sqlite';
  const blobsDir = '.wrangler/state/v3/r2/hethongbiatuoi-media/blobs';

  console.log('Fetching keys and blobs from local R2 emulator...');
  
  const output = execSync(`sqlite3 ${sqliteDbPath} "SELECT key, blob_id FROM _mf_objects WHERE key LIKE '%.webp'"`, { encoding: 'utf-8' });
  const lines = output.trim().split('\n');

  let count = 0;
  for (const line of lines) {
    if (!line) continue;
    const [key, blobId] = line.split('|');
    const blobPath = path.join(blobsDir, blobId);

    if (!fs.existsSync(blobPath)) {
      console.warn(`Blob file not found for ${key}: ${blobPath}`);
      continue;
    }

    console.log(`Uploading ${key} to remote R2...`);
    try {
      execSync(`npx wrangler r2 object put hethongbiatuoi-media/"${key}" --file="${blobPath}" --remote`);
      count++;
    } catch (err) {
      console.error(`Failed to upload ${key}:`, err.message);
    }
  }

  console.log(`Successfully uploaded ${count} .webp objects to remote R2!`);
}

main();
