const fs = require('fs');

async function fix() {
    const rawSql = fs.readFileSync('db_content.txt', 'utf8');
    const json = JSON.parse(rawSql);
    const content = json[0].results[0].content;

    // Remove WordPress sizing suffixes like -1024x1024 or -768x432
    // e.g. /uploads/image-name-1024x1024.jpg -> /uploads/image-name.jpg
    const fixedContent = content.replace(/(-\d+x\d+)(\.[a-zA-Z0-9]+)/g, '$2');
    
    // Also remove them from srcset just in case it breaks formatting, 
    // but the easiest is to just replace all instances globally.
    // Wait, the srcset will have: /uploads/image-name.jpg 1024w, /uploads/image-name.jpg 300w
    // This is valid HTML, the browser will just pick one (they are all the same file).
    
    fs.writeFileSync('fixed_content.html', fixedContent);
    console.log("Fixed content saved to fixed_content.html");
}
fix();
