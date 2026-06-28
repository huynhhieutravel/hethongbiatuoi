import fs from 'fs';
import css from 'css';
const html = fs.readFileSync('test3.html', 'utf8');
const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
if (match) {
    for (const m of match) {
        console.log("Found style tag, length:", m.length);
        if (m.includes('archive-cta-section')) {
            console.log("This is the one! Parsing...");
            const inner = m.replace(/<style[^>]*>/, '').replace('</style>', '');
            const parsed = css.parse(inner);
            console.log("Rules count:", parsed.stylesheet.rules.length);
            // check if there's any parsing errors
            if (parsed.stylesheet.parsingErrors && parsed.stylesheet.parsingErrors.length > 0) {
                 console.log("Parsing errors:", parsed.stylesheet.parsingErrors);
            }
        }
    }
}
