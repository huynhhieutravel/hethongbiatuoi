const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('raw.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const nav = document.querySelector('.giuseart-nav');
if (nav) {
    fs.writeFileSync('social_widget.html', nav.outerHTML);
    console.log("Extracted social widget!");
} else {
    console.log("Could not find giuseart-nav");
}
