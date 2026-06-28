const fs = require('fs');
const css = fs.readFileSync('extracted_css.html', 'utf8');
const js = fs.readFileSync('extracted_js.html', 'utf8');

let layout = `---
import { ClientRouter } from 'astro:transitions';
import HeaderSolid from '../components/HeaderSolid.astro';
import Footer from '../components/Footer.astro';

export interface Props {
	title: string;
    description?: string;
}

const { title, description = "Hệ thống nhà hàng bia tươi uy tín, chất lượng." } = Astro.props;
---

<!DOCTYPE html>
<html lang="vi">
	<head>
		<meta charset="UTF-8" />
		<meta name="description" content={description}>
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
		<ClientRouter />
        ${css}
	</head>
	<body class="elementor-default elementor-kit-40">
        <HeaderSolid />
        <slot />
        <Footer />
        ${js}
	</body>
</html>
`;
fs.writeFileSync('src/layouts/Layout.astro', layout);
