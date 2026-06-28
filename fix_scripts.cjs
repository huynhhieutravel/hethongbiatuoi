const fs = require('fs');

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');

layout = layout.replace(/<script /g, '<script is:inline ');
layout = layout.replace(/<script>/g, '<script is:inline>');

// If there are duplicates like <script is:inline is:inline, fix them
layout = layout.replace(/is:inline is:inline/g, 'is:inline');

fs.writeFileSync('src/layouts/Layout.astro', layout);
console.log("Added is:inline to all scripts in Layout.astro");
