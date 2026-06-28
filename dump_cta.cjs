const Database = require('better-sqlite3');
const db = new Database('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/26fc83fa6a44b65921174b06fec046455bd0f22eb6ce854e09359d289ba032ea.sqlite');
const row = db.prepare("SELECT content FROM Post WHERE content LIKE '%Tư Vấn Mua Sỉ Lẻ%' LIMIT 1").get();
if (row) {
    require('fs').writeFileSync('raw_cta.html', row.content);
    console.log("Dumped raw_cta.html");
} else {
    console.log("Not found in Post content");
}
