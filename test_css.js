const fs = require('fs');
const html = fs.readFileSync('test3.html', 'utf8');
const match = html.match(/<style is:global>(.*?)<\/style>/s) || html.match(/<style[^>]*>(.*?)<\/style>/s);
if (match) fs.writeFileSync('test.css', match[1]);
