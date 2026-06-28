const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('live_page.html', 'utf8');
const $ = cheerio.load(html);
const section = $('h4:contains("Liên Hệ Tư Vấn")').closest('section.elementor-section');
fs.writeFileSync('live_cta_section.html', section.prop('outerHTML') || 'NOT FOUND');
console.log("Extracted to live_cta_section.html");
