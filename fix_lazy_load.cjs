const fs = require('fs');
let html = fs.readFileSync('src/components/ArchiveCTA.astro', 'utf8');

// Replace data-lazy-srcset with srcset
html = html.replace(/data-lazy-srcset=/g, 'srcset=');
// Replace data-lazy-sizes with sizes
html = html.replace(/data-lazy-sizes=/g, 'sizes=');
// Replace the fake SVG src with the real data-lazy-src
html = html.replace(/src="data:image\/svg\+xml[^"]+"\s+([^>]*?)data-lazy-src="([^"]+)"/g, 'src="$2" $1');

// Remove any remaining data-lazy-src
html = html.replace(/data-lazy-src="[^"]*"/g, '');

// Optionally remove the <noscript> tag since we now have the real image
html = html.replace(/<noscript>.*?<\/noscript>/gs, '');

fs.writeFileSync('src/components/ArchiveCTA.astro', html);
console.log("Lazy loading removed!");
