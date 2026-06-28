const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

const swiperCss = '<link rel="stylesheet" href="/proxy-cors/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css" media="all">';
const swiperJs = '<script src="/proxy-cors/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js"></script>';

if (!layout.includes('swiper.min.css')) {
    layout = layout.replace('</head>', `    ${swiperCss}\n  </head>`);
}

if (!layout.includes('swiper.min.js')) {
    layout = layout.replace('</body>', `    ${swiperJs}\n  </body>`);
}

fs.writeFileSync('src/layouts/Layout.astro', layout);
console.log("Injected Swiper CSS/JS into Layout.astro");
