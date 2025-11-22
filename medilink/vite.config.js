import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "logo192.png",
        "logo512.png"
      ],
      manifest: {
        name: "MediLink - Healthcare Booking",
        short_name: "MediLink",
        description: "Healthcare appointment booking platform",
        theme_color: "#007bff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        orientation: "portrait-primary",

        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: "CacheFirst",
            options: {
              cacheName: "static-cache"
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache"
            }
          }
        ]
      }
    })
  ]
});
