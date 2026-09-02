const fs = require('fs');
const path = require('path');

// Fallback for pages with no category markup
const CATEGORY_FALLBACK = {
    'effective-communication.html':  { category: 'Relationships',   href: '../categories/relationships.html' },
    'healthy-boundaries.html':       { category: 'Wellness',        href: '../categories/wellness.html' },
    'home-organization.html':        { category: 'Home Living',     href: '../categories/home-living.html' },
    'journaling-benefits.html':      { category: 'Wellness',        href: '../categories/wellness.html' },
    'mindful-productivity.html':     { category: 'Productivity',    href: '../categories/productivity.html' },
    'morning-wellness.html':         { category: 'Wellness',        href: '../categories/wellness.html' },
    'relationship-building.html':    { category: 'Relationships',   href: '../categories/relationships.html' },
    'work-life-balance.html':        { category: 'Productivity',    href: '../categories/productivity.html' },
};

const tipsDir = path.join(__dirname, 'tips');
const files = fs.readdirSync(tipsDir).filter(f => f.endsWith('.html'));

let updated = 0;

files.forEach(file => {
    const filePath = path.join(tipsDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Skip if breadcrumb already present
    if (html.includes('tip-breadcrumbs')) {
        console.log(`SKIP (already has breadcrumb): ${file}`);
        return;
    }

    // Extract h1 — try tip-header structure first, then article structure, then second h1
    let title = '';
    const h1InHeader = html.match(/class="tip-header"[\s\S]{0,800}?<h1>([\s\S]*?)<\/h1>/);
    const h1InArticle = html.match(/<article[\s\S]{0,50}?>\s*<h1>([\s\S]*?)<\/h1>/);
    const allH1s = [...html.matchAll(/<h1>([\s\S]*?)<\/h1>/g)];
    if (h1InHeader) title = h1InHeader[1].trim();
    else if (h1InArticle) title = h1InArticle[1].trim();
    else if (allH1s.length >= 2) title = allH1s[1][1].trim(); // skip nav logo h1

    // Extract category — class="category", class="tip-category", or div.tip-category > span
    const catWithIcon = html.match(/class="(?:tip-)?category"[^>]*><i[^>]*><\/i>\s*([^<]+)<\/span>/);
    const catPlain = html.match(/class="(?:tip-)?category"[^>]*>([^<]+)<\/span>/);
    const catInDiv = html.match(/<div class="tip-category">\s*<span>([^<]+)<\/span>/);
    let category = catWithIcon ? catWithIcon[1].trim()
                 : catPlain    ? catPlain[1].trim()
                 : catInDiv    ? catInDiv[1].trim()
                 : '';

    // Extract category href from "More X Tips" button
    const btnMatch = html.match(/More [^"<]+ Tips.*?href="(\.\.\/categories\/[^"]+)"|href="(\.\.\/categories\/[^"]+)"[^>]*>More [^<]+ Tips/s);
    let categoryHref = btnMatch ? (btnMatch[1] || btnMatch[2]) : '';

    // Use fallback map for pages missing category markup
    if (!category || !categoryHref) {
        const fb = CATEGORY_FALLBACK[file];
        if (fb) {
            category = category || fb.category;
            categoryHref = categoryHref || fb.href;
        }
    }
    if (!categoryHref) categoryHref = '../index.html';

    if (!title || !category) {
        console.log(`WARN: Could not extract title/category for ${file}`);
        return;
    }

    const breadcrumb = `
    <!-- Breadcrumb -->
    <nav class="tip-breadcrumbs" aria-label="Breadcrumb">
        <div class="container">
            <ol class="breadcrumb-list">
                <li><a href="../index.html"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="${categoryHref}">${category}</a></li>
                <li aria-current="page">${title}</li>
            </ol>
        </div>
    </nav>
`;

    // Insert before the main content wrapper — pick the first anchor that exists
    const ANCHORS = ['<!-- Tip Content -->', '<main class="tip-detail">', '<main class="tip-page">', '<section class="tip-page">'];
    const anchor = ANCHORS.find(a => html.includes(a));
    if (!anchor) {
        console.log(`WARN: No insertion anchor found for ${file}`);
        return;
    }
    html = html.replace(anchor, breadcrumb + '    ' + anchor);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated: ${file}`);
    updated++;
});

console.log(`\nDone. ${updated} files updated.`);
