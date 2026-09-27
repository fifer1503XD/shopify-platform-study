// Interactive Practice Lab Logic: Product & Metafield Creator and Liquid Renderer

document.addEventListener('DOMContentLoaded', () => {
  const metafieldsContainer = document.getElementById('metafieldsBuilderList');
  const addMetafieldBtn = document.getElementById('addMetafieldBtn');
  const labForm = document.getElementById('practiceProductForm');
  const pdpOutputScreen = document.getElementById('renderedPdpOutput');
  const liquidCodeOutput = document.getElementById('generatedLiquidCode');
  const jsonSchemaOutput = document.getElementById('generatedJsonSchema');
  
  const presetTechBtn = document.getElementById('presetTechProduct');
  const presetFashionBtn = document.getElementById('presetFashionProduct');

  // Tab switching inside preview pane
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const tabPanes = {
    preview: document.getElementById('tabPanePreview'),
    liquid: document.getElementById('tabPaneLiquid'),
    json: document.getElementById('tabPaneJson')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-lab-tab');
      Object.keys(tabPanes).forEach(key => {
        if (tabPanes[key]) {
          tabPanes[key].style.display = (key === target) ? 'block' : 'none';
        }
      });
    });
  });

  let metafieldCounter = 0;

  // Add a dynamic metafield row
  function createMetafieldRow(namespace = 'custom', key = '', type = 'single_line_text_field', value = '') {
    metafieldCounter++;
    const rowId = `metafield_row_${metafieldCounter}`;

    const card = document.createElement('div');
    card.className = 'metafield-item-card';
    card.id = rowId;

    card.innerHTML = `
      <div class="metafield-card-header">
        <span>#${metafieldCounter} • ${namespace}.${key || 'nuevo_campo'}</span>
        <button type="button" class="remove-metafield-btn" onclick="document.getElementById('${rowId}').remove()">✕ Eliminar</button>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label>Namespace</label>
          <input type="text" class="form-input mf-namespace" value="${namespace}" placeholder="custom" required>
        </div>
        <div class="form-group">
          <label>Key</label>
          <input type="text" class="form-input mf-key" value="${key}" placeholder="ej: material_composition" required>
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group">
          <label>Tipo de Dato</label>
          <select class="form-select mf-type">
            <option value="single_line_text_field" ${type === 'single_line_text_field' ? 'selected' : ''}>single_line_text_field</option>
            <option value="multi_line_text_field" ${type === 'multi_line_text_field' ? 'selected' : ''}>multi_line_text_field</option>
            <option value="number_integer" ${type === 'number_integer' ? 'selected' : ''}>number_integer</option>
            <option value="color" ${type === 'color' ? 'selected' : ''}>color (Hex #)</option>
            <option value="file_reference" ${type === 'file_reference' ? 'selected' : ''}>file_reference (URL/PDF/Imagen)</option>
            <option value="json" ${type === 'json' ? 'selected' : ''}>json (Estructura Objeto)</option>
            <option value="metaobject_reference" ${type === 'metaobject_reference' ? 'selected' : ''}>metaobject_reference</option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor asignado</label>
          <input type="text" class="form-input mf-value" value="${value}" placeholder="Valor del campo..." required>
        </div>
      </div>
    `;

    metafieldsContainer.appendChild(card);
  }

  if (addMetafieldBtn) {
    addMetafieldBtn.addEventListener('click', () => {
      createMetafieldRow('custom', 'nuevo_campo', 'single_line_text_field', 'Valor de ejemplo');
    });
  }

  // Load Presets
  function loadPreset(type) {
    metafieldsContainer.innerHTML = '';
    metafieldCounter = 0;

    if (type === 'tech') {
      document.getElementById('productTitleInput').value = 'Smartwatch Ultra Endurance GPS';
      document.getElementById('productVendorInput').value = 'ApexTech';
      document.getElementById('productTypeInput').value = 'Wearables & Deporte';
      document.getElementById('productPriceInput').value = '499.00';
      document.getElementById('productSkuInput').value = 'AT-ULTRA-TITANIUM';
      document.getElementById('productOptionsInput').value = 'Color: Titanio Natural, Negro Carbón | Talla: 49mm';

      createMetafieldRow('custom', 'water_resistance', 'single_line_text_field', '100m Sumergible (ISO 22810)');
      createMetafieldRow('custom', 'battery_life_days', 'number_integer', '14');
      createMetafieldRow('custom', 'accent_color', 'color', '#f59e0b');
      createMetafieldRow('custom', 'spec_sheet_pdf', 'file_reference', 'https://cdn.shopify.com/s/files/manual-ultra-gps.pdf');
      createMetafieldRow('custom', 'warranty_plan', 'metaobject_reference', 'Garantía Titanio: 3 años de reemplazo total en fallas de batería y cristal de zafiro');
    } else if (type === 'fashion') {
      document.getElementById('productTitleInput').value = 'Campera Bomber Cuero Ecológico';
      document.getElementById('productVendorInput').value = 'Atelier Buenos Aires';
      document.getElementById('productTypeInput').value = 'Indumentaria de Autor';
      document.getElementById('productPriceInput').value = '220.00';
      document.getElementById('productSkuInput').value = 'BOMBER-ECO-01';
      document.getElementById('productOptionsInput').value = 'Talle: S, M, L, XL | Color: Marrón Vintage, Negro';

      createMetafieldRow('custom', 'eco_material_origin', 'single_line_text_field', '100% Cuero Vegetal de Nopal Sostenible');
      createMetafieldRow('custom', 'origin_country', 'single_line_text_field', 'Hecho a mano en Argentina');
      createMetafieldRow('custom', 'washing_guide', 'metaobject_reference', 'Cuidado de Prenda: No lavar en lavarropas. Limpieza en seco especializada con paño neutro.');
    }

    renderPDP();
  }

  if (presetTechBtn) {
    presetTechBtn.addEventListener('click', () => loadPreset('tech'));
  }
  if (presetFashionBtn) {
    presetFashionBtn.addEventListener('click', () => loadPreset('fashion'));
  }

  // Compile and Render PDP
  function renderPDP() {
    const title = document.getElementById('productTitleInput').value || 'Producto sin título';
    const vendor = document.getElementById('productVendorInput').value || 'Vendor Oficial';
    const type = document.getElementById('productTypeInput').value || 'General';
    const price = document.getElementById('productPriceInput').value || '0.00';
    const sku = document.getElementById('productSkuInput').value || 'SKU-000';
    const optionsRaw = document.getElementById('productOptionsInput').value || '';

    // Collect Metafields
    const metafieldCards = metafieldsContainer.querySelectorAll('.metafield-item-card');
    const metafieldsList = [];
    let liquidSnippetLines = [];
    let jsonSchemaObj = {
      product: {
        title,
        vendor,
        product_type: type,
        variants: [{ sku, price }]
      },
      metafields: []
    };

    liquidSnippetLines.push(`{% comment %} Renderizado dinámico de Metafields para ${title} {% endcomment %}`);

    metafieldCards.forEach(card => {
      const ns = card.querySelector('.mf-namespace').value.trim();
      const key = card.querySelector('.mf-key').value.trim();
      const mfType = card.querySelector('.mf-type').value;
      const val = card.querySelector('.mf-value').value.trim();

      if (key && val) {
        metafieldsList.push({ namespace: ns, key, type: mfType, value: val });
        jsonSchemaObj.metafields.push({ namespace: ns, key, type: mfType, value: val });

        // Build Liquid representation
        liquidSnippetLines.push(`{% assign ${key} = product.metafields.${ns}.${key}.value %}`);
        liquidSnippetLines.push(`{% if ${key} != blank %}`);
        if (mfType === 'color') {
          liquidSnippetLines.push(`  <div class="color-indicator" style="background-color: {{ ${key} }};"></div>`);
        } else if (mfType === 'file_reference') {
          liquidSnippetLines.push(`  <a href="{{ ${key}.url }}" class="spec-file-download">Descargar Archivo</a>`);
        } else {
          liquidSnippetLines.push(`  <p><strong>${key | capitalize}:</strong> {{ ${key} }}</p>`);
        }
        liquidSnippetLines.push(`{% endif %}`);
      }
    });

    // Render HTML in PDP Simulator
    let optionsHtml = '';
    if (optionsRaw) {
      const parts = optionsRaw.split('|');
      optionsHtml = parts.map(p => `<span style="display:inline-block; font-size:0.75rem; background:#f3f4f6; color:#374151; padding:0.25rem 0.6rem; border-radius:4px; font-weight:600; margin-right:0.4rem; margin-bottom:0.4rem;">${p.trim()}</span>`).join('');
    }

    let metafieldsHtml = '';
    if (metafieldsList.length === 0) {
      metafieldsHtml = `
        <div style="background: #fdf2f8; border: 1px dashed #f43f5e; border-radius: 8px; padding: 1rem; text-align: center; color: #be123c; font-size: 0.85rem;">
          No hay Metafields asignados todavía. Agrega campos arriba o usa un preset.
        </div>
      `;
    } else {
      metafieldsHtml = metafieldsList.map(mf => {
        let valDisplay = mf.value;
        if (mf.type === 'color') {
          valDisplay = `
            <div class="color-swatch-badge">
              <span class="color-dot" style="background: ${mf.value}"></span>
              <span>${mf.value}</span>
            </div>
          `;
        } else if (mf.type === 'file_reference') {
          valDisplay = `
            <a href="${mf.value}" target="_blank" style="color: #0284c7; text-decoration: underline; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
              📎 ${mf.value}
            </a>
          `;
        } else if (mf.type === 'metaobject_reference') {
          valDisplay = `
            <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 0.5rem 0.75rem; border-radius: 4px; color: #065f46; font-size: 0.85rem;">
              <strong>Metaobject Vinculado:</strong> ${mf.value}
            </div>
          `;
        }

        return `
          <div class="pdp-metafield-card">
            <span class="pdp-meta-label">${mf.namespace}.${mf.key} <span style="font-size: 0.65rem; background: #e5e7eb; padding: 0.1rem 0.3rem; border-radius: 3px; color: #374151;">${mf.type}</span></span>
            <div class="pdp-meta-val">${valDisplay}</div>
          </div>
        `;
      }).join('');
    }

    pdpOutputScreen.innerHTML = `
      <div class="pdp-store-header">
        <span class="pdp-vendor">${vendor} • ${type}</span>
        <span class="pdp-sku-badge">SKU: ${sku}</span>
      </div>
      <h2 class="pdp-title">${title}</h2>
      <div class="pdp-price-row">
        <span class="pdp-price">$${price} USD</span>
        <span style="color: #059669; font-size: 0.8rem; font-weight: 700;">✓ En Stock</span>
      </div>

      ${optionsHtml ? `<div style="margin-bottom: 1.25rem;">${optionsHtml}</div>` : ''}

      <button style="width: 100%; background: #111827; color: #fff; border: none; padding: 0.85rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; margin-bottom: 1.5rem; cursor: pointer;">
        Agregar al Carrito • $${price} USD
      </button>

      <div class="pdp-metafields-wrapper">
        <div class="pdp-meta-heading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #059669;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Campos Personalizados (Metafields & Metaobjects)</span>
        </div>
        ${metafieldsHtml}
      </div>
    `;

    // Update Liquid Code Tab
    if (liquidCodeOutput) {
      liquidCodeOutput.textContent = liquidSnippetLines.join('\n');
      if (window.Prism) {
        Prism.highlightElement(liquidCodeOutput);
      }
    }

    // Update JSON Schema Tab
    if (jsonSchemaOutput) {
      jsonSchemaOutput.textContent = JSON.stringify(jsonSchemaObj, null, 2);
      if (window.Prism) {
        Prism.highlightElement(jsonSchemaOutput);
      }
    }
  }

  if (labForm) {
    labForm.addEventListener('submit', (e) => {
      e.preventDefault();
      renderPDP();
    });
  }

  // Initial preset load
  loadPreset('tech');
});
