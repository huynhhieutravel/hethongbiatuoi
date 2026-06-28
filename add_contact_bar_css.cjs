const fs = require('fs');

const rawHtml = fs.readFileSync('raw.html', 'utf8');
const lines = rawHtml.split('\n');

// Extract CSS block (approx lines 118-237)
let cssBlock = '';
let inStyle = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.giuseart-nav {')) {
        inStyle = true;
        cssBlock += '.phone-mobile {display: none;}\n'; // grab the line before it too
    }
    
    if (inStyle) {
        cssBlock += lines[i] + '\n';
        if (lines[i].includes('</style>')) {
            break;
        }
    }
}

// Clean up the block
cssBlock = cssBlock.replace(/<\/style>/g, '').trim();

// Replace URLs
cssBlock = cssBlock.replace(/\/wp-content\/uploads\//g, '/proxy-cors/wp-content/uploads/');

// Read Layout.astro
let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

// Insert the CSS block right after <style is:global>
const insertPos = layout.indexOf('<style is:global>') + '<style is:global>'.length;
layout = layout.slice(0, insertPos) + '\n/* Mobile Contact Bar CSS */\n' + cssBlock + '\n' + layout.slice(insertPos);

fs.writeFileSync('src/layouts/Layout.astro', layout);
console.log('Successfully added Mobile Contact Bar CSS to Layout.astro');
