// Navigation, Tabs, ScrollSpy and Code Copy Interaction

document.addEventListener('DOMContentLoaded', () => {
  // Reading Progress Bar
  const progressBar = document.getElementById('readingProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close on click outside or on nav item
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });

    const navLinks = sidebar.querySelectorAll('.nav-link, .nav-sub-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
        }
      });
    });
  }

  // ScrollSpy for Active Sidebar Links
  const sections = document.querySelectorAll('.module-section, .subtopic');
  const navLinks = document.querySelectorAll('.sidebar .nav-link, .sidebar .nav-sub-link');

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else if (href && href.startsWith('#') && !link.closest('.nav-sub-menu')) {
            // Check if current section is child of this module
            const parentModule = entry.target.closest('.module-section');
            if (parentModule && parentModule.getAttribute('id') === href.replace('#', '')) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Copy Code Button Logic
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const container = button.closest('.code-block-container') || button.closest('.tab-pane');
      const codeElement = container ? container.querySelector('code') : null;
      
      if (codeElement) {
        const textToCopy = codeElement.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalHTML = button.innerHTML;
          button.classList.add('copied');
          button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>¡Copiado!</span>
          `;
          setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
          }, 2000);
        } catch (err) {
          console.error('Error al copiar código:', err);
        }
      }
    });
  });

  // Tabbed Code Switching Logic
  document.querySelectorAll('.tabbed-code-container').forEach(tabContainer => {
    const tabBtns = tabContainer.querySelectorAll('.tab-btn');
    const tabPanes = tabContainer.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = tabContainer.querySelector(`.tab-pane[data-pane="${targetTab}"]`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  });

  // Knowledge Check Quiz Evaluation
  const quizForm = document.getElementById('devStoreQuizForm');
  const quizFeedback = document.getElementById('quizFeedback');

  if (quizForm && quizFeedback) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const opt1 = document.getElementById('quizOpt1').checked; // Developer preview (True)
      const opt2 = document.getElementById('quizOpt2').checked; // Test data generated (True)
      const opt3 = document.getElementById('quizOpt3').checked; // Plus dev store (True)
      const opt4 = document.getElementById('quizOpt4').checked; // Horizon theme (False)

      const isCorrect = opt1 && opt2 && opt3 && !opt4;

      if (isCorrect) {
        quizFeedback.className = 'quiz-feedback-box success';
        quizFeedback.innerHTML = `
          <strong>🎉 ¡Excelente respuesta! Exacto.</strong><br>
          Las opciones que hacen que una tienda de desarrollo sea <em>no transferible</em> a un cliente son:
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem;">
            <li><strong>Developer Preview Features:</strong> Habilitan APIs experimentales y flags que no son estables para producción.</li>
            <li><strong>Test Data autogenerado por Shopify:</strong> Llena la base de datos con fixtures bloqueados para transferencia.</li>
            <li><strong>Tienda de desarrollo Shopify Plus:</strong> Diseñada para pruebas sandbox exclusivas de features enterprise (Shopify Functions/B2B/Multipass).</li>
          </ul>
          <em>(El tema Horizon es simplemente un theme estándar de Shopify y no impide la transferencia).</em>
        `;
      } else {
        quizFeedback.className = 'quiz-feedback-box error';
        quizFeedback.innerHTML = `
          <strong>❌ Casi lo tenés. Recordá la regla de transferibilidad:</strong><br>
          Revisa tus selecciones. Las 3 primeras opciones (Developer Previews, Datos de prueba de Shopify, y Tiendas Plus) bloquean la transferencia a un cliente. El tema Horizon NO afecta la transferencia de la tienda.
        `;
  // Knowledge Check Quiz 2: Métodos de acceso al Theme Editor
  const themeEditorQuizForm = document.getElementById('themeEditorQuizForm');
  const themeEditorFeedback = document.getElementById('themeEditorFeedback');

  if (themeEditorQuizForm && themeEditorFeedback) {
    themeEditorQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q1Opt1 = document.getElementById('teQuizOpt1').checked; // Shopify CLI dev theme (True)
      const q1Opt2 = document.getElementById('teQuizOpt2').checked; // VS Code integration (False)
      const q1Opt3 = document.getElementById('teQuizOpt3').checked; // GitHub integration (True)
      const q1Opt4 = document.getElementById('teQuizOpt4').checked; // Upload .zip (True)

      const isQ1Correct = q1Opt1 && !q1Opt2 && q1Opt3 && q1Opt4;

      if (isQ1Correct) {
        themeEditorFeedback.className = 'quiz-feedback-box success';
        themeEditorFeedback.innerHTML = `
          <strong>🎉 ¡Correcto!</strong><br>
          Los 3 métodos válidos son:
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem;">
            <li><strong>Shopify CLI (Development theme):</strong> Genera un preview URL interactivo conectado en vivo al Theme Editor.</li>
            <li><strong>Integración con GitHub:</strong> Cada push sincroniza la rama con un tema en Shopify accesible desde el Theme Editor.</li>
            <li><strong>Subida de archivo .zip:</strong> Sube el empaquetado del tema directamente al panel de Shopify.</li>
          </ul>
          <em>(La extensión de VS Code permite editar código Liquid localmente, pero el Theme Editor visual se ejecuta en el navegador a través de Shopify).</em>
        `;
      } else {
        themeEditorFeedback.className = 'quiz-feedback-box error';
        themeEditorFeedback.innerHTML = `
          <strong>❌ Revisa tus opciones:</strong><br>
          Recuerda: El Theme Editor es una interfaz web basada en navegador. Shopify CLI, GitHub App y la subida en .zip son métodos oficiales para vincular temas con el Theme Editor. VS Code no contiene un Theme Editor drag-and-drop integrado.
        `;
      }
    });
  }

  // Knowledge Check Quiz 3: Directorio de archivos CSS
  const cssFolderQuizForm = document.getElementById('cssFolderQuizForm');
  const cssFolderFeedback = document.getElementById('cssFolderFeedback');

  if (cssFolderQuizForm && cssFolderFeedback) {
    cssFolderQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = document.querySelector('input[name="css_folder_opt"]:checked');

      if (selected && selected.value === 'assets') {
        cssFolderFeedback.className = 'quiz-feedback-box success';
        cssFolderFeedback.innerHTML = `
          <strong>🎉 ¡Exacto! <code>/assets</code></strong><br>
          Todos los archivos estáticos de soporte, como hojas de estilo CSS (<code>.css</code>), scripts JavaScript (<code>.js</code>), fuentes e imágenes del tema se ubican en el directorio <code>/assets</code> y se sirven a través del CDN optimizado de Shopify.
        `;
      } else {
        cssFolderFeedback.className = 'quiz-feedback-box error';
        cssFolderFeedback.innerHTML = `
          <strong>❌ Opción incorrecta:</strong><br>
          Las hojas de estilo CSS deben almacenarse en el directorio <strong><code>/assets</code></strong> del tema.
        `;
      }
    });
  }
});
