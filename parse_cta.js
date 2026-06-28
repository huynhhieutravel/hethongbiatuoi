const fs = require('fs');
const html = fs.readFileSync('templates.json', 'utf8');
const match = html.match(/Liên Hệ Tư Vấn Mua Sỉ Lẻ[\s\S]*?(?=<section|<div class="elementor-section)/);
if(match) console.log("FOUND IN TEMPLATES");
else console.log("NOT IN TEMPLATES");
