const fs = require('fs');
const path = require('path');

const filesToProcess = [
    'src/components/Footer.astro',
    'src/components/HeaderSolid.astro',
    'src/pages/index.astro'
];

filesToProcess.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Fix Email Obfuscation
    content = content.replace(/<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="[^"]+">\[email(?:&#160;|&nbsp;)protected\]<\/a>/g, '<a href="mailto:hethongbiathap@gmail.com">hethongbiathap@gmail.com</a>');

    // 2. Fix Lazy Load Images
    content = content.replace(/<img[^>]+data-lazy-src=(?:'[^']+'|"[^"]+")[^>]*>\s*<noscript>\s*(<img[^>]+>)\s*<\/noscript>/g, '$1');

    // 3. Fix Lazy Load iFrames (e.g. Google Maps)
    content = content.replace(/<iframe[^>]+data-lazy-src=(?:'[^']+'|"[^"]+")[^>]*><\/iframe>\s*<noscript>\s*(<iframe[^>]+><\/iframe>)\s*<\/noscript>/g, '$1');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Fixed lazyload & email in ${file}`);
    }
});
