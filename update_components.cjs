const fs = require('fs');
const header = fs.readFileSync('extracted_header.html', 'utf8');
const footer = fs.readFileSync('extracted_footer.html', 'utf8');
const css = fs.readFileSync('extracted_css.html', 'utf8');
const js = fs.readFileSync('extracted_js.html', 'utf8');

// Replace domain if needed? The user said 100% like old site.
// We can just keep https://hethongbiatuoi.com for CSS/JS for now, because media.hethongbiatuoi.com doesn't work locally.

fs.writeFileSync('src/components/HeaderSolid.astro', '---\n---\n' + header);
fs.writeFileSync('src/components/Footer.astro', '---\n---\n' + footer);

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

// The Tailwind layout has <head> and <body>. We need to inject css into <head> and js into before </body>
layout = layout.replace('</head>', '\n    <!-- Elementor CSS -->\n    ' + css + '\n  </head>');
layout = layout.replace('</body>', '\n    <!-- Elementor JS -->\n    ' + js + '\n  </body>');

// Replace the <Header /> with <HeaderSolid /> in layout.
layout = layout.replace("import Header from '../components/Header.astro';", "import HeaderSolid from '../components/HeaderSolid.astro';");
layout = layout.replace('<Header />', '<HeaderSolid />');

fs.writeFileSync('src/layouts/Layout.astro', layout);
