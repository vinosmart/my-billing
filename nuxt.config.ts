// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  ssr: false,

  app: {
    head: {
      title: "Textile Store Billing System",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
          defer: true,
        },
      ],
    },
  },

  compatibilityDate: "2025-06-03",
});
