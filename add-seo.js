const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://livewithvibe.com';
const ROOT = __dirname;

const TITLE_IMPROVEMENTS = {
  'tips/work-life-balance.html': 'Work-Life Balance: Set Healthy Boundaries and Prevent Burnout | VibeAndThrive',
  'tips/mindful-spending.html': 'Mindful Spending: Stop Impulse Buying and Spend with Intention | VibeAndThrive',
  'tips/gratitude-practice.html': 'Daily Gratitude Practice: Rewire Your Brain for Happiness | VibeAndThrive',
  'tips/healthy-boundaries.html': 'Healthy Boundaries: How to Set Limits and Protect Your Energy | VibeAndThrive',
  'tips/mental-wellbeing.html': 'Mental Well-being: Practical Strategies for a Healthier Mind | VibeAndThrive',
  'tips/walking-fitness.html': 'Walking for Fitness: How Daily Walks Transform Your Health | VibeAndThrive',
  'tips/mindful-productivity.html': 'Mindful Productivity: Accomplish More While Stressing Less | VibeAndThrive',
  'tips/smart-saving.html': 'Smart Saving Habits: How to Save Money Consistently Every Month | VibeAndThrive',
  'tips/money-management.html': 'Smart Money Management: Take Control of Your Finances Today | VibeAndThrive',
  'tips/home-fitness.html': 'Home Fitness Solutions: Effective Workouts Without a Gym | VibeAndThrive',
  'tips/effective-communication.html': 'Effective Communication: Build Stronger Relationships Through Better Listening | VibeAndThrive',
  'tips/journaling-benefits.html': 'Journaling for Well-being: How Writing Daily Improves Mental Health | VibeAndThrive',
  'tips/better-sleep.html': 'Better Sleep Quality: Proven Tips to Sleep Deeper and Wake Refreshed | VibeAndThrive',
  'tips/positive-thinking.html': 'Power of Positive Thinking: Science-Backed Ways to Boost Happiness | VibeAndThrive',
};

const H1_FIX_FILES = [
  'tips/creative-expression.html',
  'tips/personal-growth.html',
  'tips/social-connection.html',
  'tips/sustainable-living.html',
  'tips/time-management.html',
];

function getAllHtmlFiles() {
  const result = [];
  for (const subdir of ['', 'categories', 'tips']) {
    const dir = subdir ? path.join(ROOT, subdir) : ROOT;
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
      result.push(path.join(dir, f));
    });
  }
  return result;
}

function fileToUrl(fp) {
  const rel = path.relative(ROOT, fp).replace(/\\/g, '/');
  return rel === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${rel}`;
}

function getSchemaType(rel) {
  if (rel.startsWith('tips/')) return 'Article';
  if (rel.startsWith('categories/')) return 'CollectionPage';
  if (rel === 'index.html') return 'WebSite';
  return 'WebPage';
}

function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

let updated = 0;

for (const fp of getAllHtmlFiles()) {
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;
  const rel = path.relative(ROOT, fp).replace(/\\/g, '/');

  // Keep the static pages aligned with Google's trust requirements.
  const beforeEncodingFix = html;
  html = html.replace(/â€”/g, '&mdash;').replace(/â€“/g, '&ndash;').replace(/â€˜|â€™/g, "'");
  if (html !== beforeEncodingFix) changed = true;

  // Consent Mode defaults apply ONLY to EEA/UK/Switzerland; all other regions stay ungated.
  const consentRegions = '["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH"]';
  const consentLine = `  gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", wait_for_update: 500, region: ${consentRegions} });`;
  if (html.includes('gtag("js", new Date());')) {
    const beforeConsent = html;
    html = html.replace(/[ \t]*gtag\("consent", "default",[^\n]*\n/g, '');
    html = html.replace('  gtag("js", new Date());', consentLine + '\n  gtag("js", new Date());');
    if (html !== beforeConsent) changed = true;
  }

  if (rel.startsWith('tips/')) {
    if (!/<meta name="author"/i.test(html)) {
      const authorMeta = '    <meta name="author" content="Hari Kishan">';
      const descriptionMatch = html.match(/<meta\s+name="description"[^>]+>/i);
      if (descriptionMatch) {
        const pos = html.indexOf(descriptionMatch[0]) + descriptionMatch[0].length;
        html = html.slice(0, pos) + '\n' + authorMeta + html.slice(pos);
        changed = true;
      }
    }

    // Remove any author byline mistakenly injected into the nav logo.
    const beforeNavFix = html;
    html = html.replace(
      /(VibeAndThrive<\/a>)\s*<span class="author">[\s\S]*?<\/span>/g,
      '$1'
    );
    if (html !== beforeNavFix) changed = true;

    const beforeAuthor = html;
    html = html.replace(
      /<span class="author"><i class="fas fa-user"><\/i>\s*VibeAndThrive Team<\/span>/g,
      '<span class="author"><i class="fas fa-user"></i> <a href="../author.html">Hari Kishan</a></span>'
    );
    if (html !== beforeAuthor) changed = true;

    if (!html.includes('../author.html')) {
      const authorSpan = '<span class="author"><i class="fas fa-user"></i> <a href="../author.html">Hari Kishan</a></span>';
      const metaPos = html.indexOf('class="tip-meta"');
      if (metaPos !== -1) {
        const tipMetaEnd = html.indexOf('</div>', metaPos);
        if (tipMetaEnd !== -1) {
          html = html.slice(0, tipMetaEnd) + '                    ' + authorSpan + '\n                ' + html.slice(tipMetaEnd);
          changed = true;
        }
      } else if (/<p class="tip-subtitle">[\s\S]*?<\/p>/.test(html)) {
        html = html.replace(
          /(<p class="tip-subtitle">[\s\S]*?<\/p>)/,
          `$1\n                <div class="tip-meta">\n                    ${authorSpan}\n                </div>`
        );
        changed = true;
      } else {
        html = html.replace(
          /(<div class="tip-header">[\s\S]*?<\/h1>)/,
          `$1\n                <div class="tip-meta">\n                    ${authorSpan}\n                </div>`
        );
        changed = true;
      }
    }

    // Ensure a freshly-created tip-meta also carries category + read-time, not just the author.
    const metaMatch = html.match(/<div class="tip-meta">([\s\S]*?)<\/div>/);
    if (metaMatch
        && !/class="(?:category|tip-category)"/.test(metaMatch[1])
        && !/class="(?:read-time|tip-read-time)"/.test(metaMatch[1])
        && /class="author"/.test(metaMatch[1])) {
      const crumb = html.match(/<li><a href="\.\.\/categories\/[^"]+">([^<]+)<\/a><\/li>/);
      const category = crumb ? crumb[1].trim() : '';
      const words = (html.replace(/<[^>]+>/g, ' ').match(/\S+/g) || []).length;
      const minutes = Math.max(3, Math.round(words / 200));
      const badges =
        (category ? `<span class="category"><i class="fas fa-tag"></i> ${category}</span>\n                    ` : '') +
        `<span class="read-time"><i class="fas fa-clock"></i> ${minutes} min read</span>\n                    `;
      html = html.replace(
        /(<div class="tip-meta">\s*)(<span class="author">)/,
        `$1${badges}$2`
      );
      changed = true;
    }

    const articleImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const beforeSchema = html;
    const articleSchemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?"@type"\s*:\s*"Article"[\s\S]*?)<\/script>/i);
    if (articleSchemaMatch && !articleSchemaMatch[1].includes('"author"')) {
      html = html.replace(
        /("@type"\s*:\s*"Article",\s*)(?:"name"|"headline")\s*:\s*"([^"]+)",/i,
        `$1"headline": "$2",\n        "image": "${articleImage}",\n        "author": {\n            "@type": "Person",\n            "name": "Hari Kishan",\n            "url": "${BASE_URL}/author.html"\n        },`
      );
    }
    if (html !== beforeSchema) changed = true;
  }

  // 1. Fix logo H1 → H2 in 5 specific files
  if (H1_FIX_FILES.includes(rel)) {
    const before = html;
    html = html.replace(/<h1>(<a[^>]+class="logo-link"[^>]*>[\s\S]*?<\/a>)<\/h1>/, '<h2>$1</h2>');
    if (html !== before) { changed = true; }
  }

  // 2. Improve title tags for 14 pages
  if (TITLE_IMPROVEMENTS[rel]) {
    const before = html;
    html = html.replace(/<title>[^<]+<\/title>/i, `<title>${TITLE_IMPROVEMENTS[rel]}</title>`);
    if (html !== before) { changed = true; }
  }

  // 3. Add OG + Twitter Card + JSON-LD if not already present
  if (!/property="og:title"/i.test(html)) {
    const url = fileToUrl(fp);
    const title = extract(html, /<title>([^<]+)<\/title>/i);
    const desc = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
    const schemaType = getSchemaType(rel);
    const cleanTitle = title.replace(/\s*[|\-]\s*VibeAndThrive\s*$/i, '').trim();

    const schema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": schemaType === 'WebSite' ? 'VibeAndThrive' : cleanTitle,
      "description": desc,
      "url": url
    };
    if (schemaType === 'Article' || schemaType === 'CollectionPage') {
      schema["publisher"] = { "@type": "Organization", "name": "VibeAndThrive", "url": BASE_URL };
    }

    const schemaJson = JSON.stringify(schema, null, 4).split('\n').map(l => '    ' + l).join('\n');
    const safeTitle = title.replace(/"/g, '&quot;');
    const safeDesc = desc.replace(/"/g, '&quot;');
    const ogType = schemaType === 'Article' ? 'article' : 'website';

    const ogBlock = `    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="VibeAndThrive">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">
    <script type="application/ld+json">
${schemaJson}
    </script>`;

    const descMatch = html.match(/<meta\s+name="description"[^>]+>/i);
    if (descMatch) {
      const pos = html.indexOf(descMatch[0]) + descMatch[0].length;
      html = html.slice(0, pos) + '\n' + ogBlock + html.slice(pos);
      changed = true;
    }
  }

  // 4. Add canonical URL if missing
  if (!/rel="canonical"/i.test(html)) {
    const url = fileToUrl(fp);
    const canonical = `    <link rel="canonical" href="${url}">`;
    const iconMatch = html.match(/<link\s+rel="icon"[^>]+>/i);
    if (iconMatch) {
      const pos = html.indexOf(iconMatch[0]);
      html = html.slice(0, pos) + canonical + '\n    ' + html.slice(pos);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fp, html, 'utf8');
    updated++;
    console.log(`Updated: ${rel}`);
  }
}

console.log(`\nDone. ${updated} files updated.`);
