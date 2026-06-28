const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

// Find the problematic WP rocket inline script and remove it
const startStr = '<script is:inline>function lazyLoadThumb';
const startIdx = layout.indexOf(startStr);

if (startIdx !== -1) {
    const endStr = '});</script>';
    const endIdx = layout.indexOf(endStr, startIdx);
    
    if (endIdx !== -1) {
        layout = layout.substring(0, startIdx) + layout.substring(endIdx + endStr.length);
        fs.writeFileSync('src/layouts/Layout.astro', layout);
        console.log("Removed problematic WP rocket inline script.");
    } else {
        console.log("Could not find end of WP rocket script.");
    }
} else {
    console.log("Could not find WP rocket script.");
}
