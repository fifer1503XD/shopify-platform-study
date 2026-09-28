/**
 * Shopify CLI Terminal Sandbox & Quiz Logic
 * Module 15 - Shopify Masterclass Tutorial
 */

document.addEventListener('DOMContentLoaded', () => {
  const cliTerminalOutput = document.getElementById('cliTerminalOutput');
  const cliInputForm = document.getElementById('cliInputForm');
  const cliInputField = document.getElementById('cliInputField');
  const btnClearCliTerminal = document.getElementById('btnClearCliTerminal');
  const quickCmdBtns = document.querySelectorAll('.cli-cmd-btn');

  const COMMAND_RESPONSES = {
    'shopify theme dev': `
<span style="color: #38bdf8;">➜ shopify theme dev --store=casio-colombia-dev.myshopify.com</span>
<span style="color: #94a3b8;">[15:30:10] Authenticating with Shopify ID...</span>
<span style="color: #10b981;">✔ Logged in as dev@casiobytimesquare.co</span>
<span style="color: #94a3b8;">[15:30:11] Syncing local files with development theme...</span>
<span style="color: #10b981;">✔ Development theme (#14920491823) created and synced (148 files).</span>

<span style="color: #fbbf24; font-weight: bold;">┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓</span>
<span style="color: #fbbf24; font-weight: bold;">┃                      SHOPIFY THEME DEV SERVER                   ┃</span>
<span style="color: #fbbf24; font-weight: bold;">┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛</span>

  <span style="color: #38bdf8; font-weight: bold;">Preview Local Server:</span>   <span style="color: #a78bfa; text-decoration: underline;">http://127.0.0.1:9292</span>
  <span style="color: #10b981; font-weight: bold;">Theme Editor Sync:</span>      <span style="color: #a78bfa; text-decoration: underline;">https://casio-colombia-dev.myshopify.com/admin/themes/14920491823/editor</span>
  <span style="color: #94a3b8;">Hot Reload:</span>             <span style="color: #10b981;">Enabled (Watching layout/, sections/, snippets/, assets/)</span>

<span style="color: #64748b;">[15:30:15] GET / 200 OK (Served via Local Proxy in 84ms)</span>
<span style="color: #64748b;">[15:30:18] Updated: sections/featured-collection.liquid → Live reloaded!</span>
`,

    'shopify theme check': `
<span style="color: #a78bfa;">➜ shopify theme check</span>
<span style="color: #94a3b8;">Analyzing 148 files against theme-check:recommended...</span>

<span style="color: #ef4444; font-weight: bold;">[ERROR]</span> <span style="color: #e2e8f0;">snippets/card-product.liquid:14:5</span>
  <span style="color: #ef4444;">DeprecatedTag:</span> The <code>{% include %}</code> tag is deprecated. Use <code>{% render %}</code> instead for isolated scope and caching.

<span style="color: #f59e0b; font-weight: bold;">[WARNING]</span> <span style="color: #e2e8f0;">sections/hero-banner.liquid:42:10</span>
  <span style="color: #f59e0b;">ImgLazyLoading:</span> First slide banner should use <code>loading="eager"</code> and <code>fetchpriority="high"</code> to optimize LCP.

<span style="color: #10b981; font-weight: bold;">[SUCCESS]</span> <span style="color: #e2e8f0;">ValidSchema:</span> All 28 JSON schemas in sections/ and templates/ are 100% valid.

<span style="color: #94a3b8;">Found 1 error, 1 warning in 148 files (checked in 410ms).</span>
`,

    'shopify theme pull --live': `
<span style="color: #34d399;">➜ shopify theme pull --live</span>
<span style="color: #94a3b8;">[15:32:01] Fetching live theme details from casio-colombia-dev.myshopify.com...</span>
<span style="color: #10b981;">✔ Target Theme: "Casio Colombia Main 2026" (ID: 9812049182) [LIVE]</span>
<span style="color: #94a3b8;">[15:32:02] Downloading assets, layouts, sections, and JSON templates...</span>
<span style="color: #10b981;">✔ 148 files downloaded to ./my-shopify-theme/</span>
<span style="color: #94a3b8;">Local directory is now strictly synchronized with the production store.</span>
`,

    'shopify theme push --unpublished': `
<span style="color: #fbbf24;">➜ shopify theme push --unpublished</span>
<span style="color: #94a3b8;">[15:33:14] Packaging local files (148 files)...</span>
<span style="color: #94a3b8;">[15:33:15] Creating new unpublished theme on remote store...</span>
<span style="color: #10b981;">✔ Theme uploaded successfully!</span>

  <span style="color: #fbbf24; font-weight: bold;">Theme Name:</span>    <span style="color: #ffffff;">Staging Redesign v2.4 (Unpublished)</span>
  <span style="color: #94a3b8;">Theme ID:</span>      <span style="color: #ffffff;">14992019482</span>
  <span style="color: #38bdf8;">Shareable URL:</span> <span style="color: #a78bfa; text-decoration: underline;">https://casio-colombia-dev.myshopify.com/?preview_theme_id=14992019482</span>

<span style="color: #10b981;">✔ Production theme (#9812049182) was NOT modified. Safe for client QA preview.</span>
`
  };

  function appendToTerminal(htmlContent) {
    if (!cliTerminalOutput) return;
    const block = document.createElement('div');
    block.style.marginBottom = '1.25rem';
    block.style.borderBottom = '1px dashed rgba(255,255,255,0.08)';
    block.style.paddingBottom = '0.75rem';
    block.innerHTML = htmlContent;
    cliTerminalOutput.appendChild(block);
    cliTerminalOutput.scrollTop = cliTerminalOutput.scrollHeight;
  }

  // Quick Command Buttons
  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd && COMMAND_RESPONSES[cmd]) {
        appendToTerminal(COMMAND_RESPONSES[cmd]);
      }
    });
  });

  // Custom Form Input
  if (cliInputForm && cliInputField) {
    cliInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawInput = cliInputField.value.trim();
      if (!rawInput) return;

      const normalized = rawInput.toLowerCase();
      cliInputField.value = '';

      if (COMMAND_RESPONSES[normalized]) {
        appendToTerminal(COMMAND_RESPONSES[normalized]);
      } else if (normalized === 'clear' || normalized === 'cls') {
        cliTerminalOutput.innerHTML = '';
      } else if (normalized.startsWith('shopify theme dev')) {
        appendToTerminal(COMMAND_RESPONSES['shopify theme dev']);
      } else if (normalized.startsWith('shopify theme check')) {
        appendToTerminal(COMMAND_RESPONSES['shopify theme check']);
      } else if (normalized.startsWith('shopify theme pull')) {
        appendToTerminal(COMMAND_RESPONSES['shopify theme pull --live']);
      } else if (normalized.startsWith('shopify theme push')) {
        appendToTerminal(COMMAND_RESPONSES['shopify theme push --unpublished']);
      } else {
        appendToTerminal(`
<span style="color: #ef4444;">➜ ${rawInput}</span>
<span style="color: #94a3b8;">shopify-cli: command executed. Para probar comandos predeterminados usa:</span>
<span style="color: #38bdf8;">• shopify theme dev</span>
<span style="color: #a78bfa;">• shopify theme check</span>
<span style="color: #34d399;">• shopify theme pull --live</span>
<span style="color: #fbbf24;">• shopify theme push --unpublished</span>
        `);
      }
    });
  }

  // Clear Terminal Button
  if (btnClearCliTerminal && cliTerminalOutput) {
    btnClearCliTerminal.addEventListener('click', () => {
      cliTerminalOutput.innerHTML = `
        <div style="color: #64748b;">
          # Terminal limpiada.<br>
          # Ejecuta un comando para continuar la simulación.
        </div>
      `;
    });
  }

  // Knowledge Check Quiz Verification
  const btnCheckCliQuiz = document.getElementById('btnCheckCliQuiz');
  if (btnCheckCliQuiz) {
    btnCheckCliQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="cli_q1"]:checked')?.value;
      const q2 = document.querySelector('input[name="cli_q2"]:checked')?.value;

      const f1 = document.getElementById('feedback-cli-q1');
      const f2 = document.getElementById('feedback-cli-q2');

      if (f1) {
        if (q1 === 'b') {
          f1.className = 'quiz-feedback correct';
          f1.innerHTML = '<strong>✓ ¡Correcto!</strong> Liquid y la base de datos se ejecutan en la infraestructura en la nube de Shopify. El CLI levanta un proxy local que sincroniza tus archivos con un tema efímero de desarrollo.';
        } else {
          f1.className = 'quiz-feedback incorrect';
          f1.innerHTML = '<strong>✕ Incorrecto.</strong> Liquid no se compila localmente ni en el navegador; se procesa en los servidores de Shopify en la nube.';
        }
      }

      if (f2) {
        if (q2 === 'a') {
          f2.className = 'quiz-feedback correct';
          f2.innerHTML = '<strong>✓ ¡Exacto!</strong> Usar <code>shopify theme push --unpublished</code> crea un tema borrador aislado con su propia URL de vista previa, garantizando que el tema en producción no sufra ninguna alteración durante el proceso de pruebas.';
        } else {
          f2.className = 'quiz-feedback incorrect';
          f2.innerHTML = '<strong>✕ Incorrecto.</strong> El comando seguro es <code>shopify theme push --unpublished</code>. Usar <code>--live</code> sobreescribiría la tienda en producción.';
        }
      }
    });
  }
});
