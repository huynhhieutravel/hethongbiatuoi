const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

try {
    // 1. Extract labels from original HTML
    const originalHtml = fs.readFileSync('bia_thap_content.html', 'utf8');
    const labelMap = {};
    const regex = /data-thumbnail="([^"]+)"[^>]+aria-label="([^"]+)"/g;
    let match;
    while ((match = regex.exec(originalHtml)) !== null) {
        let url = match[1];
        let label = match[2];
        // Strip size suffix from original URL to get base URL
        url = url.replace(/-[0-9]{3,4}x[0-9]{3,4}\.(jpg|jpeg|png|webp)$/i, '.$1');
        labelMap[url] = label;
    }

    console.log(`Found ${Object.keys(labelMap).length} labels in original HTML.`);

    // 2. Dump current DB content
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

    // 3. Update Gallery Items
    $('.custom-masonry-gallery .gallery-item').each((i, el) => {
        const anchor = $(el).find('a.glightbox');
        const img = $(el).find('img');
        
        if (img.length > 0) {
            const src = img.attr('src');
            const label = labelMap[src] || "Hình ảnh thực tế bia tháp";
            
            // Add alt
            img.attr('alt', label);
            
            // Add data-title to anchor for Lightbox
            if (anchor.length > 0) {
                anchor.attr('data-title', label);
                anchor.attr('data-description', label);
            }
            
            // Add caption below image
            if ($(el).find('.gallery-caption').length === 0) {
                $(el).append(`<div class="gallery-caption">${label}</div>`);
            }
            changed = true;
        }
    });

    // 4. Save to DB
    if (changed) {
        let newContent = $.html();
        if (newContent.startsWith('<html><head></head><body>')) {
            newContent = newContent.replace(/^<html><head><\/head><body>/, '').replace(/<\/body><\/html>$/, '');
        }

        let escapedContent = newContent.replace(/'/g, "''");
        const sql = `UPDATE Post SET content = '${escapedContent}' WHERE id = ${post.id};\n`;
        fs.writeFileSync('update_gallery_captions.sql', sql);
        execSync('npx wrangler d1 execute hethongbiatuoi-db --local --file=update_gallery_captions.sql', { stdio: 'inherit' });
        console.log("Database updated successfully with captions and alt tags!");
    } else {
        console.log("No gallery items needed updating.");
    }

} catch (e) {
    console.error("Error:", e.message);
}
