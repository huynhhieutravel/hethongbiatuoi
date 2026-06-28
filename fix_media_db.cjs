const fs = require('fs');
const { execSync } = require('child_process');

try {
    const downloads = JSON.parse(fs.readFileSync('downloads.json', 'utf8'));
    let sql = `-- Fix Media URLs using exact IDs\n`;
    
    for (const d of downloads) {
        let originalUrl = d.url;
        // Replace with our local cors proxy to fix CORS during dev
        let proxyUrl = originalUrl.replace('https://hethongbiatuoi.com', '/proxy-cors');
        sql += `UPDATE Media SET url = '${proxyUrl}' WHERE id = ${d.id};\n`;
    }

    fs.writeFileSync('update_media_urls.sql', sql);
    console.log('SQL generated. Executing...');
    execSync('npx wrangler d1 execute hethongbiatuoi-db --local --file=update_media_urls.sql');
    console.log('Fixed media URLs in DB!');
} catch (e) {
    console.error(e);
}
