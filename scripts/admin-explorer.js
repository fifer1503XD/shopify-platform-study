/**
 * Interactive Shopify Admin Navigation Explorer
 * Powers the interactive sidebar explorer in Module 12.
 */

document.addEventListener('DOMContentLoaded', () => {
  const adminMenuData = {
    'home': {
      title: 'Home (Panel Principal & Insights)',
      path: '/admin',
      category: 'Dashboard & Command Center',
      categoryColor: '#38bdf8',
      desc: 'Es el centro de bienvenida del comerciante. Muestra un resumen en tiempo real de las ventas del día, el volumen de pedidos, las sesiones de visitantes y las tarjetas de acción prioritarias (Action Cards) como pedidos pendientes de envío o inventario agotado.',
      subsections: [
        '<strong>Activity Feed:</strong> Registro cronológico de ventas y eventos recientes de la tienda.',
        '<strong>Today\'s Insights:</strong> Métricas clave de rendimiento (Ventas totales, tasa de conversión, sesiones).',
        '<strong>Sidekick / AI Recommendations:</strong> Sugerencias impulsadas por inteligencia artificial para optimizar conversiones y precios.'
      ],
      apiEntities: 'ShopMetrics, ActionItems, Notifications',
      devRole: 'Monitorear la salud operativa de la tienda y verificar que los webhooks de pedidos no presenten retrasos.',
      codeTitle: 'GraphQL Query: Información general de la tienda (Shop Object)',
      code: `query GetShopOverview {
  shop {
    id
    name
    email
    myshopifyDomain
    primaryDomain {
      url
      host
    }
    plan {
      displayName
      partnerDevelopment
    }
    currencyCode
  }
}`
    },
    'orders': {
      title: 'Orders (Gestión de Pedidos & Logística)',
      path: '/admin/orders',
      category: 'Core Operations',
      categoryColor: '#34d399',
      desc: 'El corazón de la operativa de e-commerce. Permite procesar el ciclo de vida completo de una venta: validar pagos, crear envíos (fulfillments) con números de rastreo de transportadoras, imprimir etiquetas de envío, editar líneas de productos de un pedido y emitir reembolsos.',
      subsections: [
        '<strong>All Orders:</strong> Listado con filtros avanzados (Financial status: Paid/Pending, Fulfillment: Unfulfilled/Fulfilled).',
        '<strong>Draft Orders:</strong> Creación manual de pedidos por parte del equipo de ventas (ventas telefónicas, cotizaciones B2B, facturación personalizada).',
        '<strong>Abandoned Checkouts:</strong> Sesiones donde el cliente ingresó sus datos pero no finalizó el pago (permite enviar correos automáticos de recuperación).'
      ],
      apiEntities: 'Order, DraftOrder, FulfillmentOrder, Refund, Transaction',
      devRole: 'Crear integraciones con sistemas ERP (SAP, Oracle), sistemas de gestión de almacén (WMS/3PL) y escuchar webhooks como orders/create y orders/fulfilled.',
      codeTitle: 'GraphQL Query: Listar pedidos recientes y su estado de cumplimiento',
      code: `query GetOrdersList {
  orders(first: 5, sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        id
        name
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
          email
        }
      }
    }
  }
}`
    },
    'products': {
      title: 'Products (Catálogo, Inventario & Colecciones)',
      path: '/admin/products',
      category: 'Catalog & Inventory',
      categoryColor: '#a78bfa',
      desc: 'Administración integral del catálogo de productos. Aquí se crean productos simples y configurables con variantes (Tallas, Colores), se definen precios, SKUs, códigos de barras (GTIN), pesos para cálculo de envío y se gestiona el inventario por ubicación física (Locations).',
      subsections: [
        '<strong>All Products:</strong> Catálogo maestro, subida de medios (fotos, videos 3D) y asignación de tags/metafields.',
        '<strong>Collections:</strong> Creación de Colecciones Manuales y Colecciones Automáticas (Smart Collections basadas en reglas).',
        '<strong>Inventory:</strong> Tabla matricial para ajustar existencias (On hand, Available, Committed) por sucursal o almacén.',
        '<strong>Purchase Orders & Transfers:</strong> Registro de pedidos a fabricantes y transferencias de stock entre bodegas.',
        '<strong>Gift Cards:</strong> Emisión de tarjetas de regalo digitales de valor nominal.'
      ],
      apiEntities: 'Product, ProductVariant, Collection, InventoryItem, InventoryLevel, Location',
      devRole: 'Sincronizar catálogos masivos vía Admin API GraphQL (`productCreate`, `inventoryAdjustQuantities`), configurar metafields de producto y programar scripts de importación.',
      codeTitle: 'GraphQL Mutation: Crear Producto con Variante e Inventario',
      code: `mutation CreateNewProduct {
  productCreate(input: {
    title: "Reloj Edición Especial Carbon",
    productType: "Relojes",
    vendor: "Casio",
    tags: ["nuevo", "edicion-limitada"],
    variants: [
      {
        price: "450.00",
        sku: "CASIO-CRB-01",
        barcode: "7701234567890"
      }
    ]
  }) {
    product {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}`
    },
    'customers': {
      title: 'Customers (Clientes, Segmentación & B2B)',
      path: '/admin/customers',
      category: 'CRM & Audience',
      categoryColor: '#f43f5e',
      desc: 'Gestión de la base de datos de usuarios. Permite ver el historial de compras de cada cliente, direcciones guardadas, estado de suscripción a email marketing, notas del equipo de soporte y la creación de empresas y ubicaciones para comercio B2B (en planes Shopify Plus).',
      subsections: [
        '<strong>All Customers:</strong> Ficha técnica individual de cada usuario con su LTV (Customer Lifetime Value) y número total de órdenes.',
        '<strong>Segments:</strong> Motor de segmentación dinámico mediante el <em>Customer Segment Query Language</em> (ej: `orders_count >= 3 AND total_spent > 500`).',
        '<strong>Companies (Shopify Plus):</strong> Estructuras corporativas para venta mayorista con catálogos y listas de precios exclusivas.'
      ],
      apiEntities: 'Customer, CustomerSegment, Company, CompanyLocation',
      devRole: 'Construir integraciones con CRMs externos (HubSpot, Salesforce, Klaviyo) y consumir la Customer Account API para portales de clientes personalizados.',
      codeTitle: 'GraphQL Query: Segmentación de Clientes por Gasto Total',
      code: `query GetHighValueCustomers {
  customerSegmentMembers(
    first: 10,
    query: "amount_spent > 500 AND number_of_orders >= 2"
  ) {
    edges {
      node {
        id
        displayName
        email
        amountSpent {
          amount
          currencyCode
        }
      }
    }
  }
}`
    },
    'growth': {
      title: 'Growth (Marketing, Campañas & Automatizaciones)',
      path: '/admin/marketing',
      category: 'Marketing & Acquisition',
      categoryColor: '#fb923c',
      desc: 'Sección orientada a la adquisición de tráfico y retención de compradores. Centraliza la creación de campañas de email marketing con Shopify Email, sincroniza catálogos con plataformas publicitarias (Google Shopping, Meta Ads, TikTok) y configura flujos de automatización de marketing.',
      subsections: [
        '<strong>Campaigns:</strong> Gestión de eventos de marketing, newsletters y lanzamientos de productos con seguimiento de ROAS.',
        '<strong>Automations:</strong> Flujos automáticos basados en eventos (ej: correo de bienvenida tras registro o email de recuperación de carrito).',
        '<strong>Attribution & Conversion:</strong> Reportes de atribución para saber qué canal o anuncio generó cada venta.'
      ],
      apiEntities: 'MarketingActivity, MarketingCampaign, MarketingEvent',
      devRole: 'Instalar píxeles de conversión con la Pixel API (Customer Events) e integrar APIs de marketing de terceros de forma asíncrona sin bloquear el DOM.',
      codeTitle: 'Liquid / Web Pixel API: Suscripción a Evento Checkout Completed',
      code: `// Web Pixels API (extensions/analytics-pixel.js)
analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  console.log('Compra completada:', checkout.order.id, checkout.totalPrice.amount);
  
  // Enviar a servidor de analítica o Pixel custom
  fetch('https://api.analytics-propia.com/track', {
    method: 'POST',
    body: JSON.stringify({
      orderId: checkout.order.id,
      revenue: checkout.totalPrice.amount,
      currency: checkout.currencyCode
    })
  });
});`
    },
    'discounts': {
      title: 'Discounts (Estrategias Promocionales & Functions)',
      path: '/admin/discounts',
      category: 'Promotions & Pricing',
      categoryColor: '#eab308',
      desc: 'Motor de ofertas y promociones de Shopify. Permite configurar códigos de cupón manuales o descuentos que se aplican automáticamente en el carrito al cumplir ciertas condiciones.',
      subsections: [
        '<strong>Amount off products:</strong> Descuento porcentual o fijo en productos o colecciones específicas.',
        '<strong>Amount off order:</strong> Descuento sobre el total de la orden al superar un monto mínimo.',
        '<strong>Buy X Get Y (BXGY):</strong> Promociones 2x1 o "lleva el segundo con 50% de descuento".',
        '<strong>Free Shipping:</strong> Envío gratis condicionado por país, peso o valor mínimo.',
        '<strong>App Discounts / Shopify Functions:</strong> Reglas lógicas complejas compiladas a WebAssembly ejecutadas en el checkout.'
      ],
      apiEntities: 'DiscountCodeNode, DiscountAutomaticNode, DiscountRedeemCode',
      devRole: 'Desarrollar extensiones backend de <strong>Shopify Functions</strong> (Rust/JavaScript) para reglas de descuento enterprise personalizadas sin latencia.',
      codeTitle: 'GraphQL Mutation: Crear Descuento Automático de 15%',
      code: `mutation CreateAutomaticDiscount {
  discountAutomaticBasicCreate(automaticBasicDiscount: {
    title: "15% OFF en Colección Vintage",
    startsAt: "2026-01-01T00:00:00Z",
    customerGets: {
      value: {
        percentage: 0.15
      },
      items: {
        collections: {
          add: ["gid://shopify/Collection/123456789"]
        }
      }
    },
    minimumRequirement: {
      subtotal: {
        greaterThanOrEqualToSubtotal: "100.00"
      }
    }
  }) {
    automaticDiscountNode {
      id
    }
    userErrors {
      field
      message
    }
  }
}`
    },
    'content': {
      title: 'Content (Metaobjects & Gestor de Archivos CDN)',
      path: '/admin/content',
      category: 'Data Architecture & CMS',
      categoryColor: '#10b981',
      desc: 'El pilar de extensión de datos de Shopify Online Store 2.0. En este menú se configuran las definiciones y los registros de los <strong>Metaobjects</strong> (estructuras de datos complejas como Diseñadores, FAQs, Guías de Tallas, Lookbooks) y se gestiona el repositorio de archivos multimedia (Files CDN).',
      subsections: [
        '<strong>Metaobjects:</strong> Creación de tipos de metaobjetos, adición de campos (texto, imágenes, referencias) y carga de entradas.',
        '<strong>Files:</strong> Subida y administración centralizada de imágenes, videos MP4, PDFs técnicos y archivos estáticos alojados en el CDN de Shopify.'
      ],
      apiEntities: 'Metaobject, MetaobjectDefinition, File, GenericFile, MediaImage',
      devRole: 'Modelar esquemas relacionales con Metaobjects, conectarlos a plantillas de tema con Dynamic Sources y consultar metaobjetos en Liquid (`shop.metaobjects.tipo.handle`).',
      codeTitle: 'Liquid: Renderizado de Metaobject en plantilla de tema',
      code: `{%- comment -%} Consumir Metaobject "brand_ambassador" en Liquid {%- endcomment -%}
{% assign ambassador = product.metafields.custom.ambassador.value %}

{% if ambassador != blank %}
  <div class="ambassador-badge">
    <img src="{{ ambassador.photo | image_url: width: 200 }}" alt="{{ ambassador.name }}">
    <h4>Diseñado por: {{ ambassador.name }}</h4>
    <p>{{ ambassador.biography }}</p>
  </div>
{% endif %}`
    },
    'markets': {
      title: 'Markets (Shopify Markets & Expansión Global)',
      path: '/admin/markets',
      category: 'International Commerce',
      categoryColor: '#06b6d4',
      desc: 'Herramienta de internacionalización que permite a un comerciante vender en múltiples países desde una única tienda. Permite definir monedas locales con conversión automática de divisas (FX), listas de precios diferenciadas por país, dominios o subcarpetas geográficas (ej: `tienda.com/es-co/`) y cálculo automático de aranceles e impuestos en checkout.',
      subsections: [
        '<strong>Primary Market:</strong> El país base de la tienda (ej: Colombia / COP).',
        '<strong>International Markets:</strong> Grupos de países con ajustes de precios porcentuales o fijación manual de listas de precios.',
        '<strong>Preferences:</strong> Enrutamiento automático por geolocalización IP y configuración de subcarpetas de idioma.'
      ],
      apiEntities: 'Market, MarketRegionCountry, PriceList, CurrencySetting',
      devRole: 'Diseñar selectores de país y moneda en Liquid con `localization.available_countries` y verificar la compatibilidad de Checkout Extensibility para cobros multidivisa.',
      codeTitle: 'Liquid: Selector de País y Moneda de Shopify Markets',
      code: `<div class="market-selector">
  {% form 'localization' %}
    <select name="country_code" onchange="this.form.submit()">
      {% for country in localization.available_countries %}
        <option value="{{ country.iso_code }}" 
          {% if country.iso_code == localization.country.iso_code %}selected{% endif %}>
          {{ country.name }} ({{ country.currency.iso_code }} {{ country.currency.symbol }})
        </option>
      {% endfor %}
    </select>
  {% endform %}
</div>`
    },
    'analytics': {
      title: 'Analytics (Dashboards, Reportes & Live View)',
      path: '/admin/analytics',
      category: 'Business Intelligence',
      categoryColor: '#8b5cf6',
      desc: 'Panel de control analítico con más de 60 reportes predefinidos. Proporciona visibilidad sobre métricas financieras, adquisición de clientes, retención de cohortes, velocidad del tema, productos más vendidos y un mapa interactivo 3D en vivo de visitantes.',
      subsections: [
        '<strong>Dashboards:</strong> Tarjetas con tendencias de Total Sales, Online store conversion rate, Average Order Value (AOV) y Total Orders.',
        '<strong>Reports:</strong> Informes auditables por finanzas (impuestos, pasarelas de pago), comportamiento y búsquedas en la tienda sin resultados.',
        '<strong>Live View:</strong> Mapa interactivo con sesiones activas, carritos en proceso y pedidos completados en tiempo real.'
      ],
      apiEntities: 'Shopify Reporting API, AnalyticsData',
      devRole: 'Auditar términos de búsqueda sin resultados para optimizar sinónimos en Search & Discovery y supervisar las métricas de Core Web Vitals en el reporte de velocidad.',
      codeTitle: 'Métricas clave rastreadas en Analytics',
      code: `// Métricas calculadas por el motor de Analytics de Shopify:
1. Online Store Sessions (Sesiones de visitantes únicos)
2. Conversion Rate = (Orders / Sessions) * 100
3. AOV (Average Order Value) = Total Revenue / Total Orders
4. Returning Customer Rate = (Returning Customers / Total Customers) * 100
5. Checkout Funnel: Added to Cart -> Reached Checkout -> Sessions Converted`
    },
    'online-store': {
      title: 'Online Store (Canal de Venta Web & Temas OS 2.0)',
      path: '/admin/themes',
      category: 'Storefront Engineering',
      categoryColor: '#ec4899',
      desc: 'El centro de desarrollo visual y de código del canal web. Permite gestionar temas (publicados e inéditos), acceder al editor de temas visual (Theme Editor) y editar directamente el código Liquid, JSON y CSS del tema activo.',
      subsections: [
        '<strong>Themes:</strong> Biblioteca de temas, vista previa de ramas, subida de archivos ZIP y botón "Edit code".',
        '<strong>Blog Posts:</strong> Publicación de artículos editoriales con tags, autores e imágenes destacadas.',
        '<strong>Pages:</strong> CMS para páginas institucionales (Sobre Nosotros, Contacto, Términos y Condiciones).',
        '<strong>Navigation:</strong> Creación de menús principales, menús desplegables multinivel y menús de pie de página.',
        '<strong>Preferences:</strong> Título SEO y metadescripción del Home, Google Analytics 4, Pixel de Facebook y modo protegido por contraseña.'
      ],
      apiEntities: 'Theme, Asset, Page, Article, Blog, Menu',
      devRole: 'Desarrollar temas con Shopify CLI (`shopify theme dev`), estructurar secciones dinámicas, programar snippets y mantener control de versiones con GitHub integration.',
      codeTitle: 'Terminal: Flujo de trabajo de desarrollo con Shopify CLI',
      code: `# Conectar entorno local con la tienda de desarrollo
shopify theme dev --store=casio-dev-store.myshopify.com

# Empujar cambios a un tema específico en la nube
shopify theme push --theme=148161134820

# Descargar el tema activo para versionar en Git
shopify theme pull`
    },
    'online-store-pages': {
      title: 'Online Store > Pages (Páginas Estáticas & Templates)',
      path: '/admin/pages',
      category: 'Content & Layouts',
      categoryColor: '#ec4899',
      desc: 'Gestor de páginas estáticas e institucionales. Permite redactar contenido con editor Rich Text (RTE) y, crucialmente, asignar <strong>Plantillas de Tema alternativas</strong> creadas en `templates/page.nombre.json`.',
      subsections: [
        '<strong>All Pages:</strong> Listado de páginas con estado de visibilidad (Visible / Hidden).',
        '<strong>Page Editor:</strong> Título, contenido HTML/RTE, asignación de Theme Template y configuración de vista previa de SEO (URL handle, meta title, description).'
      ],
      apiEntities: 'Page',
      devRole: 'Crear plantillas personalizadas en `templates/page.faq.json` o `templates/page.about.json` con secciones modulares exclusivas.',
      codeTitle: 'templates/page.about.json (Plantilla modular para página institucional)',
      code: `{
  "sections": {
    "banner": {
      "type": "image-banner",
      "settings": { "heading": "Nuestra Historia" }
    },
    "rich_text": {
      "type": "rich-text",
      "settings": { "text": "<p>Fundados con la pasión de traer la mejor relojería...</p>" }
    },
    "team_grid": {
      "type": "featured-team"
    }
  },
  "order": ["banner", "rich_text", "team_grid"]
}`
    },
    'online-store-preferences': {
      title: 'Online Store > Preferences (SEO, Tracking & Seguridad)',
      path: '/admin/online_store/preferences',
      category: 'Global Settings & Security',
      categoryColor: '#ec4899',
      desc: 'Configuraciones críticas del canal web: metadatos globales de la página de inicio, imagen social compartida (Open Graph), claves de Google Tag Manager, integración de píxeles y protección de la tienda con contraseña.',
      subsections: [
        '<strong>Title and meta description:</strong> Título principal y descripción SEO que indexa Google para la URL raíz `/`.',
        '<strong>Social sharing image:</strong> Imagen predeterminada para previews de WhatsApp, Facebook y Twitter (`og:image`).',
        '<strong>Password protection:</strong> Activación de página "Próximamente" para ocultar la tienda al público durante el desarrollo.',
        '<strong>Spam protection:</strong> Activación de Google reCAPTCHA v3 en formularios de contacto, login y comentarios.'
      ],
      apiEntities: 'ShopSettings, OnlineStoreSecurity',
      devRole: 'Verificar la configuración de metadatos Open Graph y asegurar que el píxel de seguimiento esté correctamente enlazado sin duplicar scripts.',
      codeTitle: 'Estructura SEO renderizada en <head> desde Preferences',
      code: `<title>{{ page_title }}</title>
<meta name="description" content="{{ page_description | escape }}">
<meta property="og:site_name" content="{{ shop.name }}">
<meta property="og:image" content="{{ page_image | image_url: width: 1200 }}">
<meta property="og:type" content="website">`
    },
    'apps': {
      title: 'Apps & Sales Channels (Ecosistema de Aplicaciones)',
      path: '/admin/apps',
      category: 'App Ecosystem & Integrations',
      categoryColor: '#14b8a6',
      desc: 'Hub de extensiones instaladas en la tienda. Permite configurar aplicaciones públicas del Shopify App Store y apps personalizadas (Custom Apps creadas por tu agencia o equipo de desarrollo).',
      subsections: [
        '<strong>Installed Apps:</strong> Panel de control y configuraciones de cada aplicación.',
        '<strong>Shopify App Store:</strong> Catálogo oficial con más de 8.000 aplicaciones verificadas.',
        '<strong>App and sales channel settings:</strong> Gestión de permisos de API (Access Scopes), credenciales de Admin API Tokens y Webhooks activos.'
      ],
      apiEntities: 'AppInstallation, AppCredit, WebhookSubscription',
      devRole: 'Crear Custom Apps mediante Shopify CLI (`npm init @shopify/app@latest`), gestionar OAuth 2.0 y configurar Theme App Extensions (App Blocks) para inyectar widgets sin tocar el código del tema.',
      codeTitle: 'Manifest de Theme App Extension (blocks/star-rating.liquid)',
      code: `{%- comment -%} Theme App Extension App Block {%- endcomment -%}
<div class="product-rating-stars" data-product-id="{{ product.id }}">
  ★★★★★ <span class="rating-count">(4.9/5)</span>
</div>

{% schema %}
{
  "name": "Star Rating Widget",
  "target": "section",
  "stylesheet": "rating.css",
  "javascript": "rating.js",
  "settings": [
    { "type": "color", "id": "star_color", "label": "Color de Estrellas", "default": "#f59e0b" }
  ]
}
{% endschema %}`
    }
  };

  // DOM Elements
  const menuButtons = document.querySelectorAll('.admin-menu-item, .admin-sub-item');
  const pathChip = document.getElementById('adminMenuPath');
  const titleEl = document.getElementById('adminMenuTitle');
  const categoryBadge = document.getElementById('adminCategoryBadge');
  const descEl = document.getElementById('adminMenuDesc');
  const subsectionsList = document.getElementById('adminSubsectionsList');
  const apiEntitiesEl = document.getElementById('adminApiEntities');
  const devRoleEl = document.getElementById('adminDevRole');
  const codeTitleEl = document.getElementById('adminCodeTitle');
  const codeBlockEl = document.getElementById('adminCodeBlock');

  function updateAdminExplorer(menuKey) {
    const data = adminMenuData[menuKey];
    if (!data) return;

    if (pathChip) pathChip.textContent = data.path;
    if (titleEl) titleEl.textContent = data.title;
    if (categoryBadge) {
      categoryBadge.textContent = data.category;
      categoryBadge.style.color = data.categoryColor;
      categoryBadge.style.background = `${data.categoryColor}22`;
    }
    if (descEl) descEl.textContent = data.desc;

    if (subsectionsList) {
      subsectionsList.innerHTML = data.subsections.map(sub => `<li>${sub}</li>`).join('');
    }

    if (apiEntitiesEl) apiEntitiesEl.textContent = data.apiEntities;
    if (devRoleEl) devRoleEl.textContent = data.devRole;
    if (codeTitleEl) codeTitleEl.textContent = data.codeTitle;

    if (codeBlockEl) {
      codeBlockEl.textContent = data.code;
      if (window.Prism) {
        Prism.highlightElement(codeBlockEl);
      }
    }
  }

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const menuKey = btn.getAttribute('data-admin-menu');
      updateAdminExplorer(menuKey);
    });
  });

  // Initial update
  updateAdminExplorer('home');
});
