const fs = require('fs');
const { execSync } = require('child_process');

try {
    // 1. Dump current DB content
    execSync('npx wrangler d1 execute hethongbiatuoi-db --local --command="SELECT id, content FROM Post" --json > db_dump.json', { stdio: 'pipe' });

    // 2. Read JSON
    const dumpStr = fs.readFileSync('db_dump.json', 'utf8');
    let dump = JSON.parse(dumpStr);
    if (dump.length > 0 && dump[0].results) dump = dump[0].results;

    // 3. Process each post and create SQL updates
    let sql = '';
    for (const post of dump) {
        if (!post.content) continue;
        
        // Replace -[number]x[number].jpg with .jpg
        let newContent = post.content.replace(/-[0-9]{3,4}x[0-9]{3,4}\.(jpg|jpeg|png|webp)/gi, '.$1');
        
        if (newContent !== post.content) {
            let escapedContent = newContent.replace(/'/g, "''");
            sql += `UPDATE Post SET content = '${escapedContent}' WHERE id = ${post.id};\n`;
        }
    }

    if (sql) {
        fs.writeFileSync('update_image_sizes.sql', sql);
        console.log("Found images to fix! Updating DB...");
        execSync('npx wrangler d1 execute hethongbiatuoi-db --local --file=update_image_sizes.sql', { stdio: 'inherit' });
        console.log("DB updated successfully!");
    } else {
        console.log("No images needed fixing.");
    }
} catch (e) {
    console.error("Error:", e.message);
    if (e.stdout) console.error("STDOUT:", e.stdout.toString());
    if (e.stderr) console.error("STDERR:", e.stderr.toString());
}
