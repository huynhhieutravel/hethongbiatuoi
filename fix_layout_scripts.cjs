const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');
let rawHtml = fs.readFileSync('raw.html', 'utf8');

// 1. Cut everything after <Footer /> in Layout.astro
const footerTag = '<Footer />';
const footerIdx = layout.indexOf(footerTag);
if (footerIdx === -1) {
    console.error("Could not find <Footer />");
    process.exit(1);
}

layout = layout.substring(0, footerIdx + footerTag.length) + '\n';

// 2. Extract scripts from raw.html
const jqueryCore = '<script src="https://hethongbiatuoi.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>';
const jqueryMigrate = '<script src="https://hethongbiatuoi.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>';
const imagesLoaded = '<script src="https://hethongbiatuoi.com/wp-includes/js/imagesloaded.min.js?ver=c88f82e923c79248aa8e29f3de5a76bc" id="imagesLoaded-js"></script>';

let bottomScriptsStart = rawHtml.indexOf('<script src="https://hethongbiatuoi.com/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js');
let bottomScripts = rawHtml.substring(bottomScriptsStart, rawHtml.indexOf('</body>'));

// Combine
let allScripts = [jqueryCore, jqueryMigrate, imagesLoaded, bottomScripts].join('\n');

// 3. Proxy domains
allScripts = allScripts.replace(/https:\/\/hethongbiatuoi\.com/g, '/proxy-cors');

// 4. Add is:inline
allScripts = allScripts.replace(/<script/g, '<script is:inline');
allScripts = allScripts.replace(/is:inline is:inline/g, 'is:inline');

// 5. Remove WP Rocket inline scripts
allScripts = allScripts.replace(/<script is:inline>window\.lazyLoadOptions=.*?<\/script>/g, '');
allScripts = allScripts.replace(/<script is:inline>function lazyLoadThumb.*?<\/script>/g, '');

// Append to Layout and close body/html
layout += allScripts + '\n    </body>\n</html>';

fs.writeFileSync('src/layouts/Layout.astro', layout);
console.log("Layout.astro cleaned and fixed!");
