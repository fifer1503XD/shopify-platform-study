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

  // Ordered List of Course Modules
  const moduleList = [
    { id: 'modulo-1', title: '1. Modelo de Datos de Productos' },
    { id: 'modulo-2', title: '2. Metafields y Metaobjects' },
    { id: 'modulo-3', title: '3. Filtrado y Búsqueda' },
    { id: 'modulo-4-proyecto', title: '4. Proyecto Práctico Portafolio' },
    { id: 'modulo-lab-dev-store', title: '🛍️ Lab: Tienda Dev & Simular Transacción' },
    { id: 'modulo-customizing-themes', title: '🎨 Módulo: Customizing Themes' },
    { id: 'modulo-exploring-extending-data', title: '🧩 Módulo: Exploring & Extending Data Model' },
    { id: 'modulo-5-lab', title: '★ 8. Laboratorio Sandbox PDP' },
    { id: 'modulo-plp-lab', title: '🛍️ 9. Lab: Creación de PLP & Catálogo' },
    { id: 'modulo-theme-components', title: '🔍 10. Auditoría de Componentes del Tema' },
    { id: 'modulo-casio-clone', title: '⌚ 11. Práctica Final: Clon Casio Colombia' }
  ];

  const moduleSections = document.querySelectorAll('.module-section');
  const moduleDropdown = document.getElementById('moduleSelectDropdown');
  const prevModBtn = document.getElementById('prevModuleBtn');
  const nextModBtn = document.getElementById('nextModuleBtn');
  const currentModBadge = document.getElementById('currentModuleBadge');

  let currentModuleIndex = 0;

  // Set and render active module
  function setActiveModule(targetModuleId, targetSubtopicId = null, updateHash = true) {
    let index = moduleList.findIndex(m => m.id === targetModuleId);
    if (index === -1) index = 0;
    currentModuleIndex = index;

    const activeId = moduleList[index].id;

    // Show only the selected module section
    moduleSections.forEach(section => {
      if (section.getAttribute('id') === activeId) {
        section.classList.add('active-module-view');
      } else {
        section.classList.remove('active-module-view');
      }
    });

    // Update Dropdown Selector
    if (moduleDropdown) {
      moduleDropdown.value = activeId;
    }

    // Update Header Indicator Badge
    if (currentModBadge) {
      currentModBadge.innerText = `Módulo ${index + 1} de ${moduleList.length}`;
    }

    // Update Navigation Arrow Buttons
    if (prevModBtn) {
      prevModBtn.disabled = (index === 0);
    }
    if (nextModBtn) {
      nextModBtn.disabled = (index === moduleList.length - 1);
    }

    // Update Sidebar Navigation Active States
    const allNavLinks = document.querySelectorAll('.sidebar .nav-link');
    const allSubLinks = document.querySelectorAll('.sidebar .nav-sub-link');

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    allSubLinks.forEach(subLink => {
      const href = subLink.getAttribute('href');
      if (targetSubtopicId && href === `#${targetSubtopicId}`) {
        subLink.classList.add('active');
      } else {
        subLink.classList.remove('active');
      }
    });

    // Update URL hash if requested
    if (updateHash) {
      const newHash = targetSubtopicId ? `#${targetSubtopicId}` : `#${activeId}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
      }
    }

    // Scroll handling
    if (targetSubtopicId) {
      const subElem = document.getElementById(targetSubtopicId);
      if (subElem) {
        setTimeout(() => {
          subElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        return;
      }
    }
    
    // Default scroll to top of content area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Dropdown Change
  if (moduleDropdown) {
    moduleDropdown.addEventListener('change', (e) => {
      setActiveModule(e.target.value);
    });
  }

  // Handle Prev / Next Module Buttons
  if (prevModBtn) {
    prevModBtn.addEventListener('click', () => {
      if (currentModuleIndex > 0) {
        setActiveModule(moduleList[currentModuleIndex - 1].id);
      }
    });
  }

  if (nextModBtn) {
    nextModBtn.addEventListener('click', () => {
      if (currentModuleIndex < moduleList.length - 1) {
        setActiveModule(moduleList[currentModuleIndex + 1].id);
      }
    });
  }

  // Intercept Sidebar & Pagination Link Clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const targetId = href.replace('#', '');
    
    // Check if target is a module section
    const isModule = moduleList.some(m => m.id === targetId);
    if (isModule) {
      e.preventDefault();
      setActiveModule(targetId);
      return;
    }

    // Check if target is a subtopic inside a module
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const parentModule = targetElement.closest('.module-section');
      if (parentModule) {
        e.preventDefault();
        const parentModuleId = parentModule.getAttribute('id');
        setActiveModule(parentModuleId, targetId);
      }
    }
  });

  // Handle Initial Load and Browser Back/Forward (hashchange)
  function handleUrlHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      setActiveModule(moduleList[0].id, null, false);
      return;
    }

    const isModule = moduleList.some(m => m.id === hash);
    if (isModule) {
      setActiveModule(hash, null, false);
      return;
    }

    const subElem = document.getElementById(hash);
    if (subElem) {
      const parentModule = subElem.closest('.module-section');
      if (parentModule) {
        setActiveModule(parentModule.getAttribute('id'), hash, false);
        return;
      }
    }

    // Default fallback
    setActiveModule(moduleList[0].id, null, false);
  }

  window.addEventListener('hashchange', handleUrlHash);
  handleUrlHash();

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
      }
    });
  }

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

  // Knowledge Check: Pickup Availability
  const pickupQuizForm = document.getElementById('pickupQuizForm');
  const pickupQuizFeedback = document.getElementById('pickupQuizFeedback');
  if (pickupQuizForm && pickupQuizFeedback) {
    pickupQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const optMarket = document.getElementById('puOptMarket').checked;
      const optLocation = document.getElementById('puOptLocation').checked; // True
      const optVariant = document.getElementById('puOptVariant').checked; // True
      const optStoreAvail = document.getElementById('puOptStoreAvail').checked; // True

      if (!optMarket && optLocation && optVariant && optStoreAvail) {
        pickupQuizFeedback.className = 'quiz-feedback-box success';
        pickupQuizFeedback.innerHTML = `
          <strong>🎉 ¡Excelente! Exactamente:</strong><br>
          Para consultar y desplegar la disponibilidad de retiro en tienda física se requieren:
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem;">
            <li><code>variant</code>: La variante específica seleccionada por el cliente.</li>
            <li><code>location</code>: La sucursal física donde se almacena el inventario.</li>
            <li><code>store_availability</code>: El objeto de Liquid que consulta en tiempo real si esa variante está disponible para pickup en dicha ubicación.</li>
          </ul>
        `;
      } else {
        pickupQuizFeedback.className = 'quiz-feedback-box error';
        pickupQuizFeedback.innerHTML = `
          <strong>❌ Revisa tus selecciones:</strong><br>
          Debes seleccionar exactamente los 3 objetos requeridos: <code>location</code>, <code>variant</code> y <code>store_availability</code>. (El objeto <code>market</code> se utiliza para localización geográfica y divisas, no para pickup físico).
        `;
      }
    });
  }

  // Knowledge Check: Try Before You Buy (Selling Plans)
  const tbybQuizForm = document.getElementById('tbybQuizForm');
  const tbybQuizFeedback = document.getElementById('tbybQuizFeedback');
  if (tbybQuizForm && tbybQuizFeedback) {
    tbybQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const optInventory = document.getElementById('tbOptInventory').checked;
      const optVariant = document.getElementById('tbOptVariant').checked; // True
      const optGroup = document.getElementById('tbOptGroup').checked; // True
      const optPlan = document.getElementById('tbOptPlan').checked; // True

      if (!optInventory && optVariant && optGroup && optPlan) {
        tbybQuizFeedback.className = 'quiz-feedback-box success';
        tbybQuizFeedback.innerHTML = `
          <strong>🎉 ¡Correcto!</strong><br>
          Los 3 objetos necesarios para implementar "Try Before You Buy" o compras con planes de suscripción son:
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem;">
            <li><code>variant</code>: La variante del producto asociada a la opción de compra.</li>
            <li><code>selling_plan_group</code>: Agrupa los diferentes planes de venta aplicables a los productos.</li>
            <li><code>selling_plan</code>: Define las reglas específicas del plan (período de prueba, frecuencia de cobro, descuentos).</li>
          </ul>
        `;
      } else {
        tbybQuizFeedback.className = 'quiz-feedback-box error';
        tbybQuizFeedback.innerHTML = `
          <strong>❌ Revisa tus respuestas:</strong><br>
          Los 3 objetos son <code>variant</code>, <code>selling_plan_group</code> y <code>selling_plan</code>.
        `;
      }
    });
  }

  // Knowledge Check: Metafield vs Metaobject (3 Casos)
  const mfVsMoQuizForm = document.getElementById('mfVsMoQuizForm');
  const mfVsMoFeedback = document.getElementById('mfVsMoFeedback');
  if (mfVsMoQuizForm && mfVsMoFeedback) {
    mfVsMoQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const case1 = document.querySelector('input[name="case1_choice"]:checked')?.value;
      const case2 = document.querySelector('input[name="case2_choice"]:checked')?.value;
      const case3 = document.querySelector('input[name="case3_choice"]:checked')?.value;

      const isC1Ok = case1 === 'metafield';
      const isC2Ok = case2 === 'metaobject';
      const isC3Ok = case3 === 'metafield';

      if (isC1Ok && isC2Ok && isC3Ok) {
        mfVsMoFeedback.className = 'quiz-feedback-box success';
        mfVsMoFeedback.innerHTML = `
          <strong>🎉 ¡Perfecto! Dominas la distinción de arquitectura:</strong><br>
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem;">
            <li><strong>Caso 1 (Joyería artesanal): Metafield.</strong> Son datos específicos de cada producto (notas de envío, tiempos de despacho individuales).</li>
            <li><strong>Caso 2 (Cajas de suscripción reutilizables): Metaobject.</strong> Es una entidad estructurada completa (imagen, descripción, conteo de items) que se reutiliza a lo largo de varias páginas y blogs.</li>
            <li><strong>Caso 3 (Metadatos en Blog Posts): Metafield.</strong> Son campos adicionales asignados directamente al recurso existente (Article / Blog post) para bio de autor y tiempo de lectura.</li>
          </ul>
        `;
      } else {
        mfVsMoFeedback.className = 'quiz-feedback-box error';
        mfVsMoFeedback.innerHTML = `
          <strong>❌ Hay respuestas que revisar:</strong><br>
          Recordá: Los <strong>Metafields</strong> extienden entidades existentes con campos puntuales (Productos, Artículos). Los <strong>Metaobjects</strong> definen estructuras de datos independientes con múltiples campos que se pueden reutilizar e instanciar muchas veces.
        `;
      }
    });
  }

  // Knowledge Check: Module 9 PLP Architecture & Performance
  const btnCheckPlpQuiz = document.getElementById('btnCheckPlpQuiz');
  if (btnCheckPlpQuiz) {
    btnCheckPlpQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="plp_q1"]:checked')?.value;
      const q2 = document.querySelector('input[name="plp_q2"]:checked')?.value;

      const f1 = document.getElementById('feedback-plp-q1');
      const f2 = document.getElementById('feedback-plp-q2');

      if (f1) {
        if (q1 === 'b') {
          f1.className = 'quiz-feedback correct';
          f1.innerHTML = '<strong>✓ ¡Correcto!</strong> El límite arquitectónico del tag <code>{% paginate %}</code> en Liquid es de <strong>50 productos por página</strong>.';
        } else {
          f1.className = 'quiz-feedback incorrect';
          f1.innerHTML = '<strong>✕ Incorrecto.</strong> Shopify impone un límite estricto de máximo 50 productos por página en el servidor para proteger la latencia del render.';
        }
      }

      if (f2) {
        if (q2 === 'b') {
          f2.className = 'quiz-feedback correct';
          f2.innerHTML = '<strong>✓ ¡Exacto!</strong> La arquitectura atómica con <code>card-product.liquid</code> permite reutilizar exactamente el mismo markup en la PLP, carruseles de la Home, recomendaciones y búsqueda, garantizando coherencia visual y mantenimiento centralizado.';
        } else {
          f2.className = 'quiz-feedback incorrect';
          f2.innerHTML = '<strong>✕ Incorrecto.</strong> La razón principal es el principio DRY (Don\'t Repeat Yourself) y la reutilización modular en múltiples secciones y plantillas del tema.';
        }
      }
    });
  }

  // Knowledge Check: Module 10 Theme Component Audit
  const btnCheckThemeQuiz = document.getElementById('btnCheckThemeQuiz');
  if (btnCheckThemeQuiz) {
    btnCheckThemeQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="theme_q1"]:checked')?.value;
      const q2 = document.querySelector('input[name="theme_q2"]:checked')?.value;

      const f1 = document.getElementById('feedback-theme-q1');
      const f2 = document.getElementById('feedback-theme-q2');

      if (f1) {
        if (q1 === 'b') {
          f1.className = 'quiz-feedback correct';
          f1.innerHTML = '<strong>✓ ¡Correcto!</strong> <code>{{ content_for_header }}</code> es obligatorio en <code>layout/theme.liquid</code> para inyectar scripts de Shopify, apps instaladas, analytics y metadatos dinámicos.';
        } else {
          f1.className = 'quiz-feedback incorrect';
          f1.innerHTML = '<strong>✕ Incorrecto.</strong> La etiqueta requerida es <code>{{ content_for_header }}</code>.';
        }
      }

      if (f2) {
        if (q2 === 'a') {
          f2.className = 'quiz-feedback correct';
          f2.innerHTML = '<strong>✓ ¡Exacto!</strong> En OS 2.0 se debe migrar de <code>{% include %}</code> a <code>{% render %}</code>, pasando parámetros explícitos para aislar el scope de variables y maximizar la velocidad de compilación en el servidor.';
        } else {
          f2.className = 'quiz-feedback incorrect';
          f2.innerHTML = '<strong>✕ Incorrecto.</strong> La refactorización oficial recomendada por Shopify es reemplazar <code>{% include %}</code> por <code>{% render %}</code> con scope aislado.';
        }
      }
    });
  }

  // Knowledge Check: Module 11 Casio Store Architecture
  const btnCheckCasioQuiz = document.getElementById('btnCheckCasioQuiz');
  if (btnCheckCasioQuiz) {
    btnCheckCasioQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="casio_q1"]:checked')?.value;
      const q2 = document.querySelector('input[name="casio_q2"]:checked')?.value;

      const f1 = document.getElementById('feedback-casio-q1');
      const f2 = document.getElementById('feedback-casio-q2');

      if (f1) {
        if (q1 === 'b') {
          f1.className = 'quiz-feedback correct';
          f1.innerHTML = '<strong>✓ ¡Correcto!</strong> Usar <code>&lt;picture&gt;</code> con fuentes móviles diferenciadas y <code>fetchpriority="high"</code> en el primer slide optimiza el LCP (Largest Contentful Paint) sin descargar bytes innecesarios en smartphones.';
        } else {
          f1.className = 'quiz-feedback incorrect';
          f1.innerHTML = '<strong>✕ Incorrecto.</strong> La técnica de alto rendimiento es entregar imágenes mobile recortadas específicamente mediante el tag <code>&lt;picture&gt;</code> y priorizar la carga del primer slide.';
        }
      }

      if (f2) {
        if (q2 === 'a') {
          f2.className = 'quiz-feedback correct';
          f2.innerHTML = '<strong>✓ ¡Exacto!</strong> La combinación de <strong>Shopify Ajax Cart API</strong> con la <strong>Section Rendering API</strong> permite actualizar el carrito asíncronamente y renderizar el markup de la sección devuelto por Liquid sin necesidad de frameworks pesados.';
        } else {
          f2.className = 'quiz-feedback incorrect';
          f2.innerHTML = '<strong>✕ Incorrecto.</strong> La arquitectura nativa de Shopify utiliza la Section Rendering API junto con la Ajax Cart API para refrescar los drawers dinámicamente.';
        }
      }
    });
  }
});

