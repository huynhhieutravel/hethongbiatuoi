const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

try {
    // 1. Dump DB content
    execSync('npx wrangler d1 execute hethongbiatuoi-db --local --command="SELECT id, content FROM Post WHERE slug=\'bia-thap\'" --json > temp_post.json', { stdio: 'pipe' });

    const dumpStr = fs.readFileSync('temp_post.json', 'utf8');
    let dump = JSON.parse(dumpStr);
    if (dump.length > 0 && dump[0].results) dump = dump[0].results;

    if (dump.length === 0) {
        console.log("Post not found");
        process.exit(1);
    }

    const post = dump[0];
    const $ = cheerio.load(post.content);
    let changed = false;

    // 2. Fix Gallery
    const galleryWidget = $('.elementor-widget-gallery');
    if (galleryWidget.length > 0) {
        const images = [];
        galleryWidget.find('.e-gallery-image').each((i, el) => {
            const src = $(el).attr('data-thumbnail');
            if (src) images.push(src);
        });

        if (images.length > 0) {
            let cleanGallery = '<div class="custom-masonry-gallery">';
            images.forEach(src => {
                cleanGallery += `<div class="gallery-item"><img src="${src}" alt="Hình ảnh thực tế bia tháp" loading="lazy" /></div>`;
            });
            cleanGallery += '</div>';

            galleryWidget.replaceWith(cleanGallery);
            changed = true;
            console.log(`Extracted ${images.length} images for gallery.`);
        }
    }

    // 3. Fix Testimonial Carousel
    const testimonialWidget = $('.elementor-widget-testimonial-carousel');
    if (testimonialWidget.length > 0) {
        const testimonials = [];
        testimonialWidget.find('.swiper-slide').each((i, el) => {
            const content = $(el).find('.elementor-testimonial__text').html() || '';
            const name = $(el).find('.elementor-testimonial__name').text() || '';
            const title = $(el).find('.elementor-testimonial__title').text() || '';
            const image = $(el).find('.elementor-testimonial__image img').attr('src') || '';
            
            // Only add valid testimonials
            if (name.trim() !== '') {
                testimonials.push({ content, name, title, image });
            }
        });

        if (testimonials.length > 0) {
            let cleanCarousel = `
<div class="custom-testimonial-slider swiper">
    <div class="swiper-wrapper">`;
            
            testimonials.forEach(t => {
                cleanCarousel += `
        <div class="swiper-slide custom-testimonial-slide">
            <div class="testimonial-content">
                ${t.image ? `<div class="testimonial-img"><img src="${t.image}" alt="${t.name}"></div>` : ''}
                <div class="testimonial-text">"${t.content.replace(/^"|"$/g, '').trim()}"</div>
                <div class="testimonial-meta">
                    <div class="testimonial-name">${t.name}</div>
                    <div class="testimonial-title">${t.title}</div>
                </div>
            </div>
        </div>`;
            });

            cleanCarousel += `
    </div>
    <!-- Navigation -->
    <div class="swiper-button-next custom-swiper-next"></div>
    <div class="swiper-button-prev custom-swiper-prev"></div>
    <!-- Pagination -->
    <div class="swiper-pagination custom-swiper-pagination"></div>
</div>`;

            testimonialWidget.replaceWith(cleanCarousel);
            changed = true;
            console.log(`Extracted ${testimonials.length} testimonials.`);
        }
    }

    if (changed) {
        let newContent = $.html();
        // Remove Cheerio's wrapper HTML/BODY if it added one
        if (newContent.startsWith('<html><head></head><body>')) {
            newContent = newContent.replace(/^<html><head><\/head><body>/, '').replace(/<\/body><\/html>$/, '');
        }

        let escapedContent = newContent.replace(/'/g, "''");
        const sql = `UPDATE Post SET content = '${escapedContent}' WHERE id = ${post.id};\n`;
        fs.writeFileSync('update_widgets.sql', sql);
        execSync('npx wrangler d1 execute hethongbiatuoi-db --local --file=update_widgets.sql', { stdio: 'inherit' });
        console.log("Database updated successfully with clean Astro widgets!");
    } else {
        console.log("No Elementor widgets found to replace.");
    }

} catch (e) {
    console.error("Error:", e.message);
}
