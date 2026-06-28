const fs = require('fs');

let rawHtml = fs.readFileSync('raw.html', 'utf8');
const scriptStartIdx = rawHtml.indexOf('<script src="https://hethongbiatuoi.com/wp-includes/js/jquery/jquery.min.js');
let allScripts = rawHtml.substring(scriptStartIdx, rawHtml.indexOf('</body>'));

// Proxy domains
allScripts = allScripts.replace(/https:\/\/hethongbiatuoi\.com/g, '/proxy-cors');

// Add is:inline
allScripts = allScripts.replace(/<script/g, '<script is:inline');
allScripts = allScripts.replace(/is:inline is:inline/g, 'is:inline');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

// Find where scripts start in Layout.astro
const layoutScriptStartIdx = layout.indexOf('<script is:inline src="/proxy-cors/wp-includes/js/jquery/jquery.min.js');

if (layoutScriptStartIdx !== -1) {
    const layoutEnd = layout.indexOf('</body>', layoutScriptStartIdx);
    layout = layout.substring(0, layoutScriptStartIdx) + allScripts + '\n\t    ' + layout.substring(layoutEnd);
    fs.writeFileSync('src/layouts/Layout.astro', layout);
    console.log("Successfully replaced all scripts in Layout.astro with raw.html exact scripts.");
} else {
    console.log("Could not find start of scripts in Layout.astro");
}

