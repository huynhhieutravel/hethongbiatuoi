const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('raw.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const styles = document.querySelectorAll('style');
styles.forEach(s => {
    if (s.textContent.includes('giuseart-nav')) {
        fs.writeFileSync('social_style.html', s.outerHTML);
        console.log("Extracted social style!");
    }
});
