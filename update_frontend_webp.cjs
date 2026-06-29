const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (['.astro', '.ts', '.tsx', '.vue'].includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Regex to find media.hethongbiatuoi.com URLs ending in .jpg or .png
      const regex = /(https:\/\/media\.hethongbiatuoi\.com\/[a-zA-Z0-9_.-]+)\.(jpg|png|jpeg)/gi;
      
      const newContent = content.replace(regex, '$1.webp');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Finished updating frontend source code.');
