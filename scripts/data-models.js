// Interactive Data Models and Schema Definitions

window.ShopifyCourseData = {
  products: {
    complexTech: {
      id: "gid://shopify/Product/84729103948",
      title: "Auriculares Noise-Cancelling Pro X900",
      vendor: "AcousticLab",
      productType: "Audio Profesional",
      handle: "auriculares-noise-cancelling-pro-x900",
      options: [
        { name: "Color", values: ["Midnight Black", "Arctic Silver", "Carbon Matte"] },
        { name: "Edición", values: ["Standard", "Studio Edition con DAC"] }
      ],
      metafields: {
        custom: {
          tech_specs: {
            driver_size: "45mm Neodymium Beryllium",
            frequency_response: "5Hz - 40,000Hz",
            battery_life: "48 Horas (ANC On)",
            connectivity: "Bluetooth 5.3 aptX HD / Jack 3.5mm balanceado",
            dac_support: "32-bit / 384kHz Hi-Res Audio"
          },
          specs_pdf: {
            url: "#",
            filename: "Tech-Specs-X900-Manual-v2.pdf",
            filesize: "4.2 MB"
          },
          warranty_and_care: {
            title: "Garantía Extendida & Protocolo de Cuidado Pro",
            coverage_period: "3 Años Internacional con reemplazo Express",
            cleaning_instructions: [
              "Limpiar las almohadillas de espuma viscoelástica solo con paño seco de microfibra.",
              "Evitar exposición directa a solventes de alcohol o humedad superior al 80%.",
              "Recargar siempre utilizando el cable trenzado USB-C blindado provisto."
            ],
            contact_support: "support@acousticlab-audio.com"
          }
        }
      }
    }
  }
};
