UPDATE Media SET url = REPLACE(url, 'https://media.hethongbiatuoi.com/', '/uploads/');
UPDATE Post SET content = REPLACE(content, 'https://media.hethongbiatuoi.com/', '/uploads/');
