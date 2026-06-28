const fs = require('fs');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

try {
    // Dump DB content
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

    // Fix Custom Gallery to add Lightbox anchors
    $('.custom-masonry-gallery .gallery-item').each((i, el) => {
        const img = $(el).find('img');
        if (img.length > 0 && !$(el).find('a.glightbox').length) {
            const src = img.attr('src');
            // Wrap img in an anchor tag
            img.wrap(`<a href="${src}" class="glightbox" data-gallery="gallery1"></a>`);
            changed = true;
        }
    });

    if (changed) {
        let newContent = $.html();
        if (newContent.startsWith('<html><head></head><body>')) {
            newContent = newContent.replace(/^<html><head><\/head><body>/, '').replace(/<\/body><\/html>$/, '');
        }

        let escapedContent = newContent.replace(/'/g, "''");
        const sql = `UPDATE Post SET content = '${escapedContent}' WHERE id = ${post.id};\n`;
        fs.writeFileSync('update_lightbox.sql', sql);
        execSync('npx wrangler d1 execute hethongbiatuoi-db --local --file=update_lightbox.sql', { stdio: 'inherit' });
        console.log("Database updated successfully with Lightbox anchors!");
    } else {
        console.log("No gallery items needed updating.");
    }

} catch (e) {
    console.error("Error:", e.message);
}
