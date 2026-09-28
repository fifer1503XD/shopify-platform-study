/**
 * RBAC (Role-Based Access Control) Interactive Simulator & Quiz Logic
 * Module 13 - Shopify Masterclass Tutorial
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements for Role Builder
  const permDraftView = document.getElementById('permDraftView');
  const permDraftCreateEdit = document.getElementById('permDraftCreateEdit');
  const permDraftDelete = document.getElementById('permDraftDelete');

  const permCustView = document.getElementById('permCustView');
  const permCustCreateEdit = document.getElementById('permCustCreateEdit');
  const permCustExport = document.getElementById('permCustExport');

  const permProdView = document.getElementById('permProdView');
  const permProdCreateEdit = document.getElementById('permProdCreateEdit');
  const permProdDelete = document.getElementById('permProdDelete');

  const permSettingsView = document.getElementById('permSettingsView');
  const permFinancesView = document.getElementById('permFinancesView');

  const rbacPayloadCode = document.getElementById('rbacPayloadCode');
  const rbacPermCountBadge = document.getElementById('rbacPermCountBadge');
  const rbacMenuSimulatedList = document.getElementById('rbacMenuSimulatedList');
  const btnValidateRbacRole = document.getElementById('btnValidateRbacRole');
  const btnResetRbacLab = document.getElementById('btnResetRbacLab');
  const rbacValidationFeedback = document.getElementById('rbacValidationFeedback');

  const allCheckboxes = document.querySelectorAll('.rbac-perm-checkbox');

  // Cascade automatic selection (e.g. create_edit implies view)
  if (permDraftCreateEdit && permDraftView) {
    permDraftCreateEdit.addEventListener('change', () => {
      if (permDraftCreateEdit.checked) permDraftView.checked = true;
      updatePayload();
    });
  }

  if (permCustCreateEdit && permCustView) {
    permCustCreateEdit.addEventListener('change', () => {
      if (permCustCreateEdit.checked) permCustView.checked = true;
      updatePayload();
    });
  }

  if (permProdCreateEdit && permProdView) {
    permProdCreateEdit.addEventListener('change', () => {
      if (permProdCreateEdit.checked) permProdView.checked = true;
      updatePayload();
    });
  }

  function updatePayload() {
    const permissions = [];
    const simulatedMenus = ['Home (Inicio)'];

    if (permDraftView?.checked) permissions.push('DRAFT_ORDERS_READ');
    if (permDraftCreateEdit?.checked) {
      permissions.push('DRAFT_ORDERS_CREATE');
      permissions.push('DRAFT_ORDERS_UPDATE');
      if (!simulatedMenus.includes('Orders > Drafts')) simulatedMenus.push('Orders > Drafts');
    } else if (permDraftView?.checked) {
      if (!simulatedMenus.includes('Orders > Drafts (Solo Lectura)')) simulatedMenus.push('Orders > Drafts (Solo Lectura)');
    }
    if (permDraftDelete?.checked) permissions.push('DRAFT_ORDERS_DELETE');

    if (permCustView?.checked) permissions.push('CUSTOMERS_READ');
    if (permCustCreateEdit?.checked) {
      permissions.push('CUSTOMERS_CREATE');
      permissions.push('CUSTOMERS_UPDATE');
      if (!simulatedMenus.includes('Customers (Clientes)')) simulatedMenus.push('Customers (Clientes)');
    } else if (permCustView?.checked) {
      if (!simulatedMenus.includes('Customers (Solo Lectura)')) simulatedMenus.push('Customers (Solo Lectura)');
    }
    if (permCustExport?.checked) permissions.push('CUSTOMERS_EXPORT_PII');

    if (permProdView?.checked) {
      permissions.push('PRODUCTS_READ');
      if (!simulatedMenus.includes('Products (Catálogo)')) simulatedMenus.push('Products (Catálogo)');
    }
    if (permProdCreateEdit?.checked) {
      permissions.push('PRODUCTS_CREATE');
      permissions.push('PRODUCTS_UPDATE');
    }
    if (permProdDelete?.checked) permissions.push('PRODUCTS_DELETE');

    if (permSettingsView?.checked) {
      permissions.push('SETTINGS_READ');
      simulatedMenus.push('Settings (Configuración)');
    }
    if (permFinancesView?.checked) {
      permissions.push('FINANCES_REPORTS_READ');
      simulatedMenus.push('Finances & Analytics');
    }

    // Update Perm Count Badge
    if (rbacPermCountBadge) {
      rbacPermCountBadge.innerText = `${permissions.length} permisos activos`;
    }

    // Update GraphQL mutation payload preview
    if (rbacPayloadCode) {
      const payloadObj = {
        mutation: "roleCreate",
        input: {
          name: "Customer Service Specialist",
          description: "Manages customer records and creates draft orders.",
          permissions: permissions
        }
      };
      rbacPayloadCode.innerText = JSON.stringify(payloadObj, null, 2);
      if (window.Prism) {
        Prism.highlightElement(rbacPayloadCode);
      }
    }

    // Update simulated menu list
    if (rbacMenuSimulatedList) {
      rbacMenuSimulatedList.innerHTML = simulatedMenus.map(menu => {
        return `<span class="badge-tag" style="background: rgba(99, 102, 241, 0.15); color: #818cf8; font-weight: 600;">✓ ${menu}</span>`;
      }).join(' ');
    }
  }

  allCheckboxes.forEach(cb => {
    cb.addEventListener('change', updatePayload);
  });

  // Reset Button
  if (btnResetRbacLab) {
    btnResetRbacLab.addEventListener('click', () => {
      allCheckboxes.forEach(cb => { cb.checked = false; });
      if (rbacValidationFeedback) {
        rbacValidationFeedback.style.display = 'none';
      }
      updatePayload();
    });
  }

  // Validation Button Logic
  if (btnValidateRbacRole && rbacValidationFeedback) {
    btnValidateRbacRole.addEventListener('click', () => {
      const hasDraftCreate = permDraftCreateEdit?.checked;
      const hasCustCreate = permCustCreateEdit?.checked;
      const hasProdView = permProdView?.checked;
      const hasProdEdit = permProdCreateEdit?.checked;
      const hasProdDelete = permProdDelete?.checked;
      const hasCustExport = permCustExport?.checked;
      const hasSettings = permSettingsView?.checked;
      const hasFinances = permFinancesView?.checked;

      // Evaluation Rules
      const isSuccess = hasDraftCreate && hasCustCreate && hasProdView && !hasProdEdit && !hasProdDelete && !hasCustExport && !hasSettings && !hasFinances;

      rbacValidationFeedback.style.display = 'block';

      if (isSuccess) {
        rbacValidationFeedback.className = 'quiz-feedback-box success';
        rbacValidationFeedback.innerHTML = `
          <strong>🎉 ¡Excelente configuración de RBAC! Cumple 100% con los estándares de seguridad Enterprise:</strong>
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem; line-height: 1.6;">
            <li><strong>Draft Orders:</strong> Permitido crear y editar pedidos manuales para atender llamadas y tickets.</li>
            <li><strong>Customers:</strong> Acceso para crear y actualizar información de contacto de clientes sin fuga de PII en exportaciones.</li>
            <li><strong>Products (Principio de Menor Privilegio):</strong> Solo lectura habilitada. El equipo de soporte puede consultar SKU y stock sin riesgo de alterar precios de venta o eliminar variantes por error.</li>
            <li><strong>Seguridad Financiera:</strong> Sin acceso a configuración ni liquidaciones bancarias.</li>
          </ul>
          <p style="margin-top: 0.5rem; color: #10b981; font-weight: 700;">
            ✓ Rol listo para ser guardado y asignado a los 10 agentes de atención al cliente en el Shopify Admin.
          </p>
        `;
      } else {
        const errors = [];
        if (!hasDraftCreate) errors.push('Falta habilitar <code>Crear y editar borradores de pedido (Create & Edit)</code> en Draft Orders.');
        if (!hasCustCreate) errors.push('Falta habilitar <code>Crear y editar clientes (Create & Edit)</code> en Customers.');
        if (!hasProdView) errors.push('Falta habilitar <code>Ver catálogo y variantes (View products)</code> para que puedan consultar precios.');
        if (hasProdEdit || hasProdDelete) errors.push('<strong>Infracción de seguridad:</strong> El rol tiene permisos de editar o eliminar productos. Debe ser estrictamente modo lectura (View only).');
        if (hasCustExport) errors.push('<strong>Riesgo de privacidad (PII):</strong> Los agentes de soporte no deben exportar bases de clientes masivas en CSV.');
        if (hasSettings || hasFinances) errors.push('<strong>Infracción de seguridad:</strong> El rol contiene accesos a Configuración o Finanzas que deben permanecer restringidos.');

        rbacValidationFeedback.className = 'quiz-feedback-box error';
        rbacValidationFeedback.innerHTML = `
          <strong>❌ La configuración actual no cumple los requisitos de seguridad:</strong>
          <ul style="margin-top: 0.5rem; margin-left: 1.25rem; line-height: 1.6;">
            ${errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
        `;
      }
    });
  }

  // Knowledge Check Quiz Verification
  const btnCheckRbacQuiz = document.getElementById('btnCheckRbacQuiz');
  if (btnCheckRbacQuiz) {
    btnCheckRbacQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="rbac_q1"]:checked')?.value;
      const q2 = document.querySelector('input[name="rbac_q2"]:checked')?.value;

      const f1 = document.getElementById('feedback-rbac-q1');
      const f2 = document.getElementById('feedback-rbac-q2');

      if (f1) {
        if (q1 === 'b') {
          f1.className = 'quiz-feedback correct';
          f1.innerHTML = '<strong>✓ ¡Correcto!</strong> El checkbox de nivel superior otorga de manera unificada todos los permisos disponibles de esa categoría (lectura, creación, modificación, eliminación y exportación).';
        } else {
          f1.className = 'quiz-feedback incorrect';
          f1.innerHTML = '<strong>✕ Incorrecto.</strong> Al marcar la categoría principal se otorgan todos los permisos de la categoría. Para restringir a solo lectura se deben usar los permisos granulares desglosados.';
        }
      }

      if (f2) {
        if (q2 === 'b') {
          f2.className = 'quiz-feedback correct';
          f2.innerHTML = '<strong>✓ ¡Exacto!</strong> Cada miembro del personal de venta en salón utiliza un Staff PIN único de 4 a 6 dígitos para autenticarse rápidamente en Shopify POS y registrar sus ventas.';
        } else {
          f2.className = 'quiz-feedback incorrect';
          f2.innerHTML = '<strong>✕ Incorrecto.</strong> El método oficial y ágil en tienda física es el Staff PIN numérico de 4 a 6 dígitos.';
        }
      }
    });
  }

  // Initial render
  updatePayload();
});
