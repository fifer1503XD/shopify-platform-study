/**
 * Interactive PLP (Product Listing Page) Laboratory Engine
 * Handles Collection Grid, Filtering by Facets/Metafields, Sorting, Pagination,
 * View Switching (Grid 3/4, List), and Dynamic Liquid Code Generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Default Sample Catalog Items
  const defaultCatalog = [
    {
      id: 'prod-001',
      title: 'Smartwatch Ultra Endurance GPS',
      vendor: 'ApexTech',
      productType: 'Wearables',
      price: 499.00,
      compareAtPrice: 549.00,
      tags: ['gps', 'sport', 'smartwatch', 'titanium'],
      inStock: true,
      featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      options: [
        { name: 'Color', values: ['Titanium Gray', 'Midnight Black', 'Ocean Blue'], colors: ['#64748b', '#0f172a', '#0284c7'] },
        { name: 'Banda', values: ['Silicona', 'Titanio'] }
      ],
      metafields: {
        sustainability_score: 'A+',
        material: 'Titanio Grado Aeroespacial',
        battery_life: '14 días'
      }
    },
    {
      id: 'prod-002',
      title: 'Chaqueta Impermeable StormShield Eco',
      vendor: 'Lily Designs',
      productType: 'Apparel',
      price: 185.00,
      compareAtPrice: null,
      tags: ['nuevo', 'apparel', 'waterproof', 'eco-friendly'],
      inStock: true,
      featuredImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
      options: [
        { name: 'Color', values: ['Forest Green', 'Dark Mustard', 'Shadow Black'], colors: ['#14532d', '#b45309', '#18181b'] },
        { name: 'Talla', values: ['S', 'M', 'L', 'XL'] }
      ],
      metafields: {
        sustainability_score: 'A++',
        material: '100% Poliéster Reciclado',
        waterproof_rating: '20,000 mm'
      }
    },
    {
      id: 'prod-003',
      title: 'Sneakers Urban Flow ZeroGravity',
      vendor: 'Lily Designs',
      productType: 'Calzado',
      price: 140.00,
      compareAtPrice: 175.00,
      tags: ['sneakers', 'calzado', 'running', 'sale'],
      inStock: true,
      featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      options: [
        { name: 'Color', values: ['Rojo Carmesí', 'Blanco Puro', 'Negro Mate'], colors: ['#dc2626', '#f8fafc', '#111827'] },
        { name: 'Talla', values: ['40', '41', '42', '43', '44'] }
      ],
      metafields: {
        sustainability_score: 'B+',
        material: 'Espuma EVA Biológica & Malla Transpirable',
        cushion_tech: 'ZeroGravity Cushioning'
      }
    },
    {
      id: 'prod-004',
      title: 'Auriculares Pro ANC Noise Cancelling',
      vendor: 'ApexTech',
      productType: 'Wearables',
      price: 299.00,
      compareAtPrice: 329.00,
      tags: ['audio', 'wearables', 'bluetooth', 'anc'],
      inStock: true,
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      options: [
        { name: 'Color', values: ['Plata Mate', 'Negro Carbón'], colors: ['#94a3b8', '#18181b'] }
      ],
      metafields: {
        sustainability_score: 'A',
        material: 'Aluminio Anodizado & Cuero Vegano',
        anc_db: '-38dB Reducción Activa'
      }
    },
    {
      id: 'prod-005',
      title: 'Camiseta Algodón Pima Orgánico',
      vendor: 'Stylish Stitches',
      productType: 'Apparel',
      price: 45.00,
      compareAtPrice: null,
      tags: ['nuevo', 'apparel', 'eco-friendly', 'basicos'],
      inStock: true,
      featuredImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      options: [
        { name: 'Color', values: ['Blanco Crudo', 'Verde Oliva', 'Gris Ceniza'], colors: ['#f5f5f4', '#3f6212', '#71717a'] },
        { name: 'Talla', values: ['XS', 'S', 'M', 'L', 'XL'] }
      ],
      metafields: {
        sustainability_score: 'A++',
        material: '100% Algodón Pima Orgánico Certificado GOTS',
        weight: '220 GSM'
      }
    },
    {
      id: 'prod-006',
      title: 'Pantalón Chino Comfort Stretch',
      vendor: 'Stylish Stitches',
      productType: 'Apparel',
      price: 95.00,
      compareAtPrice: 120.00,
      tags: ['apparel', 'pantalones', 'sale'],
      inStock: false,
      featuredImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
      options: [
        { name: 'Color', values: ['Azul Marino', 'Arena Khaki', 'Negro'], colors: ['#1e3a8a', '#d4b996', '#18181b'] },
        { name: 'Talla', values: ['30', '32', '34', '36'] }
      ],
      metafields: {
        sustainability_score: 'B',
        material: '98% Algodón, 2% Elastano',
        fit: 'Slim Tapered'
      }
    }
  ];

  let currentCatalog = [...defaultCatalog];

  // DOM Elements
  const productGrid = document.getElementById('plpProductGrid');
  const resultsCountText = document.getElementById('plpResultsCount');
  const searchInput = document.getElementById('plpSearchInput');
  const sortSelect = document.getElementById('plpSortSelect');
  const priceMinInput = document.getElementById('plpPriceMin');
  const priceMaxInput = document.getElementById('plpPriceMax');
  const filterEcoCheckbox = document.getElementById('plpFilterEco');
  const filterDiscountCheckbox = document.getElementById('plpFilterDiscount');
  const filterInStockCheckbox = document.getElementById('plpFilterInStock');
  const resetFiltersBtn = document.getElementById('plpResetFiltersBtn');
  const activeFacetsContainer = document.getElementById('plpActiveFacets');
  
  // Presets
  const presetAllBtn = document.getElementById('plpPresetAll');
  const presetTechBtn = document.getElementById('plpPresetTech');
  const presetEcoBtn = document.getElementById('plpPresetEco');
  const syncCreatedBtn = document.getElementById('plpSyncCreatedBtn');

  // View switchers
  const viewButtons = document.querySelectorAll('.plp-view-btn');

  // Tab Panes
  const plpTabBtns = document.querySelectorAll('[data-plp-tab]');
  const plpTabPanes = {
    storefront: document.getElementById('plpTabStorefront'),
    liquid: document.getElementById('plpTabLiquid'),
    graphql: document.getElementById('plpTabGraphql')
  };

  plpTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      plpTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-plp-tab');
      Object.keys(plpTabPanes).forEach(key => {
        if (plpTabPanes[key]) {
          plpTabPanes[key].style.display = (key === target) ? 'block' : 'none';
        }
      });
    });
  });

  // Handle View Mode (Grid 3, Grid 4, List)
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const viewMode = btn.getAttribute('data-view');
      if (productGrid) {
        productGrid.className = `plp-product-grid ${viewMode}`;
      }
    });
  });

  // Filter & Render Logic
  function getFilteredAndSortedProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const minPrice = priceMinInput ? parseFloat(priceMinInput.value) || 0 : 0;
    const maxPrice = priceMaxInput ? parseFloat(priceMaxInput.value) || 999999 : 999999;
    const onlyEco = filterEcoCheckbox ? filterEcoCheckbox.checked : false;
    const onlyDiscount = filterDiscountCheckbox ? filterDiscountCheckbox.checked : false;
    const onlyInStock = filterInStockCheckbox ? filterInStockCheckbox.checked : false;

    // Checked Categories
    const checkedCategories = Array.from(document.querySelectorAll('.plp-cat-filter:checked')).map(cb => cb.value);

    let filtered = currentCatalog.filter(product => {
      // Search text filter
      if (query) {
        const matchTitle = product.title.toLowerCase().includes(query);
        const matchVendor = product.vendor.toLowerCase().includes(query);
        const matchTags = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchVendor && !matchTags) return false;
      }

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) return false;

      // Category filter
      if (checkedCategories.length > 0 && !checkedCategories.includes(product.productType)) {
        return false;
      }

      // Eco metafield filter
      if (onlyEco) {
        const isEcoTag = product.tags.includes('eco-friendly');
        const hasEcoMeta = product.metafields && product.metafields.sustainability_score && product.metafields.sustainability_score.startsWith('A');
        if (!isEcoTag && !hasEcoMeta) return false;
      }

      // Discount filter
      if (onlyDiscount) {
        if (!product.compareAtPrice || product.compareAtPrice <= product.price) return false;
      }

      // In stock filter
      if (onlyInStock && !product.inStock) return false;

      return true;
    });

    // Sort Logic
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'eco-high') {
      filtered.sort((a, b) => {
        const scoreA = (a.metafields && a.metafields.sustainability_score) ? a.metafields.sustainability_score : 'Z';
        const scoreB = (b.metafields && b.metafields.sustainability_score) ? b.metafields.sustainability_score : 'Z';
        return scoreA.localeCompare(scoreB);
      });
    }

    return filtered;
  }

  function renderGrid() {
    if (!productGrid) return;

    const products = getFilteredAndSortedProducts();

    // Update Counter
    if (resultsCountText) {
      resultsCountText.textContent = `Mostrando ${products.length} producto${products.length === 1 ? '' : 's'}`;
    }

    // Render Active Filters Chips
    renderActiveFilterChips();

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div class="plp-no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); margin-bottom: 0.75rem;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h4 style="color: var(--text-primary); margin: 0 0 0.5rem 0;">No se encontraron productos coincidentes</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 1rem 0;">Prueba relajando los filtros de precio, tipo o buscando otro término.</p>
          <button type="button" class="preset-btn" onclick="document.getElementById('plpResetFiltersBtn').click()">Restablecer Filtros</button>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = products.map(p => {
      // Badges
      let badgeHtml = '';
      if (p.compareAtPrice && p.compareAtPrice > p.price) {
        const discountPct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
        badgeHtml = `<span class="plp-badge plp-badge-sale">-${discountPct}% SALE</span>`;
      } else if (p.tags.includes('nuevo')) {
        badgeHtml = `<span class="plp-badge plp-badge-new">NUEVO</span>`;
      }

      // Swatches
      let swatchesHtml = '';
      const colorOption = p.options ? p.options.find(o => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') : null;
      if (colorOption && colorOption.colors && colorOption.colors.length > 0) {
        swatchesHtml = `
          <div class="plp-card-swatches">
            ${colorOption.colors.map((hex, idx) => `
              <span class="plp-swatch-dot ${idx === 0 ? 'active' : ''}" style="background-color: ${hex};" title="${colorOption.values[idx] || 'Color'}"></span>
            `).join('')}
          </div>
        `;
      }

      // Metafields chips
      let metafieldsChipsHtml = '';
      if (p.metafields) {
        if (p.metafields.sustainability_score) {
          metafieldsChipsHtml += `
            <span class="plp-meta-chip eco">
              🌿 Eco: ${p.metafields.sustainability_score}
            </span>
          `;
        }
        if (p.metafields.material) {
          metafieldsChipsHtml += `
            <span class="plp-meta-chip mat" title="${p.metafields.material}">
              🧵 ${p.metafields.material.length > 22 ? p.metafields.material.substring(0, 20) + '...' : p.metafields.material}
            </span>
          `;
        }
      }

      return `
        <div class="plp-card" data-product-id="${p.id}">
          <div class="plp-card-img-wrapper">
            ${badgeHtml}
            <img src="${p.featuredImage}" alt="${p.title}" class="plp-card-img" loading="lazy">
            <button type="button" class="plp-quick-view-btn" onclick="alert('⚡ Vista Rápida Liquid\\n\\nProducto: ${p.title}\\nSKU: ${p.id}\\nPrecio: $${p.price.toFixed(2)} USD')">
              Vista Rápida
            </button>
          </div>

          <div class="plp-card-body">
            <div class="plp-card-header-row">
              <span class="plp-card-vendor">${p.vendor}</span>
              <span class="plp-card-type">${p.productType}</span>
            </div>

            <h4 class="plp-card-title">${p.title}</h4>

            ${metafieldsChipsHtml ? `<div class="plp-card-meta-row">${metafieldsChipsHtml}</div>` : ''}

            <div class="plp-card-price-row">
              <div>
                <span class="plp-price-current">$${p.price.toFixed(2)}</span>
                ${p.compareAtPrice ? `<s class="plp-price-compare">$${p.compareAtPrice.toFixed(2)}</s>` : ''}
              </div>
              <span class="plp-stock-indicator ${p.inStock ? 'in-stock' : 'out-stock'}">
                ${p.inStock ? '✓ Stock' : '✕ Agotado'}
              </span>
            </div>

            ${swatchesHtml}
          </div>
        </div>
      `;
    }).join('');

    // Attach swatch click events
    productGrid.querySelectorAll('.plp-swatch-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const parent = dot.closest('.plp-card-swatches');
        parent.querySelectorAll('.plp-swatch-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });
  }

  function renderActiveFilterChips() {
    if (!activeFacetsContainer) return;

    const chips = [];
    const query = searchInput ? searchInput.value.trim() : '';
    if (query) {
      chips.push({ label: `Búsqueda: "${query}"`, onRemove: () => { searchInput.value = ''; renderGrid(); } });
    }

    const checkedCats = document.querySelectorAll('.plp-cat-filter:checked');
    checkedCats.forEach(cb => {
      chips.push({ label: `Tipo: ${cb.value}`, onRemove: () => { cb.checked = false; renderGrid(); } });
    });

    if (filterEcoCheckbox && filterEcoCheckbox.checked) {
      chips.push({ label: '🌿 Eco Sostenible', onRemove: () => { filterEcoCheckbox.checked = false; renderGrid(); } });
    }

    if (filterDiscountCheckbox && filterDiscountCheckbox.checked) {
      chips.push({ label: '🏷️ Con Oferta', onRemove: () => { filterDiscountCheckbox.checked = false; renderGrid(); } });
    }

    if (filterInStockCheckbox && !filterInStockCheckbox.checked) {
      chips.push({ label: 'Incluyendo Agotados', onRemove: () => { filterInStockCheckbox.checked = true; renderGrid(); } });
    }

    if (chips.length === 0) {
      activeFacetsContainer.innerHTML = '';
      return;
    }

    activeFacetsContainer.innerHTML = `
      <div class="active-chips-title">Filtros Activos:</div>
      <div class="active-chips-list">
        ${chips.map((c, i) => `
          <button type="button" class="facet-chip" data-chip-idx="${i}">
            ${c.label} <span>✕</span>
          </button>
        `).join('')}
      </div>
    `;

    activeFacetsContainer.querySelectorAll('.facet-chip').forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-chip-idx'));
      btn.addEventListener('click', () => {
        if (chips[idx] && chips[idx].onRemove) {
          chips[idx].onRemove();
        }
      });
    });
  }

  // Event Listeners for Filters
  if (searchInput) searchInput.addEventListener('input', renderGrid);
  if (sortSelect) sortSelect.addEventListener('change', renderGrid);
  if (priceMinInput) priceMinInput.addEventListener('input', renderGrid);
  if (priceMaxInput) priceMaxInput.addEventListener('input', renderGrid);
  if (filterEcoCheckbox) filterEcoCheckbox.addEventListener('change', renderGrid);
  if (filterDiscountCheckbox) filterDiscountCheckbox.addEventListener('change', renderGrid);
  if (filterInStockCheckbox) filterInStockCheckbox.addEventListener('change', renderGrid);

  document.querySelectorAll('.plp-cat-filter').forEach(cb => {
    cb.addEventListener('change', renderGrid);
  });

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (priceMinInput) priceMinInput.value = 0;
      if (priceMaxInput) priceMaxInput.value = 1000;
      if (filterEcoCheckbox) filterEcoCheckbox.checked = false;
      if (filterDiscountCheckbox) filterDiscountCheckbox.checked = false;
      if (filterInStockCheckbox) filterInStockCheckbox.checked = true;
      document.querySelectorAll('.plp-cat-filter').forEach(cb => cb.checked = false);
      if (sortSelect) sortSelect.value = 'featured';
      renderGrid();
    });
  }

  // Preset Handlers
  if (presetAllBtn) {
    presetAllBtn.addEventListener('click', () => {
      currentCatalog = [...defaultCatalog];
      resetFiltersBtn.click();
    });
  }

  if (presetTechBtn) {
    presetTechBtn.addEventListener('click', () => {
      if (resetFiltersBtn) resetFiltersBtn.click();
      document.querySelectorAll('.plp-cat-filter').forEach(cb => {
        cb.checked = (cb.value === 'Wearables');
      });
      renderGrid();
    });
  }

  if (presetEcoBtn) {
    presetEcoBtn.addEventListener('click', () => {
      if (resetFiltersBtn) resetFiltersBtn.click();
      if (filterEcoCheckbox) filterEcoCheckbox.checked = true;
      renderGrid();
    });
  }

  // Sync with Lab PDP Creator
  if (syncCreatedBtn) {
    syncCreatedBtn.addEventListener('click', () => {
      if (window.ShopifySandboxUserProducts && window.ShopifySandboxUserProducts.length > 0) {
        currentCatalog = [...window.ShopifySandboxUserProducts, ...defaultCatalog];
        alert(`✅ Se sincronizaron ${window.ShopifySandboxUserProducts.length} producto(s) creados en el Laboratorio Sandbox de PDP.`);
      } else {
        // Create an example user product if none created yet
        const createdMock = {
          id: 'prod-user-custom',
          title: document.getElementById('productTitleInput') ? document.getElementById('productTitleInput').value : 'Custom PDP Lab Product',
          vendor: document.getElementById('productVendorInput') ? document.getElementById('productVendorInput').value : 'Custom Studio',
          productType: document.getElementById('productTypeInput') ? document.getElementById('productTypeInput').value : 'Apparel',
          price: document.getElementById('productPriceInput') ? parseFloat(document.getElementById('productPriceInput').value) || 120.00 : 120.00,
          compareAtPrice: 150.00,
          tags: ['nuevo', 'custom-lab', 'eco-friendly'],
          inStock: true,
          featuredImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
          options: [{ name: 'Color', values: ['Verde Foresta', 'Negro'], colors: ['#16a34a', '#18181b'] }],
          metafields: {
            sustainability_score: 'A++',
            material: 'Lana Merino & Algodón Orgánico'
          }
        };
        currentCatalog = [createdMock, ...defaultCatalog];
        alert('✅ Se importó con éxito el producto activo configurado en el Laboratorio PDP.');
      }
      renderGrid();
    });
  }

  // Initial Render
  renderGrid();
});
