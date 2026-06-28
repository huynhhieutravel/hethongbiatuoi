import fs from 'fs';
import { execSync } from 'child_process';

const downloads = JSON.parse(fs.readFileSync('downloads.json', 'utf8'));

console.log(`Found ${downloads.length} media items. Starting download and upload...`);

if (!fs.existsSync('./tmp_media')) {
    fs.mkdirSync('./tmp_media');
}

for (let i = 0; i < downloads.length; i++) {
    const item = downloads[i];
    const filepath = `./tmp_media/${item.filename}`;
    
    try {
        if (!fs.existsSync(filepath)) {
            console.log(`[${i+1}/${downloads.length}] Downloading ${item.url}...`);
            execSync(`curl -sL "${item.url}" -o "${filepath}"`);
        }
        
        console.log(`[${i+1}/${downloads.length}] Uploading ${item.filename} to R2...`);
        execSync(`npx wrangler r2 object put hethongbiatuoi-media/${item.filename} --file="${filepath}" --remote`, {stdio: 'inherit'});
        
    } catch (e) {
        console.error(`Error processing ${item.filename}:`, e.message);
    }
}

console.log("Done uploading all media!");
