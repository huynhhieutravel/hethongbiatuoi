const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

// Remove wp rocket lazyload script block
const startStr = '<script is:inline>window.lazyLoadOptions=';
const startIdx = layout.indexOf(startStr);

if (startIdx !== -1) {
    const endStr = '<script is:inline data-name="wpr-wpr-beacon" src=\'/proxy-cors/wp-content/plugins/wp-rocket/assets/js/wpr-beacon.min.js\' async></script>';
    const endIdx = layout.indexOf(endStr, startIdx);
    
    if (endIdx !== -1) {
        layout = layout.substring(0, startIdx) + layout.substring(endIdx + endStr.length);
        fs.writeFileSync('src/layouts/Layout.astro', layout);
        console.log("Removed wp rocket scripts!");
    } else {
        console.log("Could not find end of wp rocket script.");
    }
} else {
    console.log("Could not find wp rocket script.");
}
