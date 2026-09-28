/**
 * Build Script for Shopify Masterclass Tutorial
 * Assembles components/ and modules/ into a unified index.html
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const header = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopify Data Architecture & Advanced Liquid Masterclass</title>
  
  <!-- Google Fonts: Inter & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Prism.js Syntax Highlighting Styles -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
  
  <!-- Local Styles -->
  <link rel="stylesheet" href="styles/main.css">
  <link rel="stylesheet" href="styles/modules.css">
  <link rel="stylesheet" href="styles/project-preview.css">
  <link rel="stylesheet" href="styles/practice-lab.css">
</head>
<body>

  <!-- Reading Progress Bar -->
  <div class="reading-progress-bar" id="readingProgress"></div>
`;

const footer = `
  <!-- Prism.js Syntax Highlighter -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-liquid.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-graphql.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>

  <!-- Application Logic -->
  <script src="scripts/data-models.js"></script>
  <script src="scripts/preview-engine.js"></script>
  <script src="scripts/practice-lab.js"></script>
  <script src="scripts/plp-lab.js"></script>
  <script src="scripts/theme-inspector.js"></script>
  <script src="scripts/casio-clone.js"></script>
  <script src="scripts/admin-explorer.js"></script>
  <script src="scripts/rbac-simulator.js"></script>
  <script src="scripts/draft-orders-lab.js"></script>
  <script src="scripts/cli-emulator.js"></script>
  <script src="scripts/app.js"></script>
</body>
</html>
`;

function readComponent(filename) {
  return fs.readFileSync(path.join(rootDir, 'components', filename), 'utf8');
}

function readModule(filename) {
  return fs.readFileSync(path.join(rootDir, 'modules', filename), 'utf8');
}

const topNav = readComponent('top-nav.html');
const sidebar = readComponent('sidebar.html');
const heroBanner = readComponent('hero-banner.html');
const moduleSwitcher = readComponent('module-switcher.html');

const moduleFiles = [
  '01-product-data-model.html',
  '02-metafields-metaobjects.html',
  '03-search-filtering.html',
  '04-portfolio-project.html',
  '05-dev-store-lab.html',
  '06-customizing-themes.html',
  '07-exploring-data-model.html',
  '08-sandbox-practice-lab.html',
  '09-plp-collection-lab.html',
  '10-theme-components-audit.html',
  '11-casio-store-clone.html',
  '12-shopify-admin-navigation-guide.html',
  '13-rbac-user-permissions.html',
  '14-draft-orders-invoicing.html',
  '15-shopify-cli-workflow.html'
];

const modulesContent = moduleFiles.map(file => {
  return `      <!-- ========================================================= -->\n      <!-- MODULE: ${file} -->\n      <!-- ========================================================= -->\n` + readModule(file);
}).join('\n\n');

const fullHtml = `${header}
${topNav}

  <!-- App Main Layout Container -->
  <div class="app-container">

${sidebar}

    <!-- Main Content Area -->
    <main class="content-area">

${heroBanner}

${moduleSwitcher}

${modulesContent}

    </main>
  </div>
${footer}`;

fs.writeFileSync(path.join(rootDir, 'index.html'), fullHtml, 'utf8');
console.log(`✅ Build completed successfully! index.html generated (${fullHtml.length} bytes).`);
