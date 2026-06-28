const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

// Replace escaped URLs in JSON configurations
// We replace 'https:\/\/hethongbiatuoi.com' with '\/proxy-cors'
layout = layout.replace(/https:\\\/\\\/hethongbiatuoi\.com/g, '\\/proxy-cors');

fs.writeFileSync('src/layouts/Layout.astro', layout);
console.log("Escaped URLs fixed!");
