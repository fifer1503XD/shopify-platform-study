/**
 * Interactive Casio Store Clone Simulator Logic
 * Powers the real-time simulation of casiobytimesquare.co in Module 11.
 */

document.addEventListener('DOMContentLoaded', () => {
  const casioProducts = [
    {
      id: 'ga-2100-1a1',
      brand: 'gshock',
      brandLabel: 'G-SHOCK',
      title: 'G-Shock GA-2100-1A1 "CasiOak" All Black',
      price: 689000,
      comparePrice: 750000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      badge: 'Bestseller',
      badgeColor: '#dc2626',
      specs: 'Carbon Core Guard • 200M Water Resist • Luz LED Doble'
    },
    {
      id: 'a168wa-1w',
      brand: 'vintage',
      brandLabel: 'CASIO VINTAGE',
      title: 'Casio Vintage A168WA-1W Retro Silver ElectroLuminescence',
      price: 290000,
      comparePrice: null,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      badge: 'Clásico Retro',
      badgeColor: '#0284c7',
      specs: 'Luz Illuminator • Cronómetro 1/100s • Alarma Diaria'
    },
    {
      id: 'a168wg-9w',
      brand: 'vintage',
      brandLabel: 'CASIO VINTAGE',
      title: 'Casio Vintage Iconic A168WG-9W Gold Edition',
      price: 365000,
      comparePrice: 410000,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
      badge: 'Oferta',
      badgeColor: '#fc6229',
      specs: 'Baño de Oro Iónico • Resistencia al Agua • Calendario Automático'
    },
    {
      id: 'efv-550d',
      brand: 'edifice',
      brandLabel: 'EDIFICE',
      title: 'Edifice Chronograph EFV-550D Acero Inoxidable Esfera Azul',
      price: 780000,
      comparePrice: 890000,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
      badge: 'Chronograph',
      badgeColor: '#03164c',
      specs: '100M Water Resist • Cronómetro de 1/10 Seg • Cristal Mineral'
    },
    {
      id: 'bgd-565-1',
      brand: 'babyg',
      brandLabel: 'BABY-G',
      title: 'Baby-G BGD-565-1 Compact Shock Resistant Negro Mate',
      price: 490000,
      comparePrice: null,
      image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80',
      badge: 'Nuevo',
      badgeColor: '#10b981',
      specs: 'Diseño Compacto • Resistencia a Impactos • 100M Water Resist'
    },
    {
      id: 'dw-5600ue',
      brand: 'gshock',
      brandLabel: 'G-SHOCK',
      title: 'G-Shock Cuadrado Clásico DW-5600UE-1 Original 1983',
      price: 520000,
      comparePrice: 580000,
      image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80',
      badge: 'Icono G-Shock',
      badgeColor: '#dc2626',
      specs: 'Estructura Antichoque Legendaria • 20 BAR • Temporizador'
    }
  ];

  const productGrid = document.getElementById('casioProductGrid');
  const navLinks = document.querySelectorAll('[data-casio-filter]');
  const desktopViewBtn = document.getElementById('casioViewDesktopBtn');
  const mobileViewBtn = document.getElementById('casioViewMobileBtn');
  const simulatorFrame = document.getElementById('casioSimulatorFrame');

  let activeBrandFilter = 'all';

  function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO') + ' COP';
  }

  function renderCasioGrid() {
    if (!productGrid) return;

    const filtered = casioProducts.filter(p => {
      if (activeBrandFilter === 'all') return true;
      return p.brand === activeBrandFilter;
    });

    productGrid.innerHTML = filtered.map(item => `
      <div class="casio-product-card">
        <div class="casio-card-img-box">
          <span class="casio-card-badge" style="background: ${item.badgeColor};">${item.badge}</span>
          <img src="${item.image}" alt="${item.title}" class="casio-card-img" loading="lazy">
          <button type="button" class="casio-quick-add-btn" onclick="alert('🛍️ ¡Añadido al Carrito!\\n\\n${item.title}\\nPrecio: ${formatCOP(item.price)}')">
            + Agregar al Carrito
          </button>
        </div>
        <div class="casio-card-info">
          <span class="casio-card-brand">${item.brandLabel}</span>
          <h4 class="casio-card-title">${item.title}</h4>
          <div class="casio-card-specs">${item.specs}</div>
          <div class="casio-card-pricing">
            <span class="casio-price-now">${formatCOP(item.price)}</span>
            ${item.comparePrice ? `<s class="casio-price-old">${formatCOP(item.comparePrice)}</s>` : ''}
          </div>
          <div class="casio-card-shipping">🚚 Envío Gratis en Colombia</div>
        </div>
      </div>
    `).join('');
  }

  // Filter navigation
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      activeBrandFilter = link.getAttribute('data-casio-filter');
      renderCasioGrid();
    });
  });

  // Responsive switchers
  if (desktopViewBtn && mobileViewBtn && simulatorFrame) {
    desktopViewBtn.addEventListener('click', () => {
      desktopViewBtn.classList.add('active');
      mobileViewBtn.classList.remove('active');
      simulatorFrame.classList.remove('mobile-preview-frame');
    });

    mobileViewBtn.addEventListener('click', () => {
      mobileViewBtn.classList.add('active');
      desktopViewBtn.classList.remove('active');
      simulatorFrame.classList.add('mobile-preview-frame');
    });
  }

  // Initial render
  renderCasioGrid();
});
