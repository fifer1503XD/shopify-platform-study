/**
 * Theme Component Inspector Logic
 * Powers the interactive file tree and architecture explorer in Module 10.
 */

document.addEventListener('DOMContentLoaded', () => {
  const fileData = {
    'theme.liquid': {
      type: 'Layout Container',
      typeBadgeColor: 'rgba(139, 92, 246, 0.2)',
      typeTextColor: '#c084fc',
      path: 'layout/theme.liquid',
      status: '✓ Theme Check: Valid',
      statusColor: '#10b981',
      desc: 'Es el documento HTML raíz maestro de toda la tienda. Define la estructura HTML5 global (<head>, <body>), carga tipografías, variables CSS, analytics y scripts principales, e inyecta dinámicamente las secciones de cada página.',
      tags: [
        '{{ content_for_header }} (Inyección obligatoria de metadatos del core y apps)',
        '{{ content_for_layout }} (Inyección del template activo de la ruta actual)',
        '{% sections \'header-group\' %} (Grupo de secciones globales fijas en cabecera)'
      ],
      callers: 'Shopify Core Server Router (Directo en cada petición HTTP)',
      children: 'sections/header.liquid, sections/footer.liquid, templates/*.json',
      codeTitle: 'Estructura típica de layout/theme.liquid',
      code: `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ page_title }}</title>

    {{ content_for_header }}

    {{ 'base.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
  </head>

  <body class="gradient">
    {% sections 'header-group' %}

    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    {% sections 'footer-group' %}
  </body>
</html>`
    },
    'password.liquid': {
      type: 'Layout Container',
      typeBadgeColor: 'rgba(139, 92, 246, 0.2)',
      typeTextColor: '#c084fc',
      path: 'layout/password.liquid',
      status: '✓ Theme Check: Valid',
      statusColor: '#10b981',
      desc: 'Plantilla de layout aislada utilizada cuando la tienda se encuentra protegida con contraseña ("Página en construcción" o modo preventa). No carga el header ni footer estándar.',
      tags: [
        '{{ content_for_header }} (Inyección de scripts)',
        '{{ content_for_layout }} (Carga templates/password.json)'
      ],
      callers: 'Shopify Core Router cuando la tienda está en modo Password Protected',
      children: 'sections/main-password-header.liquid, sections/main-password-content.liquid',
      codeTitle: 'layout/password.liquid',
      code: `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <title>{{ shop.name }} &bull; Próximamente</title>
    {{ content_for_header }}
  </head>
  <body class="password-page">
    {{ content_for_layout }}
  </body>
</html>`
    },
    'product.json': {
      type: 'JSON Template (OS 2.0)',
      typeBadgeColor: 'rgba(6, 182, 212, 0.2)',
      typeTextColor: '#38bdf8',
      path: 'templates/product.json',
      status: '✓ Schema Validated',
      statusColor: '#10b981',
      desc: 'Define el árbol jerárquico de secciones que componen la página de producto (PDP). Almacena el orden de los bloques internos de la sección principal (título, precio, selector de variantes, buy buttons, metafields) y las configuraciones elegidas en el Theme Editor.',
      tags: [
        '"sections": { "main": { "type": "main-product", "blocks": { ... } } }',
        '"order": ["main", "related-products", "product-reviews"]'
      ],
      callers: 'layout/theme.liquid vía {{ content_for_layout }} al visitar /products/{handle}',
      children: 'sections/main-product.liquid, sections/related-products.liquid',
      codeTitle: 'templates/product.json (Estructura OS 2.0)',
      code: `{
  "sections": {
    "main": {
      "type": "main-product",
      "blocks": {
        "vendor": { "type": "text", "settings": { "text": "{{ product.vendor }}" } },
        "title": { "type": "title" },
        "price": { "type": "price" },
        "variant_picker": { "type": "variant_picker" },
        "buy_buttons": { "type": "buy_buttons" }
      },
      "block_order": ["vendor", "title", "price", "variant_picker", "buy_buttons"]
    }
  },
  "order": ["main"]
}`
    },
    'collection.json': {
      type: 'JSON Template (OS 2.0)',
      typeBadgeColor: 'rgba(6, 182, 212, 0.2)',
      typeTextColor: '#38bdf8',
      path: 'templates/collection.json',
      status: '✓ Schema Validated',
      statusColor: '#10b981',
      desc: 'Plantilla de la página de colección (PLP). Orquesta el banner de colección, la barra de filtros y el grid de productos con paginación.',
      tags: [
        '"sections": { "banner": { ... }, "product-grid": { "type": "main-collection-product-grid" } }'
      ],
      callers: 'layout/theme.liquid al visitar /collections/{handle}',
      children: 'sections/main-collection-banner.liquid, sections/main-collection-product-grid.liquid',
      codeTitle: 'templates/collection.json',
      code: `{
  "sections": {
    "banner": { "type": "main-collection-banner" },
    "product-grid": {
      "type": "main-collection-product-grid",
      "settings": {
        "products_per_page": 16,
        "columns_desktop": 4,
        "enable_filtering": true,
        "enable_sorting": true
      }
    }
  },
  "order": ["banner", "product-grid"]
}`
    },
    'index.json': {
      type: 'JSON Template (OS 2.0)',
      typeBadgeColor: 'rgba(6, 182, 212, 0.2)',
      typeTextColor: '#38bdf8',
      path: 'templates/index.json',
      status: '✓ Schema Validated',
      statusColor: '#10b981',
      desc: 'Estructura dinámica de la página de inicio (Homepage). Permite a los merchants añadir, reordenar y configurar secciones como Banners Hero, Carruseles de Colección, Testimonios y Rich Text.',
      tags: [
        '"sections": { "hero_banner": { ... }, "featured_collection": { ... } }',
        '"order": ["hero_banner", "featured_collection"]'
      ],
      callers: 'layout/theme.liquid al visitar la ruta raíz /',
      children: 'sections/image-banner.liquid, sections/featured-collection.liquid',
      codeTitle: 'templates/index.json',
      code: `{
  "sections": {
    "image_banner": {
      "type": "image-banner",
      "settings": { "heading": "Bienvenido a la Tienda" }
    },
    "featured_collection": {
      "type": "featured-collection",
      "settings": { "collection": "destacados" }
    }
  },
  "order": ["image_banner", "featured_collection"]
}`
    },
    'header.liquid': {
      type: 'Section Component',
      typeBadgeColor: 'rgba(16, 185, 129, 0.2)',
      typeTextColor: '#34d399',
      path: 'sections/header.liquid',
      status: '✓ Schema Validated',
      statusColor: '#10b981',
      desc: 'Sección modular de encabezado global. Renderiza el logotipo de la marca, el menú de navegación multinivel (`linklists[section.settings.menu]`), la barra de búsqueda predictiva y el drawer/icono del carrito de compras.',
      tags: [
        '{% schema %} ... {% endschema %} (Configuración de menú, logo y sticky header)',
        '{% for link in linklists[section.settings.menu].links %} (Navegación)'
      ],
      callers: 'layout/theme.liquid vía {% sections \'header-group\' %}',
      children: 'snippets/icon-cart.liquid, snippets/icon-search.liquid',
      codeTitle: 'sections/header.liquid (Esquema y Markup)',
      code: `<header class="site-header">
  <a href="/" class="header-logo">{{ shop.name }}</a>
  <nav class="header-nav">
    {% for link in linklists[section.settings.menu].links %}
      <a href="{{ link.url }}">{{ link.title }}</a>
    {% endfor %}
  </nav>
</header>

{% schema %}
{
  "name": "Encabezado Global",
  "settings": [
    { "type": "link_list", "id": "menu", "label": "Menú Principal", "default": "main-menu" },
    { "type": "checkbox", "id": "enable_sticky_header", "label": "Encabezado Fijo", "default": true }
  ]
}
{% endschema %}`
    },
    'main-product.liquid': {
      type: 'Section Component',
      typeBadgeColor: 'rgba(16, 185, 129, 0.2)',
      typeTextColor: '#34d399',
      path: 'sections/main-product.liquid',
      status: '✓ Schema Validated',
      statusColor: '#10b981',
      desc: 'Sección principal de detalle de producto. Renderiza la galería multimedia de fotos/videos y realiza un bucle dinámico sobre `section.blocks` para mostrar cada elemento de la PDP en el orden definido por el merchant.',
      tags: [
        '{% for block in section.blocks %} (Renderizado dinámico de bloques de PDP)',
        '{% case block.type %} ... {% when \'price\' %} ... {% endcase %}'
      ],
      callers: 'templates/product.json',
      children: 'snippets/price.liquid, snippets/product-variant-picker.liquid, snippets/product-media-gallery.liquid',
      codeTitle: 'sections/main-product.liquid (Iteración de Bloques)',
      code: `<div class="product-grid">
  <div class="product-media-column">
    {% render 'product-media-gallery', product: product %}
  </div>

  <div class="product-info-column">
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'title' -%}
          <h1 class="product-title" {{ block.shopify_attributes }}>{{ product.title }}</h1>
        {%- when 'price' -%}
          {% render 'price', product: product %}
        {%- when 'buy_buttons' -%}
          {% render 'buy-buttons', product: product %}
      {%- endcase -%}
    {%- endfor -%}
  </div>
</div>`
    },
    'main-collection.liquid': {
      type: 'Section Component',
      typeBadgeColor: 'rgba(16, 185, 129, 0.2)',
      typeTextColor: '#34d399',
      path: 'sections/main-collection-product-grid.liquid',
      status: '✓ Schema Validated',
      statusColor: '#10b981',
      desc: 'Controla el listado paginado de productos y las facetas de búsqueda en la página de colección.',
      tags: [
        '{% paginate collection.products by section.settings.products_per_page %}',
        '{% render \'card-product\', card_product: product %}'
      ],
      callers: 'templates/collection.json',
      children: 'snippets/facets.liquid, snippets/card-product.liquid, snippets/pagination.liquid',
      codeTitle: 'sections/main-collection-product-grid.liquid',
      code: `{%- paginate collection.products by section.settings.products_per_page -%}
  <div class="collection-page">
    {% render 'facets', results: collection %}
    <ul class="product-grid">
      {%- for product in collection.products -%}
        <li>{% render 'card-product', card_product: product %}</li>
      {%- endfor -%}
    </ul>
    {% render 'pagination', paginate: paginate %}
  </div>
{%- endpaginate -%}`
    },
    'card-product.liquid': {
      type: 'Snippet (Atomic Partial)',
      typeBadgeColor: 'rgba(234, 179, 8, 0.2)',
      typeTextColor: '#facc15',
      path: 'snippets/card-product.liquid',
      status: '✓ Pure Component (Isolated Scope)',
      statusColor: '#10b981',
      desc: 'Snippet atómico reutilizable. Renderiza la imagen principal con lazy loading, badges de oferta o nuevo, títulos, precios formateados con `money`, swatches de variantes y metafields de catálogo. Se usa en colecciones, recomendaciones, carruseles de la home y resultados de búsqueda.',
      tags: [
        '{{ card_product.featured_image | image_url: width: 600 }}',
        '{{ card_product.price | money }}',
        '{{ card_product.metafields.custom.sustainability_score.value }}'
      ],
      callers: 'sections/main-collection-product-grid.liquid, sections/featured-collection.liquid',
      children: 'snippets/price.liquid (Opcional)',
      codeTitle: 'snippets/card-product.liquid',
      code: `<div class="card-product">
  <img src="{{ card_product.featured_image | image_url: width: 500 }}" loading="lazy" alt="{{ card_product.title }}">
  <h3><a href="{{ card_product.url }}">{{ card_product.title }}</a></h3>
  <div class="price">{{ card_product.price | money }}</div>
</div>`
    },
    'facets.liquid': {
      type: 'Snippet (Filtering System)',
      typeBadgeColor: 'rgba(234, 179, 8, 0.2)',
      typeTextColor: '#facc15',
      path: 'snippets/facets.liquid',
      status: '✓ Search & Discovery Compatible',
      statusColor: '#10b981',
      desc: 'Snippet responsable de renderizar el formulario interactivo de filtros nativos mediante `collection.filters` o `search.filters`.',
      tags: [
        '{% for filter in results.filters %}',
        '{% case filter.type %} ... {% when \'price_range\' %}'
      ],
      callers: 'sections/main-collection-product-grid.liquid, sections/main-search.liquid',
      children: 'snippets/icon-caret.liquid',
      codeTitle: 'snippets/facets.liquid (Bucle de Filtros Nativos)',
      code: `<form id="FacetFiltersForm">
  {% for filter in results.filters %}
    <details class="facet-group">
      <summary>{{ filter.label }}</summary>
      {% for value in filter.values %}
        <label>
          <input type="checkbox" name="{{ value.param_name }}" value="{{ value.value }}" {% if value.active %}checked{% endif %}>
          {{ value.label }} ({{ value.count }})
        </label>
      {% endfor %}
    </details>
  {% endfor %}
</form>`
    },
    'price.liquid': {
      type: 'Snippet (Micro Component)',
      typeBadgeColor: 'rgba(234, 179, 8, 0.2)',
      typeTextColor: '#facc15',
      path: 'snippets/price.liquid',
      status: '✓ Optimized',
      statusColor: '#10b981',
      desc: 'Snippet micro-atómico para renderizar precios regulares, precios de comparación tachados (`compare_at_price`), rangos de precio en variantes y badges de descuento.',
      tags: [
        '{{ product.price | money }}',
        '{{ product.compare_at_price | money }}'
      ],
      callers: 'snippets/card-product.liquid, sections/main-product.liquid',
      children: 'Ninguno (Hoja terminal del árbol de dependencias)',
      codeTitle: 'snippets/price.liquid',
      code: `<div class="price-container">
  <span class="price-regular">{{ product.price | money }}</span>
  {% if product.compare_at_price > product.price %}
    <s class="price-compare">{{ product.compare_at_price | money }}</s>
    <span class="badge-sale">Oferta</span>
  {% endif %}
</div>`
    },
    'settings_schema.json': {
      type: 'Theme Configuration Schema',
      typeBadgeColor: 'rgba(244, 63, 94, 0.2)',
      typeTextColor: '#fb7185',
      path: 'config/settings_schema.json',
      status: '✓ Global Settings Spec',
      statusColor: '#10b981',
      desc: 'Define las secciones globales de configuración del Theme Editor (Pestaña "Ajustes del Tema"): esquemas de colores (Color Schemes), tipografías de Google Fonts / Shopify Fonts, radios de borde, íconos de redes sociales y favicon.',
      tags: [
        '[ { "name": "theme_info" }, { "name": "Colors", "settings": [ ... ] } ]'
      ],
      callers: 'Shopify Admin Theme Editor',
      children: 'Genera las variables en config/settings_data.json consumibles con {{ settings.primary_color }}',
      codeTitle: 'config/settings_schema.json (Esquema de Ajustes Globales)',
      code: `[
  {
    "name": "theme_info",
    "theme_name": "Dawn Enterprise",
    "theme_version": "15.0.0",
    "theme_author": "Shopify Devs"
  },
  {
    "name": "Colores de Marca",
    "settings": [
      { "type": "color", "id": "brand_primary", "label": "Color Primario", "default": "#008060" },
      { "type": "color", "id": "brand_accent", "label": "Color de Acento", "default": "#10b981" }
    ]
  }
]`
    },
    'settings_data.json': {
      type: 'Theme Persisted Settings',
      typeBadgeColor: 'rgba(244, 63, 94, 0.2)',
      typeTextColor: '#fb7185',
      path: 'config/settings_data.json',
      status: '✓ Store Specific Values',
      statusColor: '#10b981',
      desc: 'Archivo donde Shopify guarda los valores reales elegidos por el comerciante en el editor de temas (tanto para el modo actual "current" como para los presets del tema).',
      tags: [
        '{ "current": { "brand_primary": "#008060", "sections": { ... } } }'
      ],
      callers: 'Shopify Admin Theme Editor (Escritura automática)',
      children: 'Consumido en Liquid mediante {{ settings.setting_id }}',
      codeTitle: 'config/settings_data.json',
      code: `{
  "current": {
    "brand_primary": "#008060",
    "brand_accent": "#10b981",
    "social_instagram_link": "https://instagram.com/shopify"
  }
}`
    }
  };

  // DOM Elements
  const treeBtns = document.querySelectorAll('.tree-file-btn');
  const inspectFileName = document.getElementById('inspectFileName');
  const inspectFileTypeBadge = document.getElementById('inspectFileTypeBadge');
  const inspectHealthStatus = document.getElementById('inspectHealthStatus');
  const inspectFileDesc = document.getElementById('inspectFileDesc');
  const inspectKeyTags = document.getElementById('inspectKeyTags');
  const inspectCallers = document.getElementById('inspectCallers');
  const inspectChildren = document.getElementById('inspectChildren');
  const inspectCodeTitle = document.getElementById('inspectCodeTitle');
  const inspectCodeBlock = document.getElementById('inspectCodeBlock');

  function updateInspector(key) {
    const data = fileData[key];
    if (!data) return;

    if (inspectFileName) inspectFileName.textContent = data.path;
    if (inspectFileTypeBadge) {
      inspectFileTypeBadge.textContent = data.type;
      inspectFileTypeBadge.style.background = data.typeBadgeColor;
      inspectFileTypeBadge.style.color = data.typeTextColor;
    }
    if (inspectHealthStatus) {
      inspectHealthStatus.textContent = data.status;
    }
    if (inspectFileDesc) inspectFileDesc.textContent = data.desc;
    if (inspectKeyTags) {
      inspectKeyTags.innerHTML = data.tags.map(t => `<div>• <code>${t}</code></div>`).join('');
    }
    if (inspectCallers) inspectCallers.textContent = data.callers;
    if (inspectChildren) inspectChildren.innerHTML = data.children;
    if (inspectCodeTitle) inspectCodeTitle.textContent = data.codeTitle;
    if (inspectCodeBlock) {
      inspectCodeBlock.textContent = data.code;
      if (window.Prism) {
        Prism.highlightElement(inspectCodeBlock);
      }
    }
  }

  treeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      treeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const fileKey = btn.getAttribute('data-file-key');
      updateInspector(fileKey);
    });
  });

  // Preset buttons
  const presetDawnBtn = document.getElementById('auditPresetDawn');
  const presetHorizonBtn = document.getElementById('auditPresetHorizon');

  if (presetDawnBtn) {
    presetDawnBtn.addEventListener('click', () => {
      const btn = document.querySelector('[data-file-key="main-product.liquid"]');
      if (btn) btn.click();
    });
  }

  if (presetHorizonBtn) {
    presetHorizonBtn.addEventListener('click', () => {
      const btn = document.querySelector('[data-file-key="collection.json"]');
      if (btn) btn.click();
    });
  }

  // Initial update
  updateInspector('theme.liquid');
});
