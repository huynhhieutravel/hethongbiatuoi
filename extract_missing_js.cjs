const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('raw.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

let missingJs = '';

// Extract jQuery
const scripts = document.querySelectorAll('script');
scripts.forEach(s => {
    if (s.src && s.src.includes('jquery.min.js')) {
        missingJs += s.outerHTML + '\n';
    }
    if (s.src && s.src.includes('jquery-migrate')) {
        missingJs += s.outerHTML + '\n';
    }
    if (!s.src && s.textContent.includes('elementorFrontendConfig')) {
        missingJs += s.outerHTML + '\n';
    }
});

fs.writeFileSync('missing_js.html', missingJs);
console.log("Extracted missing JS!");
