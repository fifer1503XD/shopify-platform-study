/**
 * Draft Orders & Invoicing Simulator & Quiz Logic
 * Module 14 - Shopify Masterclass Tutorial
 */

document.addEventListener('DOMContentLoaded', () => {
  const qtyCatalogItem = document.getElementById('qtyCatalogItem');
  const qtyCustomItem = document.getElementById('qtyCustomItem');
  const lineTotalCatalog = document.getElementById('lineTotalCatalog');
  const lineTotalCustom = document.getElementById('lineTotalCustom');
  const customItemRow = document.getElementById('customItemRow');
  const btnAddCustomItemBtn = document.getElementById('btnAddCustomItemBtn');
  const btnRemoveCustomItem = document.getElementById('btnRemoveCustomItem');

  const draftDiscountSelect = document.getElementById('draftDiscountSelect');
  const draftShippingSelect = document.getElementById('draftShippingSelect');
  const draftCustomerName = document.getElementById('draftCustomerName');
  const draftCustomerEmail = document.getElementById('draftCustomerEmail');
  const draftCustomMessage = document.getElementById('draftCustomMessage');

  const draftSummarySubtotal = document.getElementById('draftSummarySubtotal');
  const draftSummaryDiscountLabel = document.getElementById('draftSummaryDiscountLabel');
  const draftSummaryDiscountAmount = document.getElementById('draftSummaryDiscountAmount');
  const draftSummaryShipping = document.getElementById('draftSummaryShipping');
  const draftSummaryGrandTotal = document.getElementById('draftSummaryGrandTotal');

  const previewEmailTo = document.getElementById('previewEmailTo');
  const previewEmailBody = document.getElementById('previewEmailBody');
  const previewBtnTotal = document.getElementById('previewBtnTotal');

  const btnSendDraftInvoice = document.getElementById('btnSendDraftInvoice');
  const btnResetDraftLab = document.getElementById('btnResetDraftLab');
  const draftOrderFeedback = document.getElementById('draftOrderFeedback');
  const draftOrderNumberBadge = document.getElementById('draftOrderNumberBadge');

  const PRICE_CATALOG = 189000;
  const PRICE_CUSTOM = 35000;
  let customItemActive = true;

  function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO') + ' COP';
  }

  function recalculateTotals() {
    const qtyCat = parseInt(qtyCatalogItem?.value || 1, 10);
    const qtyCust = customItemActive ? parseInt(qtyCustomItem?.value || 1, 10) : 0;

    const totalCat = qtyCat * PRICE_CATALOG;
    const totalCust = qtyCust * PRICE_CUSTOM;

    if (lineTotalCatalog) lineTotalCatalog.innerText = '$' + totalCat.toLocaleString('es-CO');
    if (lineTotalCustom) lineTotalCustom.innerText = '$' + totalCust.toLocaleString('es-CO');

    const subtotal = totalCat + totalCust;
    const discountPercent = parseInt(draftDiscountSelect?.value || 0, 10);
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const shipping = parseInt(draftShippingSelect?.value || 0, 10);
    const grandTotal = subtotal - discountAmount + shipping;

    // Update Summary
    if (draftSummarySubtotal) draftSummarySubtotal.innerText = formatCOP(subtotal);
    if (draftSummaryDiscountLabel) draftSummaryDiscountLabel.innerText = `Descuento aplicado (${discountPercent}%):`;
    if (draftSummaryDiscountAmount) draftSummaryDiscountAmount.innerText = `-${formatCOP(discountAmount)}`;
    if (draftSummaryShipping) draftSummaryShipping.innerText = formatCOP(shipping);
    if (draftSummaryGrandTotal) draftSummaryGrandTotal.innerText = formatCOP(grandTotal);

    // Update Email Preview
    if (previewEmailTo && draftCustomerEmail) previewEmailTo.innerText = draftCustomerEmail.value || 'cliente@ejemplo.com';
    if (previewEmailBody && draftCustomMessage) previewEmailBody.innerText = draftCustomMessage.value || 'Adjuntamos tu cotización.';
    if (previewBtnTotal) previewBtnTotal.innerText = formatCOP(grandTotal);
  }

  // Event Listeners for inputs
  if (qtyCatalogItem) qtyCatalogItem.addEventListener('input', recalculateTotals);
  if (qtyCustomItem) qtyCustomItem.addEventListener('input', recalculateTotals);
  if (draftDiscountSelect) draftDiscountSelect.addEventListener('change', recalculateTotals);
  if (draftShippingSelect) draftShippingSelect.addEventListener('change', recalculateTotals);
  if (draftCustomerEmail) draftCustomerEmail.addEventListener('input', recalculateTotals);
  if (draftCustomMessage) draftCustomMessage.addEventListener('input', recalculateTotals);

  // Toggle Custom Item
  if (btnRemoveCustomItem && customItemRow) {
    btnRemoveCustomItem.addEventListener('click', () => {
      customItemActive = false;
      customItemRow.style.display = 'none';
      if (btnAddCustomItemBtn) btnAddCustomItemBtn.style.display = 'inline-block';
      recalculateTotals();
    });
  }

  if (btnAddCustomItemBtn && customItemRow) {
    btnAddCustomItemBtn.addEventListener('click', () => {
      customItemActive = true;
      customItemRow.style.display = 'flex';
      if (qtyCustomItem) qtyCustomItem.value = 1;
      btnAddCustomItemBtn.style.display = 'none';
      recalculateTotals();
    });
  }

  // Send Invoice Simulation
  if (btnSendDraftInvoice && draftOrderFeedback) {
    btnSendDraftInvoice.addEventListener('click', () => {
      const email = draftCustomerEmail?.value || 'cliente@ejemplo.com';
      const name = draftCustomerName?.value || 'Cliente';
      const totalStr = draftSummaryGrandTotal?.innerText || '$0';

      draftOrderFeedback.style.display = 'block';
      draftOrderFeedback.className = 'quiz-feedback-box success';
      draftOrderFeedback.innerHTML = `
        <strong>🎉 ¡Factura de Borrador Enviada Exitosamente!</strong><br>
        <p style="margin-top: 0.5rem; line-height: 1.6;">
          Se ha enviado el correo transaccional con el enlace de pago seguro a <strong>${email}</strong>.<br>
          <strong>Simulación de Checkout:</strong> El cliente <em>${name}</em> abrió el email, ingresó al checkout protegido de Shopify y abonó <strong>${totalStr}</strong> con tarjeta de crédito.
        </p>
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 0.75rem 1rem; border-radius: 6px; margin-top: 0.75rem; font-family: var(--font-mono); font-size: 0.85rem;">
          ✓ Draft Order #DRAFT-1042 cerrado → Convertido a <strong>Order #1042 (Status: PAID / Unfulfilled)</strong>.<br>
          ✓ Inventario de <em>Casio Vintage Digital A168WA</em> descontado automáticamente del catálogo.<br>
          ✓ El Custom Item (Grabado Láser) fue cobrado sin ensuciar la base de datos de productos.
        </div>
      `;

      if (draftOrderNumberBadge) {
        draftOrderNumberBadge.innerHTML = '<span style="color: #10b981;">#ORDER-1042 (PAGADA)</span>';
      }
    });
  }

  // Reset Button
  if (btnResetDraftLab) {
    btnResetDraftLab.addEventListener('click', () => {
      if (qtyCatalogItem) qtyCatalogItem.value = 1;
      if (qtyCustomItem) qtyCustomItem.value = 1;
      customItemActive = true;
      if (customItemRow) customItemRow.style.display = 'flex';
      if (btnAddCustomItemBtn) btnAddCustomItemBtn.style.display = 'none';
      if (draftDiscountSelect) draftDiscountSelect.value = '15';
      if (draftShippingSelect) draftShippingSelect.value = '12000';
      if (draftCustomerName) draftCustomerName.value = 'Laura Martínez';
      if (draftCustomerEmail) draftCustomerEmail.value = 'laura.martinez@ejemplo.com';
      if (draftCustomMessage) draftCustomMessage.value = '¡Hola Laura! Adjuntamos tu cotización con grabado láser y 15% OFF de cortesía.';
      if (draftOrderFeedback) draftOrderFeedback.style.display = 'none';
      if (draftOrderNumberBadge) draftOrderNumberBadge.innerHTML = '<span style="color: var(--brand-shopify);">#DRAFT-1042</span>';
      recalculateTotals();
    });
  }

  // Knowledge Check Quiz Verification
  const btnCheckDraftQuiz = document.getElementById('btnCheckDraftQuiz');
  if (btnCheckDraftQuiz) {
    btnCheckDraftQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="draft_q1"]:checked')?.value;
      const q2 = document.querySelector('input[name="draft_q2"]:checked')?.value;

      const f1 = document.getElementById('feedback-draft-q1');
      const f2 = document.getElementById('feedback-draft-q2');

      if (f1) {
        if (q1 === 'b') {
          f1.className = 'quiz-feedback correct';
          f1.innerHTML = '<strong>✓ ¡Correcto!</strong> Un Custom Item es efímero y pertenece exclusivamente a ese borrador de pedido; no crea un registro en el catálogo permanente de productos de la tienda.';
        } else {
          f1.className = 'quiz-feedback incorrect';
          f1.innerHTML = '<strong>✕ Incorrecto.</strong> Los Custom Items no se agregan a la base de datos de productos de la tienda ni requieren crear SKUs permanentes.';
        }
      }

      if (f2) {
        if (q2 === 'a') {
          f2.className = 'quiz-feedback correct';
          f2.innerHTML = '<strong>✓ ¡Exacto!</strong> La opción <code>Reserve items</code> descuenta temporalmente las unidades del inventario disponible para asegurar el stock mientras el cliente procesa la factura.';
        } else {
          f2.className = 'quiz-feedback incorrect';
          f2.innerHTML = '<strong>✕ Incorrecto.</strong> La funcionalidad nativa de Shopify para bloquear stock antes del pago es <code>Reserve items</code>.';
        }
      }
    });
  }

  // Initial Calculation
  recalculateTotals();
});
