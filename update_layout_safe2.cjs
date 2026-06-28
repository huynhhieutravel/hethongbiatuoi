const fs = require('fs');
let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');
const missingJs = fs.readFileSync('missing_js.html', 'utf8');

// The first script from extracted_js is jquery-chosen
layout = layout.replace(
    '<script src="/proxy-cors/wp-content/plugins/jet-search/assets/lib/chosen/chosen.jquery.min.js?ver=1.8.7" id="jquery-chosen-js"></script>',
    missingJs + '\n<script src="/proxy-cors/wp-content/plugins/jet-search/assets/lib/chosen/chosen.jquery.min.js?ver=1.8.7" id="jquery-chosen-js"></script>'
);

fs.writeFileSync('src/layouts/Layout.astro', layout);
