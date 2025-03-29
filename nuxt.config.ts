import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/main.css"],
  serverMiddleware: [{ path: "/api", handler: "~/server/index.js" }],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: true,
  // pwa: {
  //   manifest: {
  //     name: 'Textile Billing Software',
  //     short_name: 'Billing',
  //     theme_color: '#ffffff',
  //   },
  //   workbox: {
  //     enabled: true,
  //   },
  // },
});
