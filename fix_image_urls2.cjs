const fs = require('fs');

async function fix() {
    const rawSql = fs.readFileSync('db_content.txt', 'utf8');
    const jsonStart = rawSql.indexOf('[');
    const jsonStr = rawSql.substring(jsonStart);
    const json = JSON.parse(jsonStr);
    let content = json[0].results[0].content;

    // Remove WordPress sizing suffixes like -1024x1024 or -768x432
    // e.g. /uploads/image-name-1024x1024.jpg -> /uploads/image-name.jpg
    content = content.replace(/(-\d+x\d+)(\.[a-zA-Z0-9]+)/g, '$2');
    
    // Write back the sql statement
    const sql = `UPDATE Post SET content = '${content.replace(/'/g, "''")}' WHERE slug = 'bia-thap';`;
    fs.writeFileSync('fix_images.sql', sql);
    console.log("SQL created in fix_images.sql");
}
fix();
