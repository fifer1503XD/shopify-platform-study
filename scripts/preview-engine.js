// Preview Engine: Live Interactive Simulator for Liquid Component (Mobile & Desktop)

document.addEventListener('DOMContentLoaded', () => {
  const deviceFrame = document.getElementById('deviceFrame');
  const btnDesktop = document.getElementById('viewDesktopBtn');
  const btnMobile = document.getElementById('viewMobileBtn');
  const previewContainer = document.getElementById('shopifyLivePreview');
  const toggleDataBtn = document.getElementById('toggleDataStateBtn');
  const dataStatusIndicator = document.getElementById('dataStateStatus');

  let hasData = true;

  // Viewport Switcher
  if (btnDesktop && btnMobile && deviceFrame) {
    btnDesktop.addEventListener('click', () => {
      btnDesktop.classList.add('active');
      btnMobile.classList.remove('active');
      deviceFrame.className = 'device-frame mode-desktop';
    });

    btnMobile.addEventListener('click', () => {
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
      deviceFrame.className = 'device-frame mode-mobile';
    });
  }

  // Render Liquid Section Simulator
  function renderSimulator() {
    if (!previewContainer) return;

    if (!hasData) {
      previewContainer.innerHTML = `
        <div style="padding: 3rem 1.5rem; text-align: center; color: #6b7280;">
          <svg style="width: 48px; height: 48px; margin: 0 auto 1rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem;">Sección Liquid Oculta (Condición no cumplida)</h4>
          <p style="font-size: 0.875rem; max-width: 440px; margin: 0 auto; line-height: 1.5;">
            El bloque condicional <code>{% if product.metafields.custom.tech_specs != blank %}</code> evaluó a <strong>false</strong>. No se genera HTML innecesario en el DOM.
          </p>
        </div>
      `;
      if (dataStatusIndicator) {
        dataStatusIndicator.innerHTML = '<span style="color: #f43f5e; font-weight: 700;">● Sin Metafields</span> (Sección Liquid Oculta)';
      }
      if (toggleDataBtn) {
        toggleDataBtn.innerText = 'Cargar Datos de Metafields';
      }
      return;
    }

    const product = window.ShopifyCourseData.products.complexTech;
    const specs = product.metafields.custom.tech_specs;
    const pdf = product.metafields.custom.specs_pdf;
    const warranty = product.metafields.custom.warranty_and_care;

    previewContainer.innerHTML = `
      <div class="shopify-section-preview">
        <!-- Mobile Notch if in mobile mode -->
        <div class="mobile-notch"></div>
        
        <div class="spec-header-area">
          <span class="spec-category-tag">${product.productType} • ${product.vendor}</span>
          <h2 class="spec-product-title">${product.title}</h2>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem;">
            ${product.options.map(opt => `<span style="font-size: 0.75rem; background: #f3f4f6; color: #4b5563; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600;">${opt.name}: ${opt.values.join(', ')}</span>`).join('')}
          </div>
        </div>

        <div class="spec-layout-grid">
          <!-- Columna 1: Especificaciones Técnicas (Metafields) -->
          <div class="specs-card-box">
            <div class="specs-card-title">
              <span>Especificaciones de Ingeniería</span>
              <span style="font-size: 0.75rem; background: #e0f2fe; color: #0284c7; padding: 0.2rem 0.6rem; border-radius: 9999px;">Metafield: tech_specs</span>
            </div>

            <div class="specs-meta-list">
              <div class="spec-item-row">
                <span class="spec-label">Transductor (Driver)</span>
                <span class="spec-value">${specs.driver_size}</span>
              </div>
              <div class="spec-item-row">
                <span class="spec-label">Respuesta en Frecuencia</span>
                <span class="spec-value">${specs.frequency_response}</span>
              </div>
              <div class="spec-item-row">
                <span class="spec-label">Autonomía de Batería</span>
                <span class="spec-value">${specs.battery_life}</span>
              </div>
              <div class="spec-item-row">
                <span class="spec-label">Conectividad</span>
                <span class="spec-value">${specs.connectivity}</span>
              </div>
              <div class="spec-item-row">
                <span class="spec-label">Procesamiento DAC</span>
                <span class="spec-value">${specs.dac_support}</span>
              </div>
            </div>

            <a href="${pdf.url}" class="pdf-download-btn" onclick="alert('Simulación: Descargando ${pdf.filename} desde Shopify CDN.'); return false;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Descargar Ficha Técnica PDF (${pdf.filesize})</span>
            </a>
          </div>

          <!-- Columna 2: Metaobject Garantía y Cuidados -->
          <div class="metaobject-warranty-card">
            <div>
              <span class="warranty-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Metaobject Referenciado
              </span>
              <h3 class="warranty-title" style="margin-top: 0.5rem;">${warranty.title}</h3>
              <p class="warranty-desc">${warranty.coverage_period}</p>
            </div>

            <div>
              <h5 style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #047857; margin-bottom: 0.4rem; letter-spacing: 0.05em;">Guía de Mantenimiento:</h5>
              <ul class="care-steps-list">
                ${warranty.cleaning_instructions.map(step => `
                  <li class="care-step-item">
                    <span class="bullet">✓</span>
                    <span>${step}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div style="font-size: 0.75rem; color: #6b7280; border-top: 1px solid #dcfce7; padding-top: 0.75rem; margin-top: auto;">
              Soporte oficial: <a href="mailto:${warranty.contact_support}" style="color: #059669; font-weight: 600; text-decoration: none;">${warranty.contact_support}</a>
            </div>
          </div>
        </div>
      </div>
    `;

    if (dataStatusIndicator) {
      dataStatusIndicator.innerHTML = '<span style="color: #95bf47; font-weight: 700;">● Metafields Poblados</span> (Renderizado Activo)';
    }
    if (toggleDataBtn) {
      toggleDataBtn.innerText = 'Vaciar Metafields (Simular null)';
    }
  }

  // Toggle populated vs empty metafields state
  if (toggleDataBtn) {
    toggleDataBtn.addEventListener('click', () => {
      hasData = !hasData;
      renderSimulator();
    });
  }

  // Initial render
  renderSimulator();
});
