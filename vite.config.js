import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      react(),
      tailwindcss(),
      !isDev &&
        VitePWA({
          registerType: "autoUpdate",
          includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
          manifest: {
            name: "NT Lyrics & Chords",
            short_name: "NTLyrics",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#3367D6",
            icons: [
              {
                src: "pwa-192x192.png",
                type: "image/png",
                sizes: "192x192",
              },
              {
                src: "pwa-512x512.png",
                type: "image/png",
                sizes: "512x512",
              },
            ],
          },
        }),
    ].filter(Boolean),
  base: "/",
  server: {
    host: "127.0.0.1",
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  preview: {
    port: 4173,
  },
  };
});
