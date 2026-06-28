const fs = require('fs');

async function fix() {
    const rawSql = fs.readFileSync('db_all.txt', 'utf8');
    const jsonStart = rawSql.indexOf('[');
    const jsonStr = rawSql.substring(jsonStart);
    const json = JSON.parse(jsonStr);
    
    const results = json[0].results;
    let sqlStatements = '';

    for (const row of results) {
        if (row.content) {
            const fixedContent = row.content.replace(/(-\d+x\d+)(\.[a-zA-Z0-9]+)/g, '$2');
            if (fixedContent !== row.content) {
                sqlStatements += `UPDATE Post SET content = '${fixedContent.replace(/'/g, "''")}' WHERE slug = '${row.slug}';\n`;
            }
        }
    }
    
    if (sqlStatements) {
        fs.writeFileSync('fix_all_images.sql', sqlStatements);
        console.log("SQL created in fix_all_images.sql");
    } else {
        console.log("No images to fix.");
    }
}
fix();
