const fs = require('fs');
const rawSql = fs.readFileSync('db_content.txt', 'utf8');
const jsonStart = rawSql.indexOf('[');
const jsonStr = rawSql.substring(jsonStart);
const json = JSON.parse(jsonStr);
fs.writeFileSync('bia_thap_content.html', json[0].results[0].content);
