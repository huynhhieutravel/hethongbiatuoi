const fs = require('fs');
let html = fs.readFileSync('live_cta_section.html', 'utf8');

// Convert HTML to JSX-friendly format for Astro
html = html.replace(/https:\/\/hethongbiatuoi.com\/wp-content\//g, '/proxy-cors/wp-content/');

fs.writeFileSync('ready_cta.html', html);
console.log("Ready");
