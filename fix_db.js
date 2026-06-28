import { execSync } from 'child_process';

const query = `SELECT id, content FROM Post WHERE content LIKE '%media.hethongbiatuoi.com/202%' OR content LIKE '%media.hethongbiatuoi.com/201%';`;
const resultStr = execSync(`npx wrangler d1 execute hethongbiatuoi-db --remote --json --command="${query}"`).toString();

const result = JSON.parse(resultStr);

const rows = result[0].results;
for (const row of rows) {
    let newContent = row.content;
    newContent = newContent.replace(/https:\/\/media\.hethongbiatuoi\.com\/\d{4}\/\d{2}\/([^\/"]+\.[a-z0-9]+)/gi, 'https://media.hethongbiatuoi.com/$1');
    
    if (newContent !== row.content) {
        // escape quotes
        let safeContent = newContent.replace(/'/g, "''");
        execSync(`npx wrangler d1 execute hethongbiatuoi-db --remote --command="UPDATE Post SET content = '${safeContent}' WHERE id = ${row.id};"`);
        console.log(`Fixed post ${row.id}`);
    }
}
console.log("Done");
